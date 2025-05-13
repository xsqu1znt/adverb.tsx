export type ButtonStyles = "primary" | "destructive" | "outline" | "invisible";
export type ButtonSizes = "square" | "sm" | "md" | "lg";

import { cn } from "@/lib/utils";

// prettier-ignore
export const buttonStyles: Record<ButtonStyles, string> = {
    primary: "border border-[var(--color-button-border)] bg-[var(--color-button-background)] text-[var(--color-button-foreground)] hover:bg-[var(--color-button-background-hover)] active:bg-[var(--color-button-background-hover)] focus:bg-[var(--color-button-background-hover)] focus:dark:border-[var(--color-foreground)]/50",
    destructive: "bg-red-700 text-zinc-200 hover:bg-red-500",
    outline: "border border-[var(--color-button-border)] text-[var(--color-button-invisible-foreground)] hover:bg-[var(--color-button-invisible-background-hover)]/75 active:bg-[var(--color-button-invisible-background-hover)]/75 focus:bg-[var(--color-button-invisible-background-hover)]/75",
    invisible: "bg-transparent text-[var(--color-button-invisible-foreground)] hover:bg-[var(--color-button-invisible-background-hover)]/75 active:bg-[var(--color-button-invisible-background-hover)]/75 focus:bg-[var(--color-button-invisible-background-hover)]/75"
};

export const buttonSizes: Record<ButtonSizes, string> = {
    square: "p-2 text-sm",
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-3 text-lg"
};

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonStyles;
    size?: ButtonSizes;
}

export function Button(props: Props) {
    return (
        <button
            {...props}
            className={cn(
                `flex w-fit ${props.disabled && "pointer-events-none opacity-50"} cursor-pointer items-center justify-center gap-2 rounded-lg font-medium text-nowrap transition-colors duration-200 outline-none`,
                buttonStyles[props.variant || "primary"],
                buttonSizes[props.size || "md"],
                props.className
            )}
        >
            {props.children}
        </button>
    );
}
