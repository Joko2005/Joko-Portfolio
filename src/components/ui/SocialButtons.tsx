import { SOCIALS } from "@/components/shell/socials";

/** LinkedIn, GitHub and Email as round icon buttons; each is named for screen readers. */
export function SocialButtons({ className = "" }: { className?: string }) {
  return (
    <ul aria-label="Contact" className={`flex gap-2 ${className}`}>
      {SOCIALS.map(({ id, label, href, icon: Icon, external }) => (
        <li key={id}>
          <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            aria-label={external ? `${label} (opens in a new tab)` : label}
            className="social-link pressable"
          >
            <Icon aria-hidden className="size-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}
