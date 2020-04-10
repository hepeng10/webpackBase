import styles from './style.less';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default props => {
    const [a, setA] = useState(1);

    useEffect(() => {
        setInterval(() => {
            setA(a => a + 1);
        }, 1000);
    }, []);

    return (
        <div className={styles.container}>
            <span>{a}</span>
            <p>222</p>
            <p><Link to="/admin">to admin</Link></p>
            <p><Link to="/test">to test</Link></p>
            <p><Link to="xxx">to notfound</Link></p>
        </div>
    );
}
