/**
 * Created by hepeng on 2020/4/9
 */
import style from './style.less';
import React from 'react';
import cns from 'classnames';
import { Link } from 'react-router-dom';

export default (props) => {
    const renderMenus = (menus, level) => {
        return (
            <ul>
                {
                    menus.map(menu => {
                        return (
                            <li key={menu.path} className={cns({ [style.menu]: level === 1, [style.subMenu]: level === 2 })}>
                                <Link className={style.menuTitle} to={menu.path}>
                                    {menu.icon && <img src={menu.icon}/>}
                                    {menu.name}
                                    {
                                        level === 1 && <span className={style.arrow}/>
                                    }
                                </Link>
                                {
                                    menu.subs
                                    &&
                                    renderMenus(menu.subs, level + 1)
                                }
                            </li>
                        );
                    })
                }
            </ul>
        );
    }

    return (
        <div className={style.container}>
            {
                renderMenus(props.menus, 1)
            }
        </div>
    );
}