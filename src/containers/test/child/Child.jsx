import styles from './style.less';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import useStores from '@hooks/useStores';

export default observer(props => {
    const { test } = useStores();

    useEffect(() => {
        test.addArr(test.count);
    }, [test.count]);

    const addCount = () => {
        test.setStore({
            count: test.count + 1
        });
    };

    return (
        <div>
            <p>count:{test.count}</p>
            <p>count2:{test.count2}</p>
            <hr/>
            <p>list:</p>
            {
                test.arr.map(n => <p key={n}>{n}</p>)
            }
            <hr/>
            <p onClick={addCount}>add count</p>
        </div>
    );
});
