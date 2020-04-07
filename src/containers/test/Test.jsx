import styles from './style.less';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RouteView from '@routes/RouteView';

import { login } from '@services/login';

export default props => {
    const [a, setA] = useState(1);

    useEffect(() => {
        setInterval(() => {
            setA(a => a + 1);
        }, 1000);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <span>{a}</span>
                <p>1111</p>
                <Link to="/test/child">to child</Link>
            </div>
            <div className={styles.right}>
                {
                    props.routes.map(route => <RouteView key={route.name} {...route}/>)
                }
            </div>
        </div>
    );
}
