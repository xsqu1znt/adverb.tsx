import { FolderArchive, FolderClock, Settings, Zap } from "lucide-react";
import { Navbar } from "./Navbar";
import { Button } from "./ui/Button";
import { Footer } from "./Footer";

export function Sidebar() {
    return (
        <div className="flex w-[30%] flex-col bg-black/10 px-4 py-6 dark:bg-black/25">
            <div className="flex flex-1 flex-col gap-6 h-full">
                <div className="flex w-full items-center gap-4 px-8 py-4">
                    <a href="/profile" className="size-10 transition-opacity duration-200 hover:opacity-75">
                        <img
                            src="https://api.dicebear.com/9.x/initials/svg?seed=Brooklynn&scale=80"
                            alt="avatar"
                            className="rounded-full"
                        />
                    </a>

                    <a
                        href="/"
                        className="cursor-pointer text-2xl font-medium transition-opacity duration-200 select-none hover:text-[var(--color-foreground)]/75"
                    >
                        AdVerb
                    </a>
                </div>

                <ul>
                    <li>
                        <Button variant="invisible" className="w-full justify-start py-5">
                            <Zap /> Optimize
                        </Button>
                    </li>
                    <li>
                        <Button variant="invisible" className="w-full justify-start py-5">
                            <FolderClock /> History
                        </Button>
                    </li>
                    <li>
                        <Button variant="invisible" className="w-full justify-start py-5">
                            <Settings /> Settings
                        </Button>
                    </li>
                </ul>
            </div>

            <Footer />
        </div>
    );
}
