"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

const VolunteerPage = () => {
  const t = useTranslations();

  return (
    <main className="relative overflow-hidden bg-emerald-950 text-emerald-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-16 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-teal-200/15 blur-3xl" />
      </div>

      <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 md:py-24">
        <div className="flex flex-col gap-6">
          <p className="inline-flex w-fit items-center rounded-full border border-emerald-200/20 bg-emerald-100/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
            {t("volunteer.hero.kicker")}
          </p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            {t("volunteer.hero.title")}
          </h1>
          <p className="max-w-3xl text-lg text-emerald-100">
            {t("volunteer.hero.subtitle")}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:volunteer@bettipets.kurnik.co"
              className="inline-flex items-center justify-center rounded-md bg-emerald-300 px-6 py-3 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-300/20 transition hover:bg-emerald-200"
            >
              {t("volunteer.hero.primaryCta")}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {t("volunteer.hero.secondaryCta")}
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: t("volunteer.roles.care.title"),
              body: t("volunteer.roles.care.body"),
            },
            {
              title: t("volunteer.roles.events.title"),
              body: t("volunteer.roles.events.body"),
            },
            {
              title: t("volunteer.roles.support.title"),
              body: t("volunteer.roles.support.body"),
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20"
            >
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm text-emerald-100">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative bg-emerald-900/60">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-5">
            <h2 className="text-3xl font-semibold">{t("volunteer.why.title")}</h2>
            <p className="text-emerald-100">{t("volunteer.why.body")}</p>
            <ul className="space-y-3 text-sm text-emerald-50">
              <li>• {t("volunteer.why.items.training")}</li>
              <li>• {t("volunteer.why.items.flexible")}</li>
              <li>• {t("volunteer.why.items.team")}</li>
              <li>• {t("volunteer.why.items.impact")}</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-300/20 via-white/10 to-teal-200/10 p-8">
            <h3 className="text-2xl font-semibold">{t("volunteer.steps.title")}</h3>
            <ol className="mt-5 space-y-4 text-sm text-emerald-50">
              <li>
                <span className="font-semibold">{t("volunteer.steps.step1.title")}</span>
                <p className="text-emerald-100">{t("volunteer.steps.step1.body")}</p>
              </li>
              <li>
                <span className="font-semibold">{t("volunteer.steps.step2.title")}</span>
                <p className="text-emerald-100">{t("volunteer.steps.step2.body")}</p>
              </li>
              <li>
                <span className="font-semibold">{t("volunteer.steps.step3.title")}</span>
                <p className="text-emerald-100">{t("volunteer.steps.step3.body")}</p>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-6xl px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          <h2 className="text-3xl font-semibold">{t("volunteer.footer.title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-emerald-100">
            {t("volunteer.footer.body")}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:volunteer@bettipets.kurnik.co"
              className="inline-flex items-center justify-center rounded-md bg-emerald-300 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-200"
            >
              {t("volunteer.footer.primaryCta")}
            </a>
            <Link
              href="/pets"
              className="inline-flex items-center justify-center rounded-md border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {t("volunteer.footer.secondaryCta")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default VolunteerPage;
