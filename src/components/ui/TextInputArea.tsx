import { cn } from "@/lib/utils";
import React from "react";

export function TextInputArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            {...props}
            className={cn(
                "no-scrollbar rounded-lg border border-[var(--color-foreground)]/60 px-6 py-4 transition-[height,colors] duration-200 outline-none focus:border-[var(--color-foreground)] dark:border-[var(--color-foreground)]/15 focus:dark:border-[var(--color-button-foreground)]/50",
                props.className
            )}
        />
    );
}
