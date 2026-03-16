import Link from "next/link";
import { PiSunDimFill, PiSunDimLight } from "react-icons/pi";

type NavItem = {
	label: string;
	href: `#${string}`;
};

const navItems: readonly NavItem[] = [
	{ label: "ABOUT", href: "#about" },
	{ label: "SKILLS", href: "#skills" },
	{ label: "WORK", href: "#work" },
	{ label: "JOURNEY", href: "#journey" },
];

const classes = {
	pillBase:
		"inline-flex h-9 items-center rounded-full border border-border bg-header-light transition-colors",
	monoLabel: "font-mono text-[15px] tracking-[0.14em]",
	navPill: "hidden rounded-full border border-border bg-header-light px-6.25 py-1.5 sm:block",
	navLink:
		"relative inline-block transition-colors hover:text-ink after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100",
	themeButton:
		"group relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-header-light text-muted transition-colors hover:text-ink",
	contactButton:
		"inline-flex h-9 items-center justify-center rounded-full bg-[#111111] px-5 text-[#f3f0e8] transition-colors duration-300 ease-out hover:bg-red hover:text-bg-alt",
} as const;

function HeaderNav() {
	return (
		<nav aria-label="Primary" className={classes.navPill}>
			<ul className={`flex items-center gap-5 ${classes.monoLabel} text-muted`}>
				{navItems.map((item) => (
					<li key={item.label}>
						<Link className={classes.navLink} href={item.href}>
							{item.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}

function ThemeToggleButton() {
	return (
		<button type="button" aria-label="Theme settings" className={classes.themeButton}>
			<span className="transition-opacity duration-200 group-hover:opacity-0">
				<PiSunDimLight aria-hidden size={20} />
			</span>
			<span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
				<PiSunDimFill aria-hidden size={20} />
			</span>
		</button>
	);
}

export function Header() {
	return (
		<header className="fixed left-0 right-0 top-0 z-50 w-full py-4">
			<div className="mx-25 flex items-center justify-between gap-4">
				<Link href="/" aria-label="Go to homepage" className={`${classes.pillBase} px-3`}>
				  <img src="/logo.svg" alt="JC" className="h-auto w-auto" />
				</Link>

				<div className="flex items-center gap-6.25">
					<HeaderNav />
					<ThemeToggleButton />

					<Link
						href="#contact"
						className={`${classes.contactButton} ${classes.monoLabel}`}
					>
						LET&apos;S TALK
					</Link>
				</div>
			</div>
		</header>
	);
}
