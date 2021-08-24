/**
 * Created by hepeng on 2021/3/17
 */
import React, { useRef } from 'react';

// 修改 containerRef 的 top 值实现无限滚动
export default function() {
    const scrollRef = useRef({
        t: 0,
        height: 0,
        containerRef: null,
        ms: 0,
        px: 0,
    });

    /**
     * @description 无限滚动初始化
     * @containerRef {ref} 无限滚动容器的 ref
     * @ms {number} 每次滚动间隔
     * @px {number} 每次滚动像素
     * */
    const scrollInit = (containerRef, ms, px) => {
        const current = scrollRef.current;
        if (!containerRef) {
            throw new Error('请传入 containerRef');
        }
        current.containerRef = containerRef;
        current.ms = ms;
        current.px = px;
        current.height = containerRef.offsetHeight;
    };

    const scrollStart = () => {
        const current = scrollRef.current;
        if (current.containerRef) {
            scrollStop();
            current.t = setInterval(() => {
                const currentTop = parseInt(current.containerRef.style.top, 10) || 0;
                const nextTop = currentTop - current.px;
                current.containerRef.style.top = nextTop + 'px';
                // 当一屏移动完后重置 top
                if (Math.abs(nextTop) === current.height) {
                    current.containerRef.style.top = 0;
                }
            }, current.ms);
        }
    };

    const scrollStop = () => {
        const current = scrollRef.current;
        clearInterval(current.t);
    };

    const scrollReset = () => {
        const current = scrollRef.current;
        if (current.containerRef) {
            scrollDestroy();
            scrollInit(current.containerRef, current.ms, current.px);
            scrollStart();
        }
    };

    const scrollDestroy = () => {
        const current = scrollRef.current;
        if (current.containerRef) {
            scrollStop();
            current.containerRef.style.top = 0;
            current.containerRef = null;
            current.height = 0;
            current.ms = 0;
            current.px = 0;
        }
    };

    return {
        scrollInit,
        scrollStart,
        scrollStop,
        scrollReset,
        scrollDestroy,
    };
}
