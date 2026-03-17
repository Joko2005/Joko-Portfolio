import Link from "next/link";

const navItems = [
	{ label: "ABOUT", href: "#about" },
	{ label: "SKILLS", href: "#skills" },
	{ label: "WORK", href: "#work" },
	{ label: "JOURNEY", href: "#journey" },
];

const pillBaseClass = "inline-flex h-9 items-center rounded-full bg-[#f3f0e8]";
const monoLabelClass = "font-mono text-[11px] tracking-[0.14em]";

export function Header() {
	return (
		<header className="w-full px-4 py-4 sm:px-6">
			<div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
				<Link
					href="/"
					aria-label="Go to homepage"
					className={`${pillBaseClass} px-3 font-syne text-16 font-extrabold text-[#111111]`}
				>
					JC.
				</Link>

				<div className="flex items-center gap-2 sm:gap-3">
					<nav
						aria-label="Primary"
						className="hidden rounded-full bg-[#f3f0e8] px-3 py-1.5 sm:block"
					>
						<ul className={`flex items-center gap-5 ${monoLabelClass} text-[#7e7b73]`}>
							{navItems.map((item) => (
								<li key={item.label}>
									<Link className="transition-colors hover:text-[#191919]" href={item.href}>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<button
						type="button"
						aria-label="Theme settings"
						className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f0e8] text-[#7e7b73]"
					>
						<span aria-hidden className="text-sm leading-none">☼</span>
					</button>

					<Link
						href="#contact"
						className={`inline-flex h-9 items-center rounded-full bg-[#111111] px-5 ${monoLabelClass} text-[#f3f0e8]`}
					>
						LET&apos;S TALK
					</Link>
				</div>
			</div>
		</header>
	);
}
