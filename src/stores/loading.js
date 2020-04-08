import { observable, action } from 'mobx';

class Loading {
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
}

export default new Loading();