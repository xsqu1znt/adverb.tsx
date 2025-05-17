import { NoTouchPropagation } from "./NoTouchPropagation";
import { cn } from "@/lib/utils";
import React from "react";

export interface TextAreaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    isLoading?: boolean;
}

export function TextAreaInput(props: TextAreaInputProps) {
    const { isLoading, ...rest } = props;

    return (
        <NoTouchPropagation>
            <textarea
                {...rest}
                className={cn(
                    `no-scrollbar ${isLoading && "loadingGlow"} touch-pan-y scroll-smooth rounded-lg ${props.disabled && "pointer-events-none opacity-50"} border border-[var(--color-foreground)]/60 px-6 py-4 transition-[height,colors] duration-200 outline-none focus:border-[var(--color-foreground)] dark:border-[var(--color-foreground)]/15 focus:dark:border-[var(--color-button-foreground)]/50`,
                    props.className
                )}
            />
        </NoTouchPropagation>
    );
}
