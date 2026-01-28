import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchPetCardData } from "@/app/lib/data/analytics.data";
import { getTranslations } from "next-intl/server";

// Helper function to format percentage
const formatPercentage = (value: number) => {
  const abs = Math.abs(value);
  return `${value >= 0 ? "+" : "-"}${abs.toFixed(1)}%`;
};

// Helper function to get trend message
const getTrendMessage = (
  t: (key: string, values?: Record<string, unknown>) => string,
  change: number,
  context: string
) => {
  const isPositive = change >= 0;

  if (Math.abs(change) < 5) {
    return t("analytics.trends.stable", { context });
  }

  if (isPositive) {
    return t("analytics.trends.up", { context });
  }

  return t("analytics.trends.down", {
    percentage: Math.abs(change).toFixed(1),
    context,
  });
};

// Helper function to get footer description
const getFooterDescription = (
  t: (key: string, values?: Record<string, unknown>) => string,
  cardType: string,
  change: number
) => {
  const descriptions = {
    totalAnimals: {
      positive: t("analytics.footer.totalAnimals.positive"),
      negative: t("analytics.footer.totalAnimals.negative"),
      stable: t("analytics.footer.totalAnimals.stable"),
    },
    adopted: {
      positive: t("analytics.footer.adopted.positive"),
      negative: t("analytics.footer.adopted.negative"),
      stable: t("analytics.footer.adopted.stable"),
    },
    published: {
      positive: t("analytics.footer.published.positive"),
      negative: t("analytics.footer.published.negative"),
      stable: t("analytics.footer.published.stable"),
    },
    tasks: {
      positive: t("analytics.footer.tasks.positive"),
      negative: t("analytics.footer.tasks.negative"),
      stable: t("analytics.footer.tasks.stable"),
    },
  };

  const category = descriptions[cardType as keyof typeof descriptions];
  if (!category) return t("analytics.footer.default");

  if (Math.abs(change) < 5) return category.stable;
  return change >= 0 ? category.positive : category.negative;
};

export async function SectionCards() {
  const t = await getTranslations("dashboard");
  const data = await fetchPetCardData();
  const {
    totalPets,
    adoptedPetsCount,
    publishedPetsCount,
    todoTasksCount,
    trends,
  } = data;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t("analytics.cards.totalAnimals")}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalPets}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {trends.totalPetsChange >= 0 ? (
                <IconTrendingUp />
              ) : (
                <IconTrendingDown />
              )}
              {formatPercentage(trends.totalPetsChange)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {getTrendMessage(
              t,
              trends.totalPetsChange,
              t("analytics.trends.context.thisMonth")
            )}
            {trends.totalPetsChange >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            {getFooterDescription(t, "totalAnimals", trends.totalPetsChange)}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t("analytics.cards.adoptedAnimals")}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {adoptedPetsCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {trends.adoptedPetsChange >= 0 ? (
                <IconTrendingUp />
              ) : (
                <IconTrendingDown />
              )}
              {formatPercentage(trends.adoptedPetsChange)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {getTrendMessage(
              t,
              trends.adoptedPetsChange,
              t("analytics.trends.context.thisPeriod")
            )}
            {trends.adoptedPetsChange >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            {getFooterDescription(t, "adopted", trends.adoptedPetsChange)}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t("analytics.cards.publishedAnimals")}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {publishedPetsCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {trends.publishedPetsChange >= 0 ? (
                <IconTrendingUp />
              ) : (
                <IconTrendingDown />
              )}
              {formatPercentage(trends.publishedPetsChange)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {getTrendMessage(
              t,
              trends.publishedPetsChange,
              t("analytics.trends.context.thisMonth")
            )}
            {trends.publishedPetsChange >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            {getFooterDescription(t, "published", trends.publishedPetsChange)}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>{t("analytics.cards.todoTasks")}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {todoTasksCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {trends.todoTasksChange >= 0 ? (
                <IconTrendingUp />
              ) : (
                <IconTrendingDown />
              )}
              {formatPercentage(trends.todoTasksChange)}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {getTrendMessage(
              t,
              trends.todoTasksChange,
              t("analytics.trends.context.comparedToLastMonth")
            )}
            {trends.todoTasksChange >= 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            {getFooterDescription(t, "tasks", trends.todoTasksChange)}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
