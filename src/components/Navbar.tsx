import { cn } from "@/lib/utils";

export function Navbar(props: React.HtmlHTMLAttributes<HTMLElement>) {
    return (
        <nav {...props} className={cn("flex w-full items-center justify-between px-8 py-4 gap-4", props.className)}>
            <a
                href="/"
                className="cursor-pointer text-2xl font-medium transition-opacity duration-200 select-none hover:text-[var(--color-foreground)]/75"
            >
                AdVerb
            </a>

            <a href="/profile" className="size-10 transition-opacity duration-200 hover:opacity-75">
                <img
                    src="https://api.dicebear.com/9.x/initials/svg?seed=Brooklynn&scale=80"
                    alt="avatar"
                    className="rounded-full"
                />
            </a>
        </nav>
    );
}
