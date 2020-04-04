import styles from './notFound.less';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cns from 'classnames';

export default class NotFound extends Component {
    render() {
        return (
            <div className={styles.container}>
                <div className="container">
                    <div className={cns(styles.content)}>
                        <div className="clear">
                            <div className={styles.text}>
                                <p className={styles.cn}>兄弟！走错路了~~~~~~~~</p>
                            </div>
                        </div>
                        <p className={styles.btn}><Link to="/"><button className={cns('btn', 'btn-blue')}>返回首页</button></Link></p>
                    </div>
                </div>
            </div>
        );
    }
}
