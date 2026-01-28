"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

const DonatePage = () => {
  const t = useTranslations();

  return (
    <main className="relative overflow-hidden bg-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-emerald-400/15 blur-3xl" />
      </div>

      <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 md:py-24">
        <div className="flex flex-col gap-6">
          <p className="inline-flex w-fit items-center rounded-full border border-amber-200/20 bg-amber-100/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
            {t("donate.hero.kicker")}
          </p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            {t("donate.hero.title")}
          </h1>
          <p className="max-w-3xl text-lg text-slate-200">
            {t("donate.hero.subtitle")}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:donate@bettipets.kurnik.co"
              className="inline-flex items-center justify-center rounded-md bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300"
            >
              {t("donate.hero.primaryCta")}
            </a>
            <Link
              href="/pets"
              className="inline-flex items-center justify-center rounded-md border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {t("donate.hero.secondaryCta")}
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: t("donate.impact.medical.title"),
              body: t("donate.impact.medical.body"),
              amount: t("donate.impact.medical.amount"),
            },
            {
              title: t("donate.impact.shelter.title"),
              body: t("donate.impact.shelter.body"),
              amount: t("donate.impact.shelter.amount"),
            },
            {
              title: t("donate.impact.meals.title"),
              body: t("donate.impact.meals.body"),
              amount: t("donate.impact.meals.amount"),
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
                {item.amount}
              </p>
              <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-200">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative bg-slate-900/60">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-5">
            <h2 className="text-3xl font-semibold">{t("donate.costs.title")}</h2>
            <p className="text-slate-200">{t("donate.costs.body")}</p>
            <ul className="space-y-3 text-sm text-slate-100">
              <li>• {t("donate.costs.items.vet")}</li>
              <li>• {t("donate.costs.items.food")}</li>
              <li>• {t("donate.costs.items.shelter")}</li>
              <li>• {t("donate.costs.items.rehab")}</li>
              <li>• {t("donate.costs.items.transport")}</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-amber-400/15 via-white/5 to-emerald-300/10 p-8">
            <h3 className="text-2xl font-semibold">{t("donate.monthly.title")}</h3>
            <p className="mt-3 text-sm text-slate-200">
              {t("donate.monthly.body")}
            </p>
            <div className="mt-6 grid gap-3 text-sm">
              <div className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3">
                <span>{t("donate.monthly.levels.friend")}</span>
                <span className="font-semibold">{t("donate.monthly.levels.friendAmount")}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3">
                <span>{t("donate.monthly.levels.guardian")}</span>
                <span className="font-semibold">{t("donate.monthly.levels.guardianAmount")}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3">
                <span>{t("donate.monthly.levels.hero")}</span>
                <span className="font-semibold">{t("donate.monthly.levels.heroAmount")}</span>
              </div>
            </div>
            <a
              href="mailto:donate@bettipets.kurnik.co"
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-white/90 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white"
            >
              {t("donate.monthly.cta")}
            </a>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-6xl px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          <h2 className="text-3xl font-semibold">{t("donate.footer.title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-200">
            {t("donate.footer.body")}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:donate@bettipets.kurnik.co"
              className="inline-flex items-center justify-center rounded-md bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
            >
              {t("donate.footer.primaryCta")}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {t("donate.footer.secondaryCta")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DonatePage;
