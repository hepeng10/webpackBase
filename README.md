# webpack 脚手架

## mobx
1. 创建 store 目录，在 index.ts 中使用 React.createContext 包装 mobx 创建的 store，并返回一个 storeContext。
2. 在 hooks 目录中创建 useStores.ts 使用 React.useContext(storeContext) 包装上面的 storeContext，并返回一个 useStores 自定义 hooks。
3. 在需要使用 store 的组件中使用 mobx-react 导出的 observer 方法包装组件，在组件中使用上面的 useStores 方法可以导出我们第一部中编写的各种 store。

> mobx 高版本会出现数据更新，视图不更新的情况，可使用 makeObservable(this) 来解决，详情： [Mobx-React-lite学习](https://juejin.cn/post/7016602169889521694)

在 react 项目中，新版的 mobx 配合 mobx-react-lite 库，甚至可以在写好 class 的 store 后，在 observer 的组件中直接使用 store。[谈谈 React 5种最流行的状态管理库](https://blog.51cto.com/u_15492153/5277859)
```ts
// 这是一个 store 文件

import { action, computed, makeAutoObservable, observable } from 'mobx';

// import { getXxxList } from '@/services/demo';

class Test {
    constructor() {
        // 解决数据更新页面不跟着更新的方法
        makeAutoObservable(this);
    }

    @observable count = 1;
    // 封装更新 store 的方法，使用方法类似 setState()
    @action setStore = (data) => {
        Object.keys(data).forEach(k => {
            this[k] = data[k];
        });
    }

}

export default new Test();

```

```tsx
// 这是使用 store 的组件
// 使用 observer 包裹组件，直接将上面的 test 引进来使用，修改 test 的状态组件就会更新

import { Button, View } from '@tarojs/components';
import { observer } from 'mobx-react-lite';

import test from './test';

const Index = () => {
  const add = () => {
    test.setStore({ count: test.count + 1 });
    console.log(123, test);
  };

  return <View className={styles.content}>
    <View>tab1</View>
    <Button onClick={add}>{test.count}</Button>
  </View>;
};

export default observer(Index);

```

#### mobx 的一些实践
[Hooks & Mobx 只需额外知道两个 Hook，便能体验到如此简单的开发方式](http://www.zyiz.net/tech/detail-132729.html)