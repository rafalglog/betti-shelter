"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

const FosterPage = () => {
  const t = useTranslations();

  return (
    <main className="relative overflow-hidden bg-indigo-950 text-indigo-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-0 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-96 w-96 rounded-full bg-sky-200/15 blur-3xl" />
      </div>

      <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 md:py-24">
        <div className="flex flex-col gap-6">
          <p className="inline-flex w-fit items-center rounded-full border border-indigo-200/20 bg-indigo-100/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">
            {t("foster.hero.kicker")}
          </p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            {t("foster.hero.title")}
          </h1>
          <p className="max-w-3xl text-lg text-indigo-100">
            {t("foster.hero.subtitle")}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:foster@bettipets.kurnik.co"
              className="inline-flex items-center justify-center rounded-md bg-indigo-300 px-6 py-3 text-sm font-semibold text-indigo-950 shadow-lg shadow-indigo-300/20 transition hover:bg-indigo-200"
            >
              {t("foster.hero.primaryCta")}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {t("foster.hero.secondaryCta")}
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: t("foster.benefits.home.title"),
              body: t("foster.benefits.home.body"),
            },
            {
              title: t("foster.benefits.support.title"),
              body: t("foster.benefits.support.body"),
            },
            {
              title: t("foster.benefits.adoption.title"),
              body: t("foster.benefits.adoption.body"),
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20"
            >
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm text-indigo-100">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative bg-indigo-900/60">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-5">
            <h2 className="text-3xl font-semibold">{t("foster.expect.title")}</h2>
            <p className="text-indigo-100">{t("foster.expect.body")}</p>
            <ul className="space-y-3 text-sm text-indigo-50">
              <li>• {t("foster.expect.items.supplies")}</li>
              <li>• {t("foster.expect.items.training")}</li>
              <li>• {t("foster.expect.items.medical")}</li>
              <li>• {t("foster.expect.items.match")}</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-300/20 via-white/10 to-sky-200/10 p-8">
            <h3 className="text-2xl font-semibold">{t("foster.steps.title")}</h3>
            <ol className="mt-5 space-y-4 text-sm text-indigo-50">
              <li>
                <span className="font-semibold">{t("foster.steps.step1.title")}</span>
                <p className="text-indigo-100">{t("foster.steps.step1.body")}</p>
              </li>
              <li>
                <span className="font-semibold">{t("foster.steps.step2.title")}</span>
                <p className="text-indigo-100">{t("foster.steps.step2.body")}</p>
              </li>
              <li>
                <span className="font-semibold">{t("foster.steps.step3.title")}</span>
                <p className="text-indigo-100">{t("foster.steps.step3.body")}</p>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-6xl px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          <h2 className="text-3xl font-semibold">{t("foster.footer.title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-indigo-100">
            {t("foster.footer.body")}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:foster@bettipets.kurnik.co"
              className="inline-flex items-center justify-center rounded-md bg-indigo-300 px-6 py-3 text-sm font-semibold text-indigo-950 transition hover:bg-indigo-200"
            >
              {t("foster.footer.primaryCta")}
            </a>
            <Link
              href="/pets"
              className="inline-flex items-center justify-center rounded-md border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {t("foster.footer.secondaryCta")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FosterPage;
