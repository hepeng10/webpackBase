import loadable from './loadable';

export default (path) => {
    return loadable(() => import(`@/${path}`));  // import 接收的参数不能是纯变量，前面必须带有字符串内容
};