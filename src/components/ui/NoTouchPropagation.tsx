import { useRef, useEffect } from "react";

export function NoTouchPropagation({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const stopTouch = (e: TouchEvent) => {
            e.stopPropagation();
        };

        el.addEventListener("touchstart", stopTouch);
        el.addEventListener("touchmove", stopTouch);

        return () => {
            el.removeEventListener("touchstart", stopTouch);
            el.removeEventListener("touchmove", stopTouch);
        };
    }, []);

    return <div ref={ref}>{children}</div>;
}
