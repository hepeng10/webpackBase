import { observable, action } from 'mobx';

class Loading {
    @observable isLoading = false;

    @action showLoading = () => {
        this.isLoading = true;
    };

    @action hideLoading = () => {
        this.isLoading = false;
    };
}

export default new Loading();