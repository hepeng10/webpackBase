/**
 * Created by hepeng on 2020/4/10
 */
import React from 'react';

import Header from '@/components/header/Header';
import Sidebar from '@/components/sidebar/Sidebar';

import { treeRouter } from '@/routes/router';

export default (props) => {
    return (
        <div>
            <Header/>
            <Sidebar menus={props.routes}/>
            <div style={{ height: 1000 }}>
                {
                    treeRouter(props.routes)
                }
            </div>
        </div>
    );
}
