import { cn } from "@/lib/utils";

export function Footer(props: React.HtmlHTMLAttributes<HTMLElement>) {
    return (
        <footer
            className={cn(
                "flex flex-row items-center justify-center gap-4 border-t border-[var(--color-foreground)]/25 px-6 py-6",
                props.className
            )}
        >
            <span className="text-md opacity-75">&copy; {new Date().getFullYear()} AdVerb, Gunique Grimble</span>
        </footer>
    );
}
