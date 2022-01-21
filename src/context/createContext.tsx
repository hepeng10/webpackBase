import { createContext, useContext as useCxt } from 'react';

type ReturnType<Value> = {
  Provider: React.FC;
  useContext: () => Value;
};

export default function <Value>(hooks: () => Value, initValue: Value): ReturnType<Value> {
  const Context = createContext<Value>(initValue);
  const useContext = () => useCxt<Value>(Context);
  const Provider: React.FC = (props) => {
    const value = hooks();
    return <Context.Provider value={value}>{props.children}</Context.Provider>;
  };

  return { Provider, useContext };
}
