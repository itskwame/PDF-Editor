import Link from "next/link";

type IconName =
  | "quill"
  | "lightbulb"
  | "notes"
  | "pdf"
  | "draft"
  | "target"
  | "tag"
  | "list"
  | "sample"
  | "check"
  | "clock"
  | "layout"
  | "book"
  | "feather"
  | "heart"
  | "child"
  | "upload"
  | "compass"
  | "pencil"
  | "download"
  | "spark"
  | "refresh"
  | "file"
  | "shield";

const iconPaths: Record<IconName, string[]> = {
  quill: ["M19 3C12 4 7 9 5 18", "M17 5c-5 1-8 4-10 9", "M4 21l4-7"],
  lightbulb: ["M9 18h6", "M10 22h4", "M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 3H9c0-1 0-2-1-3z"],
  notes: ["M6 3h10l2 2v16H6z", "M9 8h6", "M9 12h6", "M9 16h4"],
  pdf: ["M6 3h9l3 3v15H6z", "M14 3v4h4", "M8 14h8", "M8 17h5"],
  draft: ["M6 3h12v18H6z", "M9 8h6", "M9 12h6", "M9 16h3"],
  target: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z", "M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"],
  tag: ["M20 13l-7 7-9-9V4h7z", "M8 8h.01"],
  list: ["M8 6h12", "M8 12h12", "M8 18h12", "M4 6h.01", "M4 12h.01", "M4 18h.01"],
  sample: ["M6 4h12v16H6z", "M9 8h6", "M9 12h6", "M9 16h3"],
  check: ["M20 6L9 17l-5-5"],
  clock: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 7v5l3 2"],
  layout: ["M5 4h14v16H5z", "M5 9h14", "M10 9v11"],
  book: ["M4 5c3-2 6-2 8 0v15c-2-2-5-2-8 0z", "M12 5c2-2 5-2 8 0v15c-3-2-6-2-8 0z"],
  feather: ["M20 4C12 4 7 9 5 18", "M18 6c-5 1-8 5-10 10", "M4 20l5-5"],
  heart: ["M20 8c0 6-8 11-8 11S4 14 4 8a4 4 0 0 1 8-2 4 4 0 0 1 8 2z"],
  child: ["M12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M5 22c1-6 13-6 14 0", "M7 12l5 3 5-3"],
  upload: ["M12 16V5", "M7 10l5-5 5 5", "M5 20h14"],
  compass: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M15 9l-2 5-5 2 2-5z"],
  pencil: ["M4 20l4-1 11-11-3-3L5 16z", "M13 5l3 3"],
  download: ["M12 4v11", "M7 10l5 5 5-5", "M5 20h14"],
  spark: ["M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"],
  refresh: ["M20 7v5h-5", "M4 17v-5h5", "M18 12a6 6 0 0 0-10-4", "M6 12a6 6 0 0 0 10 4"],
  file: ["M6 3h9l3 3v15H6z", "M14 3v4h4", "M9 12h6", "M9 16h4"],
  shield: ["M12 3l7 3v5c0 5-3 9-7 10-4-1-7-5-7-10V6z", "M9 12l2 2 4-5"],
};

const problemCards = [
  { icon: "spark" as IconName, title: "Not Sure Where to Start", copy: "Too much information. Not enough direction." },
  { icon: "clock" as IconName, title: "Stuck or Overwhelmed", copy: "Notes everywhere. But no real progress." },
  { icon: "layout" as IconName, title: "Formatting is a Headache", copy: "Design, layout, and export take too much time." },
];

const solutionCards = [
  ["Book Planning", "Turn your idea into a clear and compelling book concept.", "spark"],
  ["Title and Subtitle Ideas", "Get creative, market-ready title options.", "lightbulb"],
  ["Chapter Outline", "A structured outline that organizes your entire book.", "list"],
  ["Chapter-by-Chapter Drafting", "Write one chapter at a time with flow.", "sample"],
  ["Editing Support", "Improve clarity, structure, and readability.", "pencil"],
  ["Formatting and Export", "Beautiful formatting. Export to PDF or DOCX.", "download"],
] as const;

const bookTypes = [
  ["Nonfiction Book", "Turn your knowledge, teach, and build authority.", "book"],
  ["Fiction Book", "Create memorable stories and engaging worlds.", "feather"],
  ["Memoir or Life Story", "Preserve your experiences and inspire others.", "heart"],
  ["Children's Book", "Spark imagination and nurture young minds.", "child"],
] as const;

const steps = [
  ["Start With What You Have", "Upload your idea, notes, PDF, or draft.", "upload"],
  ["Set the Direction", "Answer a few simple questions about your book.", "compass"],
  ["Review Your Free Book Plan", "See your concept, outline, and sample chapter.", "sample"],
  ["Build the Full Book", "Write chapter by chapter with guidance.", "pencil"],
  ["Edit, Format, and Export", "Polish your book and export to PDF or DOCX.", "download"],
] as const;

const previewItems = [
  "Book Concept",
  "Title Options",
  "Subtitle Options",
  "Reader Promise",
  "Book Description",
  "Chapter Outline",
  "Chapter Summaries",
  "Sample Chapter",
  "Recommended Book Size",
];

const chips = [
  "Business",
  "Self-help",
  "Parenting",
  "Romance",
  "Adventure",
  "Sci-Fi",
  "Fantasy",
  "Memoir",
  "Children's",
  "Professional",
  "Conversational",
  "Inspirational",
  "Story-Driven",
  "Emotional",
  "Cinematic",
];

const controlCards = [
  ["Approve Every Step", "Review and approve every part before moving forward.", "check"],
  ["Edit Anything", "Change content, tone, or structure anytime.", "pencil"],
  ["Rewrite as Needed", "Ask for rewrites until it feels just right.", "refresh"],
  ["Chapter-by-Chapter Control", "Work on one chapter at a time.", "list"],
] as const;

const flowItems = [
  ["Rough Idea", "A spark of inspiration.", "lightbulb"],
  ["Notes", "Scattered thoughts and ideas.", "notes"],
  ["Chapter Outline", "A clear structure for your book.", "list"],
  ["Polished Chapters", "Well-written, refined content.", "draft"],
  ["Finished PDF / DOCX", "A professional book ready to share.", "book"],
] as const;

const pricingRows = [
  ["10 pages", "$19", "$39"],
  ["50 pages", "$49", "$99"],
  ["100 pages", "$99", "$199"],
  ["200 pages", "$199", "$399"],
  ["300 pages", "$349", "$699"],
  ["500 pages", "$699", "$1,299"],
];

const sampleBooks = [
  ["THE FOCUS EDGE", "How Clarity Creates Extraordinary Results", "DAVID LANGFORD", "Nonfiction", "cover-horizon"],
  ["WHISPERS OF THE MOON", "LILA HART", "", "Fiction", "cover-moon"],
  ["A Life Unfolded", "Lessons, Choices, and the Road That Led Me Home", "ANNA REEVES", "Memoir", "cover-memoir"],
  ["The Brave Little Star", "", "", "Children's", "cover-child"],
];

const faqs = [
  "What is BookForge?",
  "What do I get in the free book preview?",
  "Can I write any type of book?",
  "Do I own the rights to my book?",
  "Can I edit and rewrite content?",
  "How do exports work?",
  "Are there any monthly fees?",
  "How long does it take to finish a book?",
  "Can I upgrade later?",
];

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {iconPaths[name].map((path) => (
        <path d={path} key={path} />
      ))}
    </svg>
  );
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 text-[#0a2a4b]">
      <Icon name="quill" className={`${compact ? "h-6 w-6" : "h-8 w-8"} text-[#c98214]`} />
      <span className={`${compact ? "text-[21px]" : "text-[28px]"} font-black leading-none [font-family:Georgia,serif]`}>
        BookForge
      </span>
    </Link>
  );
}

function GoldButton({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-md bg-[#c98214] px-5 py-3 text-sm font-black text-white shadow-md shadow-amber-900/20 transition hover:bg-[#a9670e] ${className}`}
    >
      {children}
    </Link>
  );
}

function SecondaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-md border border-[#e2d4bd] bg-white px-7 py-3 text-sm font-black text-[#102b49] shadow-sm transition hover:border-[#c98214]"
    >
      {children}
    </Link>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[27px] font-black leading-tight text-[#0d2a4a] [font-family:Georgia,serif]">{children}</h2>;
}

function Card({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <div id={id} className={`bookforge-soft-card rounded-lg border border-[#e8ddca] p-4 ${className}`}>
      {children}
    </div>
  );
}

function IconBubble({ icon, className = "" }: { icon: IconName; className?: string }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-[#f7dfb8] text-[#0d2a4a] shadow-inner shadow-white/70 ring-1 ring-[#e4c58e] ${className || "h-16 w-16"}`}>
      {icon === "spark" ? (
        <span className="text-5xl font-black leading-none text-[#0d2a4a] [font-family:Georgia,serif]">?</span>
      ) : (
        <Icon name={icon} className="h-8 w-8" />
      )}
    </span>
  );
}

function FeatureCard({ title, copy, icon }: { title: string; copy: string; icon: IconName }) {
  return (
    <Card className="min-h-[124px]">
      <Icon name={icon} className="h-6 w-6 text-[#c98214]" />
      <h3 className="mt-3 text-[15px] font-black leading-tight text-[#0d2a4a] [font-family:Georgia,serif]">{title}</h3>
      <p className="mt-2 text-[12px] font-semibold leading-[1.45] text-[#243850]">{copy}</p>
    </Card>
  );
}

function Band({ children, id, className = "" }: { children: React.ReactNode; id?: string; className?: string }) {
  return (
    <section id={id} className="px-4 py-3 lg:px-6">
      <div className={`bookforge-frame rounded-xl border border-[#efe2cf] bg-[#fffaf1] p-4 shadow-sm shadow-[#dfc9aa]/20 ${className}`}>
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fffaf2] text-[#0d2a4a]">
      <header className="border-b border-[#e7d9c4] bg-[#fffdf8]">
        <div className="bookforge-frame flex items-center justify-between py-3">
          <Logo />
          <nav className="hidden items-center gap-11 text-[13px] font-black text-[#102b49] md:flex">
            <Link href="#how-it-works">How It Works</Link>
            <Link href="#examples">Examples</Link>
            <Link href="#pricing">Pricing</Link>
            <Link href="#faq">FAQ</Link>
          </nav>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hidden text-sm font-black text-[#102b49] sm:inline">
              Log In
            </Link>
            <GoldButton href="/books/new" className="px-6 py-3">
              Start Free Book Preview
            </GoldButton>
          </div>
        </div>
      </header>

      <section className="bookforge-frame bookforge-hero pb-9 pt-8">
        <div>
          <h1 className="max-w-[645px] text-[50px] font-black leading-[1.03] text-[#0a2a4b] [font-family:Georgia,serif] md:text-[57px] lg:text-[61px]">
            Turn Your Idea, Notes, or Draft Into a Finished Book
          </h1>
          <p className="mt-5 max-w-[560px] text-[18px] font-medium leading-[1.45] text-[#102b49]">
            Plan, write, edit, format, and export your book with a guided step-by-step process.
          </p>
          <div className="mt-7 flex flex-wrap gap-5">
            <GoldButton href="/books/new" className="min-w-[276px]">
              Start Your Free Book Preview
            </GoldButton>
            <SecondaryButton href="#examples">See Sample Books</SecondaryButton>
          </div>
          <p className="mt-6 flex items-center gap-3 text-sm font-black text-[#263b53]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c98214] text-white">
              <Icon name="shield" className="h-4 w-4" />
            </span>
            No blank page. No confusing prompts. No formatting headaches.
          </p>
        </div>

        <HeroMockup />
      </section>

      <Band>
        <div className="bookforge-two-col items-center">
          <SectionTitle>Your Book Should Not Stay Stuck in Your Head, Notes, or Drafts</SectionTitle>
          <div className="grid gap-5 md:grid-cols-3">
            {problemCards.map((card) => (
              <Card className="flex min-h-[104px] items-center gap-5" key={card.title}>
                <IconBubble icon={card.icon} />
                <div>
                  <h3 className="text-[15px] font-black text-[#0d2a4a] [font-family:Georgia,serif]">{card.title}</h3>
                  <p className="mt-1 text-[12px] font-semibold leading-[1.45] text-[#263b53]">{card.copy}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Band>

      <Band>
        <div className="bookforge-studio">
          <SectionTitle>A Guided Book Creation Studio</SectionTitle>
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            {solutionCards.map(([title, copy, icon]) => (
              <FeatureCard key={title} title={title} copy={copy} icon={icon as IconName} />
            ))}
          </div>
        </div>
      </Band>

      <Band>
        <div className="bookforge-studio items-center">
          <SectionTitle>Write Any Type of Book</SectionTitle>
          <div className="grid gap-4 md:grid-cols-4">
            {bookTypes.map(([title, copy, icon]) => (
              <Card className="flex min-h-[92px] items-center gap-4" key={title}>
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[#0d2a4a] shadow-sm ring-1 ring-[#eadfcd]">
                  <Icon name={icon as IconName} className={`h-9 w-9 ${title === "Memoir or Life Story" ? "fill-[#d83b2e] text-[#d83b2e]" : title === "Children's Book" ? "text-[#2f80b7]" : "text-[#0d2a4a]"}`} />
                </span>
                <div>
                  <h3 className="text-[16px] font-black leading-tight text-[#0d2a4a] [font-family:Georgia,serif]">{title}</h3>
                  <p className="mt-1 text-[12px] font-semibold leading-[1.45] text-[#263b53]">{copy}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Band>

      <Band id="how-it-works">
        <div className="bookforge-works">
          <SectionTitle>How BookForge Works</SectionTitle>
          <div className="grid gap-3 md:grid-cols-5">
            {steps.map(([title, copy, icon], index) => (
              <div className="relative pt-3" key={title}>
                <span className="absolute left-1/2 top-0 z-10 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-[#c98214] text-xs font-black text-white">
                  {index + 1}
                </span>
                <Card className="min-h-[172px] pt-8 text-center">
                  <Icon name={icon as IconName} className="mx-auto h-8 w-8 text-[#0d2a4a]" />
                  <h3 className="mt-3 text-[13px] font-black leading-tight text-[#0d2a4a] [font-family:Georgia,serif]">{title}</h3>
                  <p className="mt-2 text-[11px] font-semibold leading-[1.45] text-[#263b53]">{copy}</p>
                </Card>
              </div>
            ))}
          </div>
          <Card className="min-h-[206px]">
            <h3 className="text-center text-[20px] font-black leading-tight text-[#0d2a4a] [font-family:Georgia,serif]">
              See Your Book Plan Before You Pay
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-[12px] font-black text-[#243850]">
              {previewItems.map((item) => (
                <span className="flex items-center gap-2" key={item}>
                  <Icon name="check" className="h-4 w-4 text-[#c98214]" />
                  {item}
                </span>
              ))}
            </div>
            <GoldButton href="/books/new" className="mt-4 w-full py-2.5">
              Get Your Free Book Plan
            </GoldButton>
          </Card>
        </div>
      </Band>

      <Band>
        <div className="bookforge-studio items-center">
          <SectionTitle>Any Genre. Any Style.</SectionTitle>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-5 xl:grid-cols-8">
            {chips.map((chip) => (
              <span className="flex min-h-[34px] items-center justify-center gap-2 rounded-md border border-[#e8ddca] bg-white px-3 text-[12px] font-black text-[#263b53] shadow-sm" key={chip}>
                <Icon name="spark" className="h-4 w-4 text-[#c98214]" />
                {chip}
              </span>
            ))}
          </div>
        </div>
      </Band>

      <Band>
        <div className="bookforge-studio items-center">
          <SectionTitle>You Stay in Control of the Book</SectionTitle>
          <div className="grid gap-4 md:grid-cols-4">
            {controlCards.map(([title, copy, icon]) => (
              <Card className="flex min-h-[92px] items-center gap-4" key={title}>
                <IconBubble icon={icon as IconName} className="h-14 w-14" />
                <div>
                  <h3 className="text-[15px] font-black leading-tight text-[#0d2a4a] [font-family:Georgia,serif]">{title}</h3>
                  <p className="mt-1 text-[12px] font-semibold leading-[1.35] text-[#263b53]">{copy}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Band>

      <Band>
        <div className="bookforge-studio items-center">
          <SectionTitle>From Idea to Finished Book</SectionTitle>
          <div className="grid gap-3 md:grid-cols-5">
            {flowItems.map(([title, copy, icon], index) => (
              <div className="flex items-center gap-3" key={title}>
                <Card className="flex min-h-[78px] flex-1 items-center gap-3">
                  <Icon name={icon as IconName} className="h-9 w-9 shrink-0 text-[#c98214]" />
                  <div>
                    <h3 className="text-[13px] font-black leading-tight text-[#0d2a4a] [font-family:Georgia,serif]">{title}</h3>
                    <p className="mt-1 text-[11px] font-semibold leading-[1.3] text-[#263b53]">{copy}</p>
                  </div>
                </Card>
                {index < flowItems.length - 1 ? <span className="hidden text-2xl font-black text-[#c98214] xl:block">-</span> : null}
              </div>
            ))}
          </div>
        </div>
      </Band>

      <section id="pricing" className="bookforge-frame bookforge-pricing-grid py-3">
        <Card>
          <h2 className="text-center text-[27px] font-black text-[#0d2a4a] [font-family:Georgia,serif]">Simple Book Pricing</h2>
          <div className="mt-4 overflow-hidden rounded-md border border-[#d9c7aa]">
            <table className="w-full border-collapse bg-white text-center text-sm">
              <thead className="bg-[#0d2a4a] text-white">
                <tr>
                  <th className="border-r border-white/25 p-2">Book Size</th>
                  <th className="border-r border-white/25 p-2">Without Images</th>
                  <th className="p-2">With Images</th>
                </tr>
              </thead>
              <tbody>
                {pricingRows.map((row) => (
                  <tr className="border-t border-[#e8ddca]" key={row[0]}>
                    {row.map((cell) => (
                      <td className="border-r border-[#e8ddca] px-3 py-2 font-bold last:border-r-0" key={cell}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mx-auto mt-3 max-w-[560px] text-center text-[13px] font-semibold leading-[1.4] text-[#263b53]">
            Nothing is unlimited. Each package includes clear limits for rewrites, image credits, uploads, and exports.
          </p>
        </Card>

        <Card id="examples">
          <h2 className="text-center text-[27px] font-black text-[#0d2a4a] [font-family:Georgia,serif]">Sample Books</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {sampleBooks.map(([title, subtitle, author, label, gradient], index) => (
              <div className="rounded-lg bg-white p-2 shadow-sm" key={title}>
                <div className={`sample-cover flex aspect-[2/3] flex-col justify-between ${gradient} p-5 text-center text-white`}>
                  {index === 1 ? <span className="absolute left-1/2 top-[40%] h-12 w-12 -translate-x-1/2 rounded-full bg-[#f6dfb6] shadow-[0_0_24px_rgba(246,223,182,0.65)]" /> : null}
                  {index === 3 ? <span className="absolute right-5 top-5 text-4xl text-[#ffd86d]">★</span> : null}
                  <p className={`relative z-10 mt-4 text-[24px] font-black leading-tight tracking-wide ${index === 2 ? "text-[#8f673c]" : "text-[#f7d38b]"}`}>
                    {title}
                  </p>
                  <div>
                    {subtitle ? <p className={`relative z-10 text-[10px] font-semibold leading-tight ${index === 2 ? "text-[#7a5a36]" : "text-white/85"}`}>{subtitle}</p> : null}
                    {author ? <p className={`relative z-10 mt-3 text-[10px] font-black tracking-widest ${index === 2 ? "text-[#7a5a36]" : "text-white/85"}`}>{author}</p> : null}
                  </div>
                </div>
                <p className="mt-2 text-center text-sm font-bold text-[#263b53]">{label}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Band id="faq">
        <div className="bookforge-studio">
          <SectionTitle>Frequently Asked Questions</SectionTitle>
          <div className="grid gap-3 md:grid-cols-3">
            {faqs.map((faq) => (
              <details className="rounded-md border border-[#e8ddca] bg-white px-4 py-2.5 text-[12px] font-black text-[#263b53] shadow-sm" key={faq}>
                <summary className="cursor-pointer list-none">{faq}<span className="float-right">v</span></summary>
                <p className="mt-3 font-semibold leading-5 text-[#4a5b6d]">
                  BookForge guides you through a structured book creation process while keeping you in control of the content.
                </p>
              </details>
            ))}
          </div>
        </div>
      </Band>

      <section className="px-4 pb-6 pt-5 lg:px-6">
        <div className="bookforge-frame flex flex-col items-center justify-between gap-5 rounded-2xl bg-[#0d2a4a] px-10 py-6 text-center text-white shadow-xl shadow-slate-900/20 md:flex-row md:text-left">
          <div className="flex items-center gap-7">
            <Icon name="quill" className="hidden h-16 w-16 text-[#f2bd5b] sm:block" />
            <div>
              <h2 className="text-[29px] font-black text-[#f7d38b] [font-family:Georgia,serif]">Your Book Is Closer to Finished Than You Think</h2>
              <p className="mt-1 text-[15px] font-medium text-white/90">Stop overthinking. Start creating. Get your free book plan today.</p>
            </div>
          </div>
          <div>
            <GoldButton href="/books/new" className="min-w-[300px]">
              Start Your Free Book Preview
            </GoldButton>
            <p className="mt-2 text-center text-xs font-black text-white/85">No credit card required.</p>
          </div>
        </div>
      </section>

      <footer className="px-4 pb-8 pt-3 lg:px-6">
        <div className="bookforge-frame flex flex-col gap-5 text-[12px] font-bold text-[#6b7280] md:flex-row md:items-center md:justify-between">
          <Logo compact />
          <div className="flex flex-wrap items-center justify-center gap-10">
            <Link href="#how-it-works">How It Works</Link>
            <Link href="#examples">Examples</Link>
            <Link href="#pricing">Pricing</Link>
            <Link href="#faq">FAQ</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/support">Contact</Link>
          </div>
          <p>© 2024 BookForge. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function HeroMockup() {
  return (
    <div className="bookforge-hero-flow">
      <MockColumn
        title="1. Your Inputs"
        items={[
          ["Book Idea", "lightbulb"],
          ["Notes", "notes"],
          ["Research PDF", "pdf"],
          ["Draft Chapter", "draft"],
        ]}
      />
      <Arrow />
      <MockColumn
        title="2. Book Plan"
        items={[
          ["Book Concept", "target"],
          ["Title Ideas", "tag"],
          ["Chapter Outline", "list"],
          ["Sample Chapter", "sample"],
        ]}
      />
      <Arrow />
      <div>
        <p className="mb-4 text-center text-sm font-black text-[#0d2a4a]">3. Finished Book</p>
        <div className="grid grid-cols-[210px_96px] gap-7">
          <div className="bookforge-cover cover-horizon relative mx-auto h-[286px] w-[186px] p-5 text-center text-white">
            <p className="relative z-10 mt-7 text-[27px] font-black leading-tight text-[#f8df9a]">BEYOND THE HORIZON</p>
            <p className="relative z-10 mx-auto mt-4 max-w-[130px] text-[9px] font-semibold uppercase tracking-[0.14em] text-white/80">
              A journey of purpose and possibility
            </p>
            <div className="cover-mountains" />
            <p className="absolute bottom-5 left-0 right-0 z-10 text-[12px] font-black tracking-[0.18em] text-[#f8df9a]">JAMES MORGAN</p>
          </div>
          <div className="grid content-center gap-5">
            <ExportTile badge="PDF" label="Export PDF" tone="red" />
            <ExportTile badge="W" label="Export DOCX" tone="blue" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MockColumn({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <p className="mb-4 text-center text-sm font-black text-[#0d2a4a]">{title}</p>
      <div className="grid gap-4 rounded-lg bg-[#f8efe3] p-3 shadow-sm shadow-[#d8c5a6]/20">
        {items.map(([label, icon]) => (
          <div className="flex h-[64px] items-center gap-4 rounded-md bg-white px-4 text-sm font-black text-[#263b53] shadow-md shadow-[#d8c5a6]/25" key={label}>
            <Icon name={icon as IconName} className="h-6 w-6 text-[#c98214]" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="hidden h-11 w-11 items-center justify-center self-center rounded-full bg-[#c98214] text-2xl font-black text-white shadow-md shadow-amber-900/20 lg:flex">
      &gt;
    </div>
  );
}

function ExportTile({ badge, label, tone }: { badge: string; label: string; tone: "red" | "blue" }) {
  const badgeClass = tone === "red" ? "border-red-200 text-red-600" : "border-blue-200 bg-blue-600 text-white";

  return (
    <div className="flex h-[110px] flex-col items-center justify-center rounded-lg border border-[#e8ddca] bg-white text-center text-[12px] font-black text-[#263b53] shadow-md shadow-[#d8c5a6]/25">
      <span className={`mb-3 rounded border px-2 py-1 text-[20px] font-black ${badgeClass}`}>{badge}</span>
      {label}
    </div>
  );
}
