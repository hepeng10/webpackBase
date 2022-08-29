import { createContext as createCxt, useContext as useCxt } from 'react';

type Return<Value> = {
  Provider: React.FC;
  useContext: () => Value;
};

// 创建 context 的工厂函数
export default function createContext<Value>(
  hooks: (defaultValue?: Value) => Value, // 函数的返回值 value 将提供给 Provider 的 value
  defaultValue?: Value
): Return<Value> {
  const Context = createCxt<Value>(defaultValue as Value);
  const useContext = () => useCxt<Value>(Context);
  const Provider: React.FC = (props) => {
    const value = hooks(defaultValue);
    return <Context.Provider value={value}>{props.children}</Context.Provider>;
  };

  return { Provider, useContext };
}
