import { observable, action } from 'mobx';

class Loading {
    @observable count = 111;
    @observable a = 222;
    @observable isLoading = false;

    @action showLoading = () => {
        this.isLoading = true;
    };

    @action hideLoading = () => {
        this.isLoading = false;
    };

    @action addCount = () => {
        this.count++;
    };

    @action addA = () => {
        this.a++;
    };
}

export default new Loading();