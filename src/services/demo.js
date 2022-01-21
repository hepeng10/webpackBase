import http  from '@/utils/http';
import { HttpMethod } from '@/constants/enum';

export function login(params) {
    return http({
        url: 'login',
        type: HttpMethod.POST,
    });
}

export function getXxxList(params) {
    return http({
        url: 'xxx/getXxx',
        data: params
    });
}

export function post(params) {
    return http({
        url: 'post',
        type: HttpMethod.POST,
        enableLoading: true,  // 配置请求时是否显示全局 loading
        data: params
    });
}

// 文件上传
export function apiUpload(params) {
    return http({
        url: `${API}/admin/uploadImg`,
        data: params,  // 如：{ file: FIle }
        type: HttpMethod.POST,
        contentType: ContentType.FORM_DATA,  // 使用 formData
    });
}
