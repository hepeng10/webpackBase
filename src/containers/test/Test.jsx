/**
 * Created by Tirion on 2018/9/13.
 */
import styles from './test.less';
import React, { Component, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';

import { login } from '@services/login';

function slowImport(value, ms = 3000) {
    return new Promise(resolve => {
        setTimeout(() => resolve(value), ms);
    })
}

export default class Test extends Component {
    state = {
        a: 1
    };
    componentDidMount() {
        // login();

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
                <Link to="notfound">to notfound</Link>
            </div>
        );
    }
}
