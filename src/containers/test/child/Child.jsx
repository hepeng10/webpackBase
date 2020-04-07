import styles from './style.less';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import useStores from '@hooks/useStores';

export default observer(props => {
    const { test } = useStores();

    useEffect(() => {
        test.addArr(test.count);
    }, [test.count]);

    return (
        <div>
            <p>{test.count}</p>
            {
                test.arr.map(n => <p key={n}>{n}</p>)
            }
            <hr/>
            <p onClick={test.addCount}>add count</p>
        </div>
    );
});
