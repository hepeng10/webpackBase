/**
 * Created by hepeng on 2021/5/28
 */
import { useRef } from 'react';

export default (fn, wait) => {
    let timer = useRef(0);

    return function(...reset) {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            fn(...reset)
        }, wait)
    }
}
