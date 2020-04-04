/**
 * Created by Tirion on 2018/9/13.
 */
import styles from './test.less';
import React, { Component, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';

import { login } from '@services/login';

function slowImport(value, ms = 1000) {
    return new Promise(resolve => {
        setTimeout(() => resolve(value), ms);
    })
}
const LazyComp = React.lazy(() => slowImport(import('./Lazy')));

export default class Test extends Component {
    state = {
        a: 1
    };
    componentDidMount() {
        login();

        setInterval(() => {
            this.setState({
                a: this.state.a + 1
            });
        }, 1000);
    }
    render() {
        return (
            <div className={styles.container}>
                <span>{this.state.a}</span>
                <p>1111</p>
                <Suspense fallback={<div>loading</div>}>
                    <LazyComp />
                </Suspense>
                <Link to="notfound">to notfound</Link>
            </div>
        );
    }
}
