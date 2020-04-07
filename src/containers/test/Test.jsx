import styles from './style.less';
import React from 'react';
import { Link } from 'react-router-dom';
import router from '@routes/router';

export default props => {
    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <Link to="/test/child">to child</Link>
            </div>
            <div className={styles.right}>
                {
                    router(props.routes)
                }
            </div>
        </div>
    );
}
