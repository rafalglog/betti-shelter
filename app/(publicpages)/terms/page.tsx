"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

const TermsPage = () => {
  const t = useTranslations();

  const sections = [
    {
      title: t("termsPage.sections.acceptance.title"),
      body: t("termsPage.sections.acceptance.body"),
    },
    {
      title: t("termsPage.sections.accounts.title"),
      body: t("termsPage.sections.accounts.body"),
    },
    {
      title: t("termsPage.sections.use.title"),
      body: t("termsPage.sections.use.body"),
    },
    {
      title: t("termsPage.sections.content.title"),
      body: t("termsPage.sections.content.body"),
    },
    {
      title: t("termsPage.sections.donations.title"),
      body: t("termsPage.sections.donations.body"),
    },
    {
      title: t("termsPage.sections.liability.title"),
      body: t("termsPage.sections.liability.body"),
    },
  ];

  return (
    <main className="relative overflow-hidden bg-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-0 h-80 w-80 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-rose-300/15 blur-3xl" />
      </div>

      <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16 md:py-24">
        <div className="space-y-5">
          <p className="inline-flex w-fit items-center rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
            {t("termsPage.hero.kicker")}
          </p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            {t("termsPage.hero.title")}
          </h1>
          <p className="max-w-3xl text-lg text-slate-200">
            {t("termsPage.hero.subtitle")}
          </p>
          <p className="text-sm text-slate-300">
            {t("termsPage.hero.updated")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20"
            >
              <h3 className="text-xl font-semibold">{section.title}</h3>
              <p className="mt-3 text-sm text-slate-200">{section.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          <h2 className="text-3xl font-semibold">{t("termsPage.footer.title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-200">
            {t("termsPage.footer.body")}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-amber-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
            >
              {t("termsPage.footer.primaryCta")}
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center justify-center rounded-md border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {t("termsPage.footer.secondaryCta")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TermsPage;
