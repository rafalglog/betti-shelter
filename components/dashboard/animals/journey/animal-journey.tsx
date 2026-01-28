import { fetchAnimalJourney } from "@/app/lib/data/animals/animal-journey.data";
import { formatJourneyItem } from "@/app/lib/journey-utils";
import { Briefcase, HeartHandshake, LogIn } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

// The icon map
const iconMap = {
  CREATED: <LogIn className="h-5 w-5 text-gray-500" />,
  INTAKE_PROCESSED: <LogIn className="h-5 w-5 text-gray-500" />,
  STATUS_CHANGE: <Briefcase className="h-5 w-5 text-gray-500" />,
  OUTCOME_PROCESSED: <HeartHandshake className="h-5 w-5 text-gray-500" />,
};

const getIcon = (activityType: string) => {
  return (
    iconMap[activityType as keyof typeof iconMap] || (
      <Briefcase className="h-5 w-5 text-gray-500" />
    )
  );
};

const AnimalJourney = async ({ animalId }: { animalId: string }) => {
  const t = await getTranslations("dashboard");
  const locale = await getLocale();
  const journeyData = await fetchAnimalJourney(animalId);

  const visibleJourneyItems = journeyData
    .map(formatJourneyItem)
    .filter(Boolean);

  // If no significant events are found
  if (visibleJourneyItems.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <p className="font-semibold text-lg">{t("journey.emptyTitle")}</p>
        <p className="text-sm mt-1 text-muted-foreground">
          {t("journey.emptyDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {journeyData.map((item, index) => {
          const formattedItem = formatJourneyItem(item);
          if (!formattedItem) {
            return null;
          }

          return (
            <li key={item.id}>
              <div className="relative pb-8">
                {index !== journeyData.length - 1 ? (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                      {getIcon(item.activityType)}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {formattedItem.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formattedItem.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {t("journey.by", { name: item.changedBy.name })}
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-xs text-gray-500">
                      <time dateTime={item.changedAt.toISOString()}>
                        {new Date(item.changedAt).toLocaleDateString(locale, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AnimalJourney;
