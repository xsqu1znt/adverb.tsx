export type StringSelectStyles = "primary" | "outline" | "invisible";
export type StringSelectSizes = "sm" | "md" | "lg";

import { useState } from "react";
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
    // size?: StringSelectSizes;
    options: StringSelectMenuOption[];
    onOptionSelect?: (option: StringSelectMenuOption) => void;
}

export function StringSelectMenu(props: Props) {
    const [selectedValue, setSelectedValue] = useState<StringSelectMenuOption>(props.options[0]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOption = props.options.find(option => option.id === e.target.value);
        if (selectedOption) {
            setSelectedValue(selectedOption);
            props.onOptionSelect?.(selectedOption);
        }
    };

    return (
        <div className="relative">
            <select
                value={selectedValue.id}
                className={cn(
                    "cursor-pointer w-fit appearance-none rounded-lg px-6 py-3 text-base transition-colors duration-200 outline-none",
                    stringSelectStyles[props.variant || "primary"],
                    // buttonSizes[props.size || "md"],
                    props.className
                )}
                onChange={handleChange}
            >
                {props.placeholder && <option value="" disabled>{props.placeholder}</option>}
                {props.options.map((option, idx) => (
                    <option key={idx} value={option.label}>
                        {option.label}
                    </option>
                ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg
                    className="size-4 text-[var(--color-button-foreground)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
}
