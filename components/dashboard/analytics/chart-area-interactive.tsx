"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { ChartData } from "@/app/lib/data/analytics.data";
import { useLocale, useTranslations } from "next-intl";

type ChartAreaInteractiveProps = {
  data: ChartData;
};

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("30d");
    }
  }, [isMobile]);

  const chartConfig = React.useMemo(
    () =>
      ({
        intakes: {
          label: t("analytics.chart.intakes"),
          color: "hsl(var(--chart-1))",
        },
        adoptions: {
          label: t("analytics.chart.adoptions"),
          color: "hsl(var(--chart-2))",
        },
      }) satisfies ChartConfig,
    [t]
  );

  // Filter the data on the client-side based on the selected time range.
  const filteredData = React.useMemo(() => {
    let daysToFilter = 90;
    if (timeRange === "30d") {
      daysToFilter = 30;
    } else if (timeRange === "7d") {
      daysToFilter = 7;
    }
    return data.slice(-daysToFilter); // Get the most recent 'n' days.
  }, [data, timeRange]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{t("analytics.chart.title")}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {t("analytics.chart.description")}
          </span>
          <span className="@[540px]/card:hidden">
            {t("analytics.chart.shortDescription")}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">
              {t("analytics.chart.range.90d")}
            </ToggleGroupItem>
            <ToggleGroupItem value="30d">
              {t("analytics.chart.range.30d")}
            </ToggleGroupItem>
            <ToggleGroupItem value="7d">
              {t("analytics.chart.range.7d")}
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label={t("analytics.chart.range.ariaLabel")}
            >
              <SelectValue placeholder={t("analytics.chart.range.90d")} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                {t("analytics.chart.range.90d")}
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                {t("analytics.chart.range.30d")}
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                {t("analytics.chart.range.7d")}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillIntakes" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-intakes)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-intakes)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillAdoptions" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-adoptions)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-adoptions)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString(locale, {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString(locale, {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="adoptions"
              type="natural"
              fill="url(#fillAdoptions)"
              stroke="var(--color-adoptions)"
              stackId="a"
            />
            <Area
              dataKey="intakes"
              type="natural"
              fill="url(#fillIntakes)"
              stroke="var(--color-intakes)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
