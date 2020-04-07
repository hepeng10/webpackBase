/**
 * Created by hepeng on 2020/4/7
 */
import { observable, action } from 'mobx';

class Test {
    @observable count = 111;
    @observable arr = [1, 2, 3];

    @action addCount = () => {
        this.count++;
    };

    @action addArr = (n) => {
        this.arr.push(n);
    };
}

export default new Test();