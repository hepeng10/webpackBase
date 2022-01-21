import { getCurrentInstance, getLocation, getSystemInfo, setStorageSync } from '@tarojs/taro';
import { useEffect, useState } from 'react';

import { getCityList, getTypeList, IcityStruct, IworkTypeStruct } from '@/services/api';
import { getUserLocation, IlocatParams } from '@/services/login';
import { envExecute } from '@/utils/utils';

import createContext from './createContext';

export type Value = {
  treeWorkTypeList?: IworkTypeStruct[];
  setTreeWorkTypeList?: (value: IworkTypeStruct[]) => void;
  treeCityList?: IcityStruct[];
  setTreeCityList?: (value: IcityStruct[]) => void;
};

/*
 * 1.小程序启动，请求并保存 storage 数据
 * 2.通过 context 提供数据供子组件使用
 */
const StorageContext = createContext<Value>(() => {
  const [treeWorkTypeList, setTreeWorkTypeList] = useState<IworkTypeStruct[]>();
  const [treeCityList, setTreeCityList] = useState<IcityStruct[]>();

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
          coordtype: 'wgs84ll',
          output: 'json',
          ak: 'vaVH6Ls3Tisndi940ma2keNeGSm0UvH4',
          location: `${e.latitude},${e.longitude}`
        };
        let res: any = await getUserLocation(payload);
        setStorageSync('userLocation', {
          cityCode: res.result.addressComponent.adcode,
          address: res.result.formatted_address,
          province: res.result.addressComponent.province,
          cityName: res.result.addressComponent.city,
          district: res.result.addressComponent.district,
          location: res.location
        });
      },
      fail: (res) => {
        setStorageSync('userLocation', {
          cityCode: 0,
          address: '',
          province: '',
          cityName: '全国',
          district: '',
          location: {}
        });
      }
    });
  };

  // 获取系统信息
  const getSysInfo = () => {
    getSystemInfo({
      success: (res) => {
        let info: any = res;
        if (res.system.toLocaleLowerCase().indexOf('android') !== -1) {
          info = 'android';
        }
        if (res.system.toLocaleLowerCase().indexOf('ios') !== -1) {
          info = 'ios';
        }
        setStorageSync('sysTemInfo', info);
      }
    });
  };

  useEffect(() => {
    console.log('storageContext 获取 storage 数据');
    getCity();
    getWorkTypeList();
    saveInviteCode();
    getMyLocation();
    getSysInfo();
  }, []);

  return {
    treeWorkTypeList,
    setTreeWorkTypeList,
    treeCityList,
    setTreeCityList
  };
}, {});

export default StorageContext;
