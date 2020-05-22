/**
 * Created by hepeng on 2020/4/7
 */
import { observable, action, computed } from 'mobx';

import { getXxxList } from '@/services/demo';

class Test {
    @observable count = 111;
    @observable arr = [1, 2, 3];
    @observable list = [];

    @computed get count2() {
        return this.count + 10;
    }

    @action addArr = (n) => {
        this.arr.push(n);
    }

    // 异步请求 demo
    @action getList = async() => {
        try {
            const res = await getXxxList();
            this.setStore({
                list: res,
            });
        } catch (e) {
            throw new Error(e);
        }
    }

    // 封装更新 store 的方法，使用方法类似 setState()
    @action setStore = (data) => {
        Object.keys(data).forEach(k => {
            this[k] = data[k];
        });
    }

}

export default new Test();
