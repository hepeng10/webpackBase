/**
 * Created by hepeng on 2021/3/17
 */
import React, { useRef } from 'react';

// 修改 containerRef 的 top 值实现无限滚动
export default function() {
    const scrollRef = useRef({
        t: 0,
        height: 0,
        containerRef: undefined,
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
        current.containerRef = containerRef;
        current.ms = ms;
        current.px = px;
        current.height = containerRef.offsetHeight;
        const childNodes = containerRef.childNodes;
        childNodes.forEach(node => {
            var cln = node.cloneNode(true);
            containerRef.appendChild(cln);
        });

    };

    const scrollStart = () => {
        const current = scrollRef.current;
        if (current.containerRef) {
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

    return {
        scrollInit,
        scrollStart,
        scrollStop,
    };
}
