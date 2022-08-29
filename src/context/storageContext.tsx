// createContext 使用 demo
import {
  getCurrentInstance,
  getLocation,
  getStorageSync,
  getSystemInfo,
  setStorage,
  setStorageSync
} from '@tarojs/taro';
import { useEffect, useState } from 'react';

import env from '@/config/index';
import { getCityList, getTypeList, IcityStruct, IworkTypeStruct } from '@/services/api';
import { getUserLocation, IlocatParams } from '@/services/login';
import { SystemInfo, UserInfo, UserLocation } from '@/types/index';
import routeTo from '@/utils/routeTo';
import { codeLogin, envExecute, isLogin } from '@/utils/utils';

import createContext from './createContext';

export type Value = {
  treeWorkTypeList?: IworkTypeStruct[];
  setTreeWorkTypeList: (value: IworkTypeStruct[]) => void;
  treeCityList?: IcityStruct[];
  setTreeCityList: (value: IcityStruct[]) => void;
  userLocation: Partial<UserLocation>;
  setUserLocation: (value: UserLocation) => void;
  systemInfo?: SystemInfo;
  setSystemInfo: (value: SystemInfo) => void;
  userInfo: Partial<UserInfo>;
  setUserInfo: (value: UserInfo) => void;
};

/*
 * 1.小程序启动，请求并保存 storage 数据
 * 2.通过 context 提供数据供子组件使用
 */
const StorageContext = createContext<Value>(() => {
  const [treeWorkTypeList, setTreeWorkTypeList] = useState<IworkTypeStruct[]>(
    getStorageSync('treeWorkTypeList')
  );
  const [treeCityList, setTreeCityList] = useState<IcityStruct[]>(getStorageSync('treeCityList'));
  const [userLocation, setUserLocation] = useState<Partial<UserLocation>>(
    getStorageSync('userLocation') || {}
  );
  const [systemInfo, setSystemInfo] = useState<SystemInfo>(getStorageSync('systemInfo'));
  const [userInfo, setUserInfo] = useState<Partial<UserInfo>>(getStorageSync('userInfo') || {});

  // 登录
  const login = () => {
    codeLogin()
      .then((res) => {
        setUserInfo(res as UserInfo);
      })
      .catch((err) => {
        console.log(err, '登录失败');
        if (err === 10401) {
          setStorage({
            key: 'guide',
            data: 1,
            success: () => {
              routeTo({ url: '/pages/personalCenter/pages/login/index', close: false });
            }
          });
        }
      });
  };

  // 获取城市列表
  const getCity = async () => {
    let res: IcityStruct[] = await getCityList();
    if (res.length > 0) {
      setStorageSync('treeCityList', res);
      setTreeCityList(res);

      let newRes = JSON.parse(JSON.stringify(res));
      let temp: IcityStruct[] = [];
      const changeDataType = (source) => {
        source.forEach((el) => {
          temp.push(el);
          // 子级递归
          if (el.children && el.children.length > 0) {
            changeDataType(el.children);
          }
        });
      };

      changeDataType(newRes);
      setStorageSync('parCityList', temp);
    }
  };

  // 获取工种列表
  const getWorkTypeList = async () => {
    let res = await getTypeList();

    // 删除其它招工信息
    const delOtherInfo = (list: IworkTypeStruct[]): IworkTypeStruct[] => {
      const other = list.find((item) => item.name === '其他类招工');
      if (other) {
        let index;
        other.list?.find((item, i) => {
          if (item.name === '其他招工信息') {
            index = i;
            return true;
          }
        });
        other.list?.splice(index, 1);
      }
      return list;
    };

    if (res.list && res.list.length > 0) {
      const list = envExecute<IworkTypeStruct[]>({
        // 头条小程序删除其它招工信息，避免其它招工信息中有违规的招工信息导致审核不通过
        tt() {
          return delOtherInfo(res.list);
        },
        default() {
          return res.list;
        }
      });

      // 树形工种数据结构
      setStorageSync('treeWorkTypeList', list);
      setTreeWorkTypeList(list);

      let newList = JSON.parse(JSON.stringify(list));
      let workArr: IworkTypeStruct[] = [];
      const changeDataType = (source) => {
        source.forEach((el) => {
          // 子级递归
          if (el.list && el.list.length > 0 && el.level < 3) {
            workArr.push(el);
            changeDataType(el.list);
          }
        });
      };
      changeDataType(newList);
      // 拉平的工种数据结构
      setStorageSync('parWorkTypeList', workArr);
    }
  };

  // 保存 url 中的邀请码到本地
  const saveInviteCode = () => {
    const router = getCurrentInstance().router;
    const inviteCode = router?.params?.invite_code;
    if (inviteCode) {
      setStorageSync('invite_code', router?.params?.invite_code);
    }
  };

  // 获取定位数据
  const getMyLocation = () => {
    getLocation({
      success: async (e) => {
        let payload: IlocatParams = {
          key: env.mapKey,
          location: `${e.longitude.toFixed(6)},${e.latitude.toFixed(2)}`
        };
        let res: any = await getUserLocation(payload);
        const data: UserLocation = {
          cityCode: res.regeocode.addressComponent.adcode,
          address: res.regeocode.formatted_address,
          province: res.regeocode.addressComponent.province,
          cityName: res.regeocode.addressComponent.city,
          district: res.regeocode.addressComponent.district
        };
        setUserLocation(data);
        setStorageSync('userLocation', data);
      },
      fail: (res) => {
        const data: UserLocation = {
          cityCode: 0,
          address: '',
          province: '',
          cityName: '全国',
          district: ''
        };
        setUserLocation(data);
        setStorageSync('userLocation', data);
      }
    });
  };

  // 获取系统信息
  const getSysInfo = () => {
    getSystemInfo({
      success: (res) => {
        let info: SystemInfo = '';
        if (res.system.toLocaleLowerCase().indexOf('android') !== -1) {
          info = 'android';
        }
        if (res.system.toLocaleLowerCase().indexOf('ios') !== -1) {
          info = 'ios';
        }
        setSystemInfo(info!);
        setStorageSync('systemInfo', info);
      }
    });
  };

  useEffect(() => {
    console.log('storageContext init');

    if (!isLogin()) {
      login();
    }

    getCity();
    getWorkTypeList();
    saveInviteCode();
    getMyLocation();
    getSysInfo();
  }, []);

  return {
    userInfo,
    setUserInfo,
    treeWorkTypeList,
    setTreeWorkTypeList,
    treeCityList,
    setTreeCityList,
    userLocation,
    setUserLocation,
    systemInfo,
    setSystemInfo
  };
});

export default StorageContext;
