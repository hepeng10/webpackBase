/**
 * Created by hepeng on 2020/4/9
 */
import style from './style.less';
import React, { useState } from 'react';
import cns from 'classnames';
import { Link, withRouter } from 'react-router-dom';

export default withRouter((props) => {
    // 默认第一层全开
    const defaultOpen = props.menus.map(menu => menu.path);
    const [open, setOpen] = useState(defaultOpen);

    const isActive = (path) => {
        const urlPath = props.location.pathname.split('/');
        const pathArr = path.split('/');
        let active = true;
        pathArr.forEach((item, i) => {
            if (urlPath[i] !== item) {
                active = false;
            }
        });
        return active;
    }

    const onChangeOpen = (path) => {
        if (open.includes(path)) {
            const index = open.indexOf(path);
            open.splice(index, 1);
            setOpen(open);
        } else {
            open.push(path);
            setOpen(open);
        }
    }

    const renderMenus = (menus, level) => {
        return (
            <ul>
                {
                    menus.map(menu => {
                        return (
                            <li
                                key={menu.path} 
                                className={cns({ 
                                    [style.menu]: level === 1, 
                                    [style.subMenu]: level === 2,
                                    [style.active1]: isActive(menu.path) && level === 1,
                                    [style.active2]: isActive(menu.path) && level === 2,
                                })}
                            >
                                <Link className={style.menuTitle} to={menu.component && menu.path}>
                                    {menu.icon && <img src={menu.icon}/>}
                                    <span 
                                        onClick={menu.component ? () => {return false} : () => onChangeOpen(menu.path)}
                                    >
                                        {menu.name}
                                    </span>
                                    {
                                        level === 1
                                        &&
                                        <span 
                                            className={cns(style.arrow, { [style.arrowRight]: !open.includes(menu.path) })} 
                                            onClick={() => onChangeOpen(menu.path)}
                                        />
                                    }
                                </Link>
                                {
                                    menu.subs && open.includes(menu.path)
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
});