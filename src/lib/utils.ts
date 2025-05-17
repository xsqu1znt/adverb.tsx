export interface ETAOptions {
    /** The anchor to go off of, a unix timestamp in milliseconds. `Date.now()` is default */
    since?: number | string;
    /** Leaves out "ago" if the result is in the past. */
    ignorePast?: boolean;
    /** Returns `null` if `unix` is before `since`. */
    nullIfPast?: boolean;
    /** The number of decimal places to round the result to. `0` is default. */
    decimalLimit?: number;
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export async function copyToClipboard(text: string) {
    try {
        await navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    } catch {
        try {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            alert("Copied to clipboard!");
        } catch {
            alert("Failed to copy to clipboard!");
        }
    }
}

export function eta(unix: number | string, options?: ETAOptions): string | null {
    const _options = {
        ignorePast: false,
        nullIfPast: false,
        decimalLimit: 0,
        ...options,
        since: options?.since ? Number(options.since) : Date.now()
    };
    const _unix = Number(unix);

    /* Check if unix is in the past */
    const isPast = _unix - _options.since < 0;
    if (_options.ignorePast && isPast) return null;

    let difference: number | string = Math.abs(_unix - _options.since);
    /* Return if there's no difference */
    if (!difference && _options.nullIfPast) return null;
    if (!difference) return "now";

    /* - - - - - { Preform Calculations } - - - - - */
    const divisions = [
        { name: "milliseconds", amount: 1000 },
        { name: "seconds", amount: 60 },
        { name: "minutes", amount: 60 },
        { name: "hours", amount: 24 },
        { name: "days", amount: 7 },
        { name: "weeks", amount: 4 },
        { name: "months", amount: 12 },
        { name: "years", amount: Number.POSITIVE_INFINITY }
    ];

    // Divide the difference until we reach a result
    let result = divisions.find((div, idx) => {
        if ((difference as number) < div.amount) return div;
        difference = Math.abs((difference as number) / div.amount).toFixed(
            ["milliseconds", "seconds", "minutes", "hours", "days"].includes(div.name) ? 0 : _options.decimalLimit
        );
    });

    if (!result) return null;

    // Grammar adjustment
    if (difference === 1) result.name = result.name.slice(0, -1);

    return `${difference} ${result.name}${isPast && !_options.ignorePast ? " ago" : ""}`;
}
