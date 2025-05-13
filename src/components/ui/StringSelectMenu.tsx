export type StringSelectStyles = "primary" | "outline" | "invisible";
export type StringSelectSizes = "sm" | "md" | "lg";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// prettier-ignore
export const stringSelectStyles: Record<StringSelectStyles, string> = {
    primary: "border border-[var(--color-button-border)] bg-[var(--color-button-background)] text-[var(--color-button-foreground)] hover:bg-[var(--color-button-background-hover)] focus:bg-[var(--color-button-background-hover)] focus:dark:border-[var(--color-foreground)]/50",
    outline: "border border-[var(--color-button-border)] text-[var(--color-button-background)] dark:text-[var(--color-button-foreground)] hover:bg-[var(--color-button-background-hover)]/10",
    invisible: "bg-transparent text-[var(--color-button-foreground)] hover:bg-[var(--color-button-background-hover)]/50"
};

/* export const stringSelectSizes: Record<StringSelectSizes, string> = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-3 text-lg"
}; */

export interface StringSelectMenuOption {
    id: string;
    label: string;
    description?: string;
}

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
    placeholder?: string;
    variant?: StringSelectStyles;
    direction?: "top" | "bottom";
    // size?: StringSelectSizes;
    options: StringSelectMenuOption[];
    onOptionSelect?: (option: StringSelectMenuOption) => void;
}

export function StringSelectMenu(props: Props) {
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
        <div className="relative" ref={menuRef}>
            <button
                className={cn(
                    `flex w-fit cursor-pointer items-center justify-between rounded-lg ${open ? (props.direction === "top" ? "rounded-t-none" : "rounded-b-none") : ""} px-6 py-3 text-base transition-[colors,border-radius] duration-200 outline-none`,
                    stringSelectStyles[props.variant || "primary"],
                    // buttonSizes[props.size || "md"],
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
                    className={`size-4 transform-[colors,rotate] text-[var(--color-button-foreground)] duration-200 ${props.direction === "top" && "rotate-180"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div
                    className={`dropdown no-scrollbar absolute z-10 max-h-[202px] w-full touch-pan-y overflow-x-hidden overflow-y-auto scroll-smooth ${props.direction === "top" ? "bottom-full rounded-t-lg border-b-0" : "top-full rounded-b-lg border-t-0"} border border-[var(--color-button-border)] bg-[var(--color-button-background)]`}
                >
                    {props.options.map((option, idx) => (
                        <div
                            key={idx}
                            onClick={() => {
                                setSelected(option);
                                props.onOptionSelect?.(option);
                                setOpen(false);
                            }}
                            className={`cursor-pointer rounded-lg px-4 py-2 text-[var(--color-button-foreground)] hover:bg-white/10 ${
                                !idx ? (props.direction === "top" ? "rounded-t-none" : "rounded-b-none") : ""
                            } ${
                                idx === props.options.length - 1
                                    ? props.direction === "top"
                                        ? "rounded-b-none"
                                        : "rounded-t-none"
                                    : ""
                            } ${selected?.id === option.id && "bg-white/10"}`}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
