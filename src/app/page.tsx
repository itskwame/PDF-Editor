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
  | "refresh";

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
};

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

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-2xl font-black text-[#0d2a4a]">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f8ead2] text-[#c98214]">
        <Icon name="quill" className="h-5 w-5" />
      </span>
      BookForge
    </Link>
  );
}

function GoldButton({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-lg bg-[#c98214] px-5 py-3 text-sm font-black text-white shadow-lg shadow-amber-900/15 transition hover:bg-[#a9670e] ${className}`}
    >
      {children}
    </Link>
  );
}

function SecondaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-lg border border-[#e6d9c3] bg-white px-5 py-3 text-sm font-black text-[#0d2a4a] shadow-sm transition hover:border-[#c98214]"
    >
      {children}
    </Link>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-3xl font-black leading-tight text-[#0d2a4a] md:text-4xl">{children}</h2>;
}

function Card({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <div id={id} className={`rounded-xl border border-[#eadfcd] bg-white/90 p-5 shadow-sm shadow-[#d8c5a6]/20 ${className}`}>
      {children}
    </div>
  );
}

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
  ["Nonfiction Book", "Turn your knowledge, teaching, and experience into authority.", "book"],
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

const pricingRows = [
  ["10 pages", "$19", "$39"],
  ["50 pages", "$49", "$99"],
  ["100 pages", "$99", "$199"],
  ["200 pages", "$199", "$399"],
  ["300 pages", "$349", "$699"],
  ["500 pages", "$699", "$1,299"],
];

const sampleBooks = [
  ["THE FOCUS EDGE", "Nonfiction", "from-[#111827] to-[#334155]"],
  ["WHISPERS OF THE MOON", "Fiction", "from-[#0f172a] to-[#1e3a5f]"],
  ["A Life Unfolded", "Memoir", "from-[#efe2d0] to-[#cda56e]"],
  ["The Brave Little Star", "Children's", "from-[#1d4ed8] to-[#f4b642]"],
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

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fbf7ef] text-[#0d2a4a]">
      <header className="sticky top-0 z-50 border-b border-[#eadfcd] bg-[#fffaf0]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-9 text-sm font-black text-[#102b49] md:flex">
            <Link href="#how-it-works">How It Works</Link>
            <Link href="#examples">Examples</Link>
            <Link href="#pricing">Pricing</Link>
            <Link href="#faq">FAQ</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm font-black text-[#102b49] sm:inline-flex">
              Log In
            </Link>
            <GoldButton href="/books/new">Start Free Book Preview</GoldButton>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:py-16">
        <div>
          <h1 className="max-w-2xl text-5xl font-black leading-[1.02] tracking-tight text-[#0d2a4a] md:text-6xl">
            Turn Your Idea, Notes, or Draft Into a Finished Book
          </h1>
          <p className="mt-5 max-w-xl text-lg font-medium leading-8 text-[#31445c]">
            Plan, write, edit, format, and export your book with a guided step-by-step process.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <GoldButton href="/books/new">Start Your Free Book Preview</GoldButton>
            <SecondaryButton href="#examples">See Sample Books</SecondaryButton>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm font-bold text-[#31445c]">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c98214] text-white">
              <Icon name="check" className="h-3 w-3" />
            </span>
            No blank page. No confusing prompts. No formatting headaches.
          </p>
        </div>

        <div className="grid gap-4 rounded-2xl border border-[#eadfcd] bg-white/70 p-4 shadow-xl shadow-[#d8c5a6]/30 lg:grid-cols-[1fr_auto_1fr_auto_1.25fr]">
          <MockColumn title="1. Your Inputs" items={[["Book Idea", "lightbulb"], ["Notes", "notes"], ["Research PDF", "pdf"], ["Draft Chapter", "draft"]]} />
          <Arrow />
          <MockColumn title="2. Book Plan" items={[["Book Concept", "target"], ["Title Ideas", "tag"], ["Chapter Outline", "list"], ["Sample Chapter", "sample"]]} />
          <Arrow />
          <div>
            <p className="mb-3 text-center text-sm font-black">3. Finished Book</p>
            <div className="grid grid-cols-[1fr_72px] gap-4">
              <div className="flex min-h-64 flex-col justify-between rounded-lg bg-gradient-to-br from-[#102b49] to-[#071827] p-5 text-white shadow-2xl shadow-slate-900/25">
                <div>
                  <p className="text-2xl font-black leading-tight text-[#f7d38b]">BEYOND THE HORIZON</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.25em] text-white/70">A journey of purpose and possibility</p>
                </div>
                <p className="text-sm font-bold text-white/85">James Morgan</p>
              </div>
              <div className="grid gap-3">
                <ExportTile label="Export PDF" badge="PDF" />
                <ExportTile label="Export DOCX" badge="W" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Band>
        <div className="grid gap-5 lg:grid-cols-[1.1fr_3fr] lg:items-center">
          <SectionTitle>Your Book Should Not Stay Stuck in Your Head, Notes, or Drafts</SectionTitle>
          <div className="grid gap-4 md:grid-cols-3">
            {problemCards.map((card) => (
              <Card className="flex items-center gap-4" key={card.title}>
                <IconBadge icon={card.icon} />
                <div>
                  <h3 className="font-black">{card.title}</h3>
                  <p className="mt-1 text-sm font-medium text-[#31445c]">{card.copy}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Band>

      <Band>
        <div className="grid gap-5 lg:grid-cols-[1fr_4fr]">
          <SectionTitle>A Guided Book Creation Studio</SectionTitle>
          <div className="grid gap-4 md:grid-cols-3">
            {solutionCards.map(([title, copy, icon]) => (
              <FeatureCard key={title} title={title} copy={copy} icon={icon as IconName} />
            ))}
          </div>
        </div>
      </Band>

      <Band>
        <div className="grid gap-5 lg:grid-cols-[1fr_4fr]">
          <SectionTitle>Write Any Type of Book</SectionTitle>
          <div className="grid gap-4 md:grid-cols-4">
            {bookTypes.map(([title, copy, icon]) => (
              <FeatureCard key={title} title={title} copy={copy} icon={icon as IconName} />
            ))}
          </div>
        </div>
      </Band>

      <Band id="how-it-works">
        <div className="grid gap-6 lg:grid-cols-[1fr_3fr_1.25fr]">
          <SectionTitle>How BookForge Works</SectionTitle>
          <div className="grid gap-3 md:grid-cols-5">
            {steps.map(([title, copy, icon], index) => (
              <Card className="text-center" key={title}>
                <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#c98214] text-sm font-black text-white">{index + 1}</div>
                <Icon name={icon as IconName} className="mx-auto h-7 w-7 text-[#0d2a4a]" />
                <h3 className="mt-3 text-sm font-black">{title}</h3>
                <p className="mt-2 text-xs font-medium leading-5 text-[#31445c]">{copy}</p>
              </Card>
            ))}
          </div>
          <Card>
            <h3 className="text-center text-xl font-black">See Your Book Plan Before You Pay</h3>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-bold text-[#31445c]">
              {previewItems.map((item) => (
                <span className="flex items-center gap-2" key={item}>
                  <Icon name="check" className="h-4 w-4 text-[#c98214]" />
                  {item}
                </span>
              ))}
            </div>
            <GoldButton href="/books/new" className="mt-5 w-full">Get Your Free Book Plan</GoldButton>
          </Card>
        </div>
      </Band>

      <Band>
        <div className="grid gap-5 lg:grid-cols-[1fr_4fr]">
          <SectionTitle>Any Genre. Any Style.</SectionTitle>
          <div className="flex flex-wrap gap-3">
            {chips.map((chip) => (
              <span className="rounded-lg border border-[#eadfcd] bg-white px-4 py-2 text-sm font-bold text-[#31445c] shadow-sm" key={chip}>
                {chip}
              </span>
            ))}
          </div>
        </div>
      </Band>

      <Band>
        <div className="grid gap-5 lg:grid-cols-[1fr_4fr]">
          <SectionTitle>You Stay in Control of the Book</SectionTitle>
          <div className="grid gap-4 md:grid-cols-4">
            {controlCards.map(([title, copy, icon]) => (
              <FeatureCard key={title} title={title} copy={copy} icon={icon as IconName} />
            ))}
          </div>
        </div>
      </Band>

      <Band>
        <div className="grid gap-5 lg:grid-cols-[1fr_4fr]">
          <SectionTitle>From Idea to Finished Book</SectionTitle>
          <div className="grid gap-3 md:grid-cols-5">
            {["Rough Idea", "Notes", "Chapter Outline", "Polished Chapters", "Finished PDF / DOCX"].map((item, index) => (
              <Card className="text-center" key={item}>
                <Icon name={["lightbulb", "notes", "list", "draft", "book"][index] as IconName} className="mx-auto h-8 w-8 text-[#c98214]" />
                <p className="mt-3 text-sm font-black">{item}</p>
              </Card>
            ))}
          </div>
        </div>
      </Band>

      <section id="pricing" className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-2 lg:px-8">
        <Card>
          <h2 className="text-center text-3xl font-black text-[#0d2a4a]">Simple Book Pricing</h2>
          <div className="mt-5 overflow-hidden rounded-lg border border-[#d9c7aa]">
            <table className="w-full border-collapse bg-white text-center text-sm">
              <thead className="bg-[#0d2a4a] text-white">
                <tr>
                  <th className="p-3">Book Size</th>
                  <th className="p-3">Without Images</th>
                  <th className="p-3">With Images</th>
                </tr>
              </thead>
              <tbody>
                {pricingRows.map((row) => (
                  <tr className="border-t border-[#eadfcd]" key={row[0]}>
                    {row.map((cell) => <td className="p-3 font-bold" key={cell}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm font-medium text-[#31445c]">
            Nothing is unlimited. Each package includes clear limits for rewrites, image credits, uploads, and exports.
          </p>
        </Card>

        <Card id="examples">
          <h2 className="text-center text-3xl font-black text-[#0d2a4a]">Sample Books</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
            {sampleBooks.map(([title, label, gradient]) => (
              <div key={title}>
                <div className={`flex aspect-[2/3] items-center justify-center rounded-lg bg-gradient-to-br ${gradient} p-4 text-center text-xl font-black text-white shadow-lg`}>
                  {title}
                </div>
                <p className="mt-2 text-center text-sm font-bold">{label}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Band id="faq">
        <div className="grid gap-5 lg:grid-cols-[1fr_4fr]">
          <SectionTitle>Frequently Asked Questions</SectionTitle>
          <div className="grid gap-3 md:grid-cols-3">
            {faqs.map((faq) => (
              <details className="rounded-lg border border-[#eadfcd] bg-white px-4 py-3 text-sm font-black shadow-sm" key={faq}>
                <summary>{faq}</summary>
                <p className="mt-3 font-medium leading-6 text-[#31445c]">
                  BookForge guides you through a structured book creation process while keeping you in control of the content.
                </p>
              </details>
            ))}
          </div>
        </div>
      </Band>

      <section className="px-5 pb-8 pt-5 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 rounded-2xl bg-[#0d2a4a] px-8 py-8 text-center text-white shadow-xl shadow-slate-900/20 md:flex-row md:text-left">
          <div className="flex items-center gap-5">
            <Icon name="quill" className="hidden h-14 w-14 text-[#f2bd5b] sm:block" />
            <div>
              <h2 className="text-3xl font-black text-[#f7d38b]">Your Book Is Closer to Finished Than You Think</h2>
              <p className="mt-2 font-medium text-white/85">Stop overthinking. Start creating. Get your free book plan today.</p>
            </div>
          </div>
          <div>
            <GoldButton href="/books/new">Start Your Free Book Preview</GoldButton>
            <p className="mt-2 text-center text-xs font-bold text-white/80">No credit card required.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#eadfcd] px-5 py-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm font-bold text-[#31445c] md:flex-row md:items-center md:justify-between">
          <Logo />
          <div className="flex flex-wrap gap-5">
            {["How It Works", "Examples", "Pricing", "FAQ", "Blog", "Contact", "Privacy Policy", "Terms of Service"].map((link) => (
              <Link href={link === "Privacy Policy" ? "/privacy" : link === "Terms of Service" ? "/terms" : `/#${link.toLowerCase().replaceAll(" ", "-")}`} key={link}>
                {link}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}

function Band({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="px-5 py-3 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-2xl border border-[#eadfcd] bg-[#fffaf0]/80 p-5 shadow-sm shadow-[#d8c5a6]/20">
        {children}
      </div>
    </section>
  );
}

function IconBadge({ icon }: { icon: IconName }) {
  return (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f8ead2] text-[#c98214]">
      <Icon name={icon} className="h-8 w-8" />
    </span>
  );
}

function FeatureCard({ title, copy, icon }: { title: string; copy: string; icon: IconName }) {
  return (
    <Card>
      <Icon name={icon} className="h-7 w-7 text-[#c98214]" />
      <h3 className="mt-3 font-black">{title}</h3>
      <p className="mt-2 text-sm font-medium leading-6 text-[#31445c]">{copy}</p>
    </Card>
  );
}

function MockColumn({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <p className="mb-3 text-center text-sm font-black">{title}</p>
      <div className="grid gap-3 rounded-xl bg-[#f7efe4] p-3">
        {items.map(([label, icon]) => (
          <div className="flex items-center gap-3 rounded-lg bg-white p-3 text-sm font-black shadow-sm" key={label}>
            <Icon name={icon as IconName} className="h-5 w-5 text-[#c98214]" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function Arrow() {
  return <div className="hidden h-10 w-10 items-center justify-center self-center rounded-full bg-[#c98214] text-xl font-black text-white lg:flex">-</div>;
}

function ExportTile({ label, badge }: { label: string; badge: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-[#eadfcd] bg-white p-3 text-center text-xs font-black shadow-sm">
      <span className="mb-2 rounded border border-[#eadfcd] px-2 py-1 text-[#c98214]">{badge}</span>
      {label}
    </div>
  );
}
