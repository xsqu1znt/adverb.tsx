export type StringSelectStyles = "primary";

export interface DropdownOption {
    id: string;
    label: string;
}

interface Props extends React.HtmlHTMLAttributes<HTMLDivElement> {
    state: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> };
    buttonRef: RefObject<HTMLButtonElement | null>;
    options: DropdownOption[];

    variant?: StringSelectStyles;
    direction?: "top" | "bottom";
    onOptionSelect?: (option: DropdownOption) => void;
}

import { RefObject, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// prettier-ignore
export const dropdownStyles: Record<StringSelectStyles, string> = {
    primary: "border border-[var(--color-button-border)] bg-[var(--color-button-background)] text-[var(--color-button-foreground)] hover:bg-[var(--color-button-background-hover)] active:bg-[var(--color-button-background-hover)] focus:bg-[var(--color-button-background-hover)] focus:dark:border-[var(--color-foreground)]/50",
};

export function SimpleDropdown(props: Props) {
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(null);

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node) &&
                props.buttonRef.current &&
                !props.buttonRef.current.contains(e.target as Node)
            ) {
                props.state.setOpen(false);
                setHighlightedIndex(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                props.state.setOpen(true);
                setHighlightedIndex(prev => (prev === null ? 0 : (prev + 1) % props.options.length));
                break;
            case "ArrowUp":
                e.preventDefault();
                props.state.setOpen(true);
                setHighlightedIndex(prev =>
                    prev === null ? props.options.length - 1 : (prev - 1 + props.options.length) % props.options.length
                );
                break;
            case "Enter":
            case "Space":
                if (props.state.open && selectedOption !== null) {
                    props.state.setOpen(false);
                    setSelectedOption(props.options[highlightedIndex || 0]);
                }
                break;
            case "Escape":
                props.state.setOpen(false);
                break;
        }
    };

    return (
        <div
            ref={menuRef}
            role="listbox"
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            className={cn(
                "absolute z-10 mt-2 origin-top-right",
                dropdownStyles[props.variant || "primary"],
                props.className
            )}
        >
            <div>
                {props.options.map((option, index) => (
                    <div
                        key={index}
                        role="option"
                        aria-selected={highlightedIndex === index}
                        tabIndex={0}
                        className={`flex cursor-pointer gap-2 px-4 py-2 text-sm ${index === highlightedIndex ? "bg-white/15" : ""}`}
                        onClick={() => {
                            setSelectedOption(option);
                            props.state.setOpen(false);
                        }}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        onKeyDown={e => {
                            if (e.key === "Enter" || e.key === "Space") {
                                setSelectedOption(option);
                                props.state.setOpen(false);
                            }
                        }}
                    >
                        <span>{option.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
