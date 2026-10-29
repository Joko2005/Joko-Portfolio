/** A page's opening: the title at display size, letters rising in (Reveals), and one line on what's here. */
export function PageHeader({ title, lead, count }: { title: string; lead: string; count?: number }) {
  return (
    <header className="flex flex-col gap-6 pb-12 md:pb-20">
      <div className="flex items-start gap-2">
        <h1 className="page-title" data-split="chars">
          {title}
        </h1>
        {count !== undefined && (
          <span aria-hidden className="page-count">
            {count}
          </span>
        )}
      </div>
      <p className="max-w-[40ch] text-lg leading-snug text-muted md:text-xl">{lead}</p>
    </header>
  );
}
