export type StringSelectStyles = "primary" | "outline" | "invisible";
export type StringSelectSizes = "sm" | "md" | "lg";

import { NoTouchPropagation } from "./NoTouchPropagation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// prettier-ignore
export const stringSelectStyles: Record<StringSelectStyles, string> = {
    primary: "border border-[var(--color-button-border)] bg-[var(--color-button-background)] text-[var(--color-button-foreground)] hover:bg-[var(--color-button-background-hover)] active:bg-[var(--color-button-background-hover)] focus:bg-[var(--color-button-background-hover)] focus:dark:border-[var(--color-foreground)]/50",
    outline: "border border-[var(--color-button-border)] text-[var(--color-button-invisible-foreground)] hover:bg-[var(--color-button-invisible-background-hover)]/75 active:bg-[var(--color-button-invisible-background-hover)]/75 focus:bg-[var(--color-button-invisible-background-hover)]/75",
    invisible: "bg-transparent text-[var(--color-button-invisible-foreground)] hover:bg-[var(--color-button-invisible-background-hover)]/75 active:bg-[var(--color-button-invisible-background-hover)]/75 focus:bg-[var(--color-button-invisible-background-hover)]/75"
};

export const stringSelectSizes: Record<StringSelectSizes, string> = {
    sm: "px-4 py-2 gap-4",
    md: "px-6 py-3 gap-6",
    lg: "px-6 py-3 gap-12"
};

export const stringSelectMinWidths: Record<StringSelectSizes, string> = {
    sm: "min-w-40",
    md: "min-w-50",
    lg: "min-w-60"
};

export const stringSelectTextSizes: Record<StringSelectSizes, string> = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
};

export interface StringSelectMenuOption {
    id: string;
    label: string;
    description?: string;
}

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    placeholder?: string;
    variant?: StringSelectStyles;
    direction?: "top" | "bottom";
    size?: StringSelectSizes;
    options: StringSelectMenuOption[];
    onOptionSelect?: (option: StringSelectMenuOption) => void;
}

/* TODO: Add keyboard support. */
export function StringSelectMenu(props: Props) {
    const { isLoading, onOptionSelect, ...rest } = props;

    const styleVariant = stringSelectStyles[props.variant || "primary"];
    const styleSize = stringSelectSizes[props.size || "md"];
    const styleMinWidth = stringSelectMinWidths[props.size || "md"];
    const styleTextSize = stringSelectTextSizes[props.size || "md"];

    const [selected, setSelected] = useState<StringSelectMenuOption | null>(props.placeholder ? null : props.options[0]);
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close the menu if clicked anywhere outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={cn(`relative ${isLoading && "loadingGlow"}`, props.className)} ref={menuRef}>
            <button
                {...rest}
                className={cn(
                    `flex w-fit cursor-pointer items-center justify-between rounded-lg ease-in-out ${props.disabled && "pointer-events-none opacity-50"} ${open ? (props.direction === "top" ? "rounded-t-none" : "rounded-b-none") : ""} px-6 py-3 text-base transition-[colors,border-radius] duration-100 outline-none`,
                    styleVariant,
                    styleSize,
                    styleMinWidth,
                    styleTextSize,
                    props.className
                )}
                onClick={() => setOpen(!open)}
            >
                <span
                    className={`text-nowrap ${!selected && props.placeholder && "text-[var(--color-button-foreground)]/25"}`}
                >
                    {!selected && props.placeholder ? props.placeholder : selected?.label}
                </span>
                <svg
                    className={`size-4 transform-[colors,rotate] duration-200 ease-in-out ${open ? (props.direction === "top" ? "rotate-0" : "rotate-180") : props.direction === "top" ? "rotate-180" : "rotate-0"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <NoTouchPropagation>
                    <div
                        className={cn(
                            `dropdown no-scrollbar absolute z-10 max-h-[201px] w-fit touch-pan-y overflow-x-hidden overflow-y-auto scroll-smooth ${props.direction === "top" ? "bottom-full rounded-t-lg border-b-0" : "top-full rounded-b-lg border-t-0"} border border-[var(--color-button-border)] bg-[var(--color-button-background)]`,
                            styleMinWidth,
                            styleTextSize,
                            props.className
                        )}
                    >
                        {props.options.map((option, idx) => (
                            <div
                                key={idx}
                                onClick={() => {
                                    setSelected(option);
                                    onOptionSelect?.(option);
                                    setOpen(false);
                                }}
                                className={`cursor-pointer px-4 py-2 text-[var(--color-button-foreground)] hover:bg-white/10 focus:bg-white/10 active:bg-white/10 ${selected?.id === option.id && "bg-white/10"}`}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                </NoTouchPropagation>
            )}
        </div>
    );
}
