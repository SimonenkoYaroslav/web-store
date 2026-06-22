'use client'

import { useEffect, useRef } from 'react';

/**
 * Fixed, full-viewport gradient backdrop with a subtle parallax.
 *
 * Three brown-gold gradient "blobs" drift on a slow CSS ambient loop and shift
 * on scroll at different rates (JS transform) for depth. Honours
 * prefers-reduced-motion: when reduced motion is requested the scroll listener
 * is never attached and the CSS drift is disabled (see globals.css).
 */
export const GradientBackground = () => {
    const goldRef = useRef<HTMLDivElement>(null);
    const brownRef = useRef<HTMLDivElement>(null);
    const amberRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        if (reduceMotion.matches) {
            return;
        }

        let frame = 0;

        const onScroll = () => {
            cancelAnimationFrame(frame);

            frame = requestAnimationFrame(() => {
                const y = window.scrollY;

                if (goldRef.current) {
                    goldRef.current.style.transform = `translate3d(0, ${y * 0.12}px, 0)`;
                }

                if (brownRef.current) {
                    brownRef.current.style.transform = `translate3d(0, ${y * -0.08}px, 0)`;
                }

                if (amberRef.current) {
                    amberRef.current.style.transform = `translate3d(0, ${y * 0.05}px, 0)`;
                }
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <div className="bg-aurora" aria-hidden="true">
            <div ref={goldRef} className="bg-aurora__blob bg-aurora__blob--gold" />
            <div ref={brownRef} className="bg-aurora__blob bg-aurora__blob--brown" />
            <div ref={amberRef} className="bg-aurora__blob bg-aurora__blob--amber" />
        </div>
    );
};

export default GradientBackground;
