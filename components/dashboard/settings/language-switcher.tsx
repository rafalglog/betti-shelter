"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const locales = [
  { value: "en", label: "English" },
  { value: "pl", label: "Polski" },
  { value: "de", label: "Deutsch" },
];

const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

const setCookie = (name: string, value: string) => {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`;
};

const LanguageSwitcher = ({
  title,
  description,
  label,
  saveLabel,
}: {
  title: string;
  description: string;
  label: string;
  saveLabel: string;
}) => {
  const [selected, setSelected] = useState("en");
  const currentLabel = useMemo(
    () => locales.find((locale) => locale.value === selected)?.label ?? "English",
    [selected]
  );

  useEffect(() => {
    const saved = getCookie("NEXT_LOCALE");
    if (saved) {
      setSelected(saved);
      return;
    }

    const browserLocale = navigator.language?.split("-")[0];
    if (browserLocale && locales.some((locale) => locale.value === browserLocale)) {
      setSelected(browserLocale);
    }
  }, []);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger>
              <SelectValue placeholder={currentLabel} />
            </SelectTrigger>
            <SelectContent>
              {locales.map((locale) => (
                <SelectItem key={locale.value} value={locale.value}>
                  {locale.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setCookie("NEXT_LOCALE", selected);
              window.location.reload();
            }}
          >
            {saveLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageSwitcher;
