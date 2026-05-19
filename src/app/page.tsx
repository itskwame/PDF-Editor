import Link from "next/link";

type IconName =
  | "text"
  | "signature"
  | "calendar"
  | "checkbox"
  | "highlight"
  | "image"
  | "draw"
  | "rotate"
  | "trash"
  | "list"
  | "download"
  | "form"
  | "shield"
  | "lock"
  | "gift"
  | "bolt"
  | "upload"
  | "edit"
  | "link"
  | "user";

const iconPaths: Record<IconName, string[]> = {
  text: ["M6 5h12", "M12 5v14", "M8 19h8"],
  signature: ["M4 17c4-8 6-8 7-2 1 4 3 2 5-1 2-3 3-2 4 1"],
  calendar: ["M7 3v4", "M17 3v4", "M4 8h16", "M5 5h14v15H5z"],
  checkbox: ["M5 5h14v14H5z", "M8 12l3 3 5-6"],
  highlight: ["M14 4l6 6-9 9H5v-6z", "M4 20h16"],
  image: ["M5 5h14v14H5z", "M8 15l3-3 2 2 3-4 3 5", "M9 9h.01"],
  draw: ["M4 20l4-1 10-10-3-3L5 16z", "M13 6l3 3"],
  rotate: ["M4 8V4h4", "M5 5a8 8 0 1 1-1 8"],
  trash: ["M4 7h16", "M10 11v6", "M14 11v6", "M6 7l1 14h10l1-14", "M9 7V4h6v3"],
  list: ["M8 6h12", "M8 12h12", "M8 18h12", "M4 6h.01", "M4 12h.01", "M4 18h.01"],
  download: ["M12 4v11", "M7 10l5 5 5-5", "M5 20h14"],
  form: ["M6 4h12v16H6z", "M9 8h6", "M9 12h6", "M9 16h3"],
  shield: ["M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"],
  lock: ["M7 11h10v9H7z", "M9 11V8a3 3 0 0 1 6 0v3"],
  gift: ["M4 9h16", "M12 9v12", "M5 9v12h14V9", "M8 9a2.5 2.5 0 1 1 4 0", "M16 9a2.5 2.5 0 1 0-4 0"],
  bolt: ["M13 2L4 14h7l-1 8 9-12h-7z"],
  upload: ["M12 16V5", "M7 10l5-5 5 5", "M5 20h14"],
  edit: ["M4 20l4-1 11-11-3-3L5 16z", "M13 5l3 3"],
  link: ["M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1", "M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"],
  user: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8", "M4 21a8 8 0 0 1 16 0"],
};

function Icon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
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

const features: { title: string; icon: IconName; color: string }[] = [
  { title: "Add Text", icon: "text", color: "text-blue-600" },
  { title: "Sign PDFs", icon: "signature", color: "text-violet-600" },
  { title: "Add Dates", icon: "calendar", color: "text-emerald-600" },
  { title: "Add Checkboxes", icon: "checkbox", color: "text-orange-600" },
  { title: "Highlight", icon: "highlight", color: "text-amber-500" },
  { title: "Add Images", icon: "image", color: "text-blue-500" },
  { title: "Draw and Mark Up", icon: "draw", color: "text-rose-500" },
  { title: "Rotate Pages", icon: "rotate", color: "text-indigo-600" },
  { title: "Delete Pages", icon: "trash", color: "text-red-500" },
  { title: "Reorder Pages", icon: "list", color: "text-sky-600" },
  { title: "Download Finished PDF", icon: "download", color: "text-green-600" },
  { title: "Fill PDF Forms", icon: "form", color: "text-violet-600" },
];

const trustItems: { title: string; icon: IconName; color: string }[] = [
  { title: "No watermark", icon: "checkbox", color: "text-blue-600" },
  { title: "Secure uploads", icon: "lock", color: "text-green-600" },
  { title: "3 free PDFs/month", icon: "gift", color: "text-violet-600" },
  { title: "No install needed", icon: "bolt", color: "text-orange-500" },
];

const steps: { title: string; icon: IconName }[] = [
  { title: "Upload your PDF", icon: "upload" },
  { title: "Make your changes", icon: "edit" },
  { title: "Download your finished file", icon: "download" },
];

const securityItems: { title: string; copy: string; icon: IconName; color: string }[] = [
  {
    title: "Private files",
    copy: "Your files are private and visible only to you.",
    icon: "shield",
    color: "text-blue-600",
  },
  {
    title: "Secure temporary links",
    copy: "Links to your files are encrypted and time-limited.",
    icon: "link",
    color: "text-green-600",
  },
  {
    title: "Account-based access",
    copy: "Your files are tied to your account for easy access.",
    icon: "user",
    color: "text-violet-600",
  },
  {
    title: "Automatic file deletion for free users",
    copy: "We automatically delete your files after a short time.",
    icon: "trash",
    color: "text-orange-600",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    suffix: "/month",
    items: [
      "3 completed PDF downloads/month",
      "No watermark",
      "Full basic PDF editor",
    ],
  },
  {
    name: "Basic",
    price: "$12",
    suffix: "/month",
    items: [
      "25 completed PDF downloads/month",
      "Longer storage",
      "Saved signatures and templates later",
    ],
    featured: true,
  },
  {
    name: "Pro",
    price: "$19",
    suffix: "/month",
    items: ["Unlimited downloads", "Advanced tools", "Business workflows later"],
  },
];

const faqs = [
  {
    question: "Can I edit a PDF online for free?",
    answer:
      "Yes. You can edit PDFs online for free. Free users get 3 completed downloads per month.",
  },
  {
    question: "Is there a watermark?",
    answer: "No. All PDFs you download are watermark-free, even on the free plan.",
  },
  {
    question: "What counts as one free use?",
    answer:
      "Each time you download a completed PDF, it counts as one use. You get 3 downloads per month on the free plan.",
  },
  {
    question: "Do I need an account?",
    answer:
      "You can start for free without an account. Creating an account helps you access your files across devices.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="text-2xl font-black tracking-tight text-slate-950">
            FreePDF<span className="text-blue-600">Flow</span>
          </Link>

          <nav className="hidden items-center gap-10 text-sm font-semibold text-slate-800 md:flex">
            <Link href="/edit" className="transition hover:text-blue-600">
              Edit PDF
            </Link>
            <Link href="/edit?tool=signature" className="transition hover:text-blue-600">
              Sign PDF
            </Link>
            <Link href="/pricing" className="transition hover:text-blue-600">
              Pricing
            </Link>
            <Link href="/#faq" className="transition hover:text-blue-600">
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-semibold text-slate-800 transition hover:text-blue-600 sm:inline-flex"
            >
              Login
            </Link>
            <Link
              href="/edit"
              className="rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-700 hover:to-violet-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Edit PDF Free
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-slate-50" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-14 pt-14 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:px-8 lg:pb-20 lg:pt-16">
          <div className="text-center lg:text-left">
            <h1 className="max-w-xl text-5xl font-black leading-[1.02] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Edit PDFs Online for Free
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-lg leading-8 text-slate-700 lg:mx-0">
              Add text, signatures, dates, checkboxes, images, highlights, and
              more. Download 3 finished PDFs every month for free. No watermark.
              No surprise paywall.
            </p>

            <div className="mx-auto mt-9 hidden max-w-md rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-xl shadow-slate-200/70 sm:block lg:mx-0">
              <div className="flex gap-3">
                {[
                  { icon: "text" as IconName, label: "Text" },
                  { icon: "signature" as IconName, label: "Sign" },
                  { icon: "image" as IconName, label: "Image" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex h-20 flex-1 flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-600"
                  >
                    <Icon name={item.icon} className="mb-2 h-7 w-7 text-blue-600" />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/80">
            <div className="flex min-h-[330px] flex-col items-center justify-center rounded-[1.35rem] border-2 border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 text-violet-600 shadow-sm">
                <Icon name="upload" className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">
                Drag and drop your PDF here
              </h2>
              <Link
                href="/edit"
                className="mt-6 inline-flex min-w-72 justify-center rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/25 transition hover:from-blue-700 hover:to-violet-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                Choose PDF File
              </Link>
              <p className="mt-5 max-w-sm text-base leading-7 text-slate-500">
                PDF files only for MVP. Free users get 3 completed downloads per
                month.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-7 px-5 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-6 py-4 text-sm font-black text-slate-900 shadow-lg shadow-slate-200/70"
            >
              <Icon name={item.icon} className={`h-5 w-5 ${item.color}`} />
              {item.title}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <h2 className="text-center text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          Everything You Need to Edit a PDF
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex min-h-24 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 text-center shadow-md shadow-slate-200/60"
            >
              <Icon name={feature.icon} className={`h-9 w-9 ${feature.color}`} />
              <h3 className="mt-3 text-sm font-black leading-5 text-slate-950">
                {feature.title}
              </h3>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-8 lg:px-8">
        <h2 className="text-center text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          Edit Your PDF in 3 Simple Steps
        </h2>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex items-center gap-5 rounded-lg border border-blue-100 bg-white px-8 py-5 shadow-sm shadow-slate-200/70"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-xl font-black text-white">
                {index + 1}
              </div>
              <Icon name={step.icon} className="h-9 w-9 shrink-0 text-blue-600" />
              <h3 className="text-sm font-black leading-5 text-slate-950">
                {step.title}
              </h3>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <h2 className="text-center text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          Built for Private, Secure PDF Editing
        </h2>
        <div className="mt-6 grid gap-5 lg:grid-cols-4">
          {securityItems.map((item) => (
            <div
              key={item.title}
              className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-md shadow-slate-200/60"
            >
              <Icon name={item.icon} className={`h-11 w-11 shrink-0 ${item.color}`} />
              <div>
                <h3 className="text-base font-black leading-5 text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
        <h2 className="text-center text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          Simple Pricing. No Tricks.
        </h2>
        <div className="mt-5 grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border bg-white p-6 shadow-md shadow-slate-200/60 ${
                plan.featured ? "border-violet-500 ring-1 ring-violet-500" : "border-slate-200"
              }`}
            >
              {plan.featured ? (
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-b-lg rounded-t-none bg-violet-600 px-5 py-1 text-xs font-black uppercase tracking-wide text-white">
                  Most Popular
                </div>
              ) : null}
              <h3 className="text-xl font-black text-slate-950">{plan.name}</h3>
              <p className="mt-2 border-b border-slate-200 pb-4 text-4xl font-black tracking-tight text-slate-950">
                {plan.price}
                <span className="text-base font-medium text-slate-700">
                  {plan.suffix}
                </span>
              </p>
              <ul className="mt-4 space-y-2 text-sm font-medium leading-6 text-slate-700">
                {plan.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <Icon name="checkbox" className="mt-1 h-4 w-4 shrink-0 text-green-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 mx-auto max-w-6xl px-5 py-8 lg:px-8">
        <h2 className="text-center text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          Common Questions
        </h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-md shadow-slate-200/60"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-sm font-black text-white">
                {index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-black leading-5 text-slate-950">
                  {faq.question}
                </h3>
                <p className="mt-1 text-sm leading-5 text-slate-600">{faq.answer}</p>
              </div>
              <span className="text-xl leading-none text-slate-600">v</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 pb-10 pt-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-8 text-center text-white shadow-xl shadow-blue-600/20">
          <h2 className="text-3xl font-black tracking-tight">
            Ready to edit your PDF?
          </h2>
          <Link
            href="/edit"
            className="mt-6 inline-flex items-center gap-3 rounded-lg bg-white px-10 py-4 text-base font-black text-blue-700 shadow-lg shadow-blue-950/20 transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-white/50"
          >
            <Icon name="upload" className="h-5 w-5" />
            Upload PDF Free
          </Link>
        </div>
      </section>
    </main>
  );
}
