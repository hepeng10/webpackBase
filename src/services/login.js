import http  from '@utils/http';
import { HttpMethod } from '@/constants/enum';

export function login(params) {
    return http({
        url: 'login',
        type: HttpMethod.POST,
    });
}

export function get(params) {
    return http({
        url: 'get',
        params
    });
}

export function post(params) {
    return http({
        url: 'post',
        type: HttpMethod.POST,
        enableLoading: true,  // 配置请求时是否显示全局 loading
        params
    });
}
