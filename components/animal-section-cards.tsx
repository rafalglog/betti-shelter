import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AnimalSectionCardPayload, IDParamType } from "@/app/lib/types";
import { fetchSectionCardsAnimalData } from "@/app/lib/data/animals/animal.data";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimalListingStatus, Sex } from "@prisma/client";
import { calculateAgeString, formatTimeAgo } from "@/app/lib/utils/date-utils";
import {
  Calendar,
  MapPin,
  AlertCircle,
  Heart,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

interface Props {
  params: IDParamType;
}

const AnimalSectionCards = async ({ params }: Props) => {
  const t = await getTranslations("dashboard");
  const { id } = await params;

  const animal: AnimalSectionCardPayload | null =
    await fetchSectionCardsAnimalData(id);
  if (!animal) {
    notFound();
  }

  const daysSinceIntake = animal.intake?.[0]?.intakeDate
    ? formatTimeAgo(animal.intake[0].intakeDate)
    : null;

  const firstImage = animal.animalImages?.[0]?.url;
  const likesCount = animal._count.likes;
  const pendingTasksCount = animal._count.tasks;

  const applicationCount = animal.adoptionApplications?.length || 0;
  const approvedApplications =
    animal.adoptionApplications?.filter((a) => a.status === "APPROVED")
      .length || 0;

  // Health status info for rendering
  const getHealthStatusBadge = () => {
    if (!animal.healthStatus || animal.healthStatus === "HEALTHY") return null;

    const statusConfig = {
      AWAITING_VET_EXAM: { variant: "secondary", labelKey: "animals.healthStatusOptions.AWAITING_VET_EXAM" },
      AWAITING_TRIAGE: { variant: "secondary", labelKey: "animals.healthStatusOptions.AWAITING_TRIAGE" },
      UNDER_VET_CARE: { variant: "destructive", labelKey: "animals.healthStatusOptions.UNDER_VET_CARE" },
      HOSPITALISED: { variant: "destructive", labelKey: "animals.healthStatusOptions.HOSPITALISED" },
      AWAITING_SPAY_NEUTER: {
        variant: "secondary",
        labelKey: "animals.healthStatusOptions.AWAITING_SPAY_NEUTER",
      },
      AWAITING_OTHER_SURGERY: {
        variant: "secondary",
        labelKey: "animals.healthStatusOptions.AWAITING_OTHER_SURGERY",
      },
      RECOVERING_FROM_SURGERY: {
        variant: "secondary",
        labelKey: "animals.healthStatusOptions.RECOVERING_FROM_SURGERY",
      },
    };

    const config = statusConfig[animal.healthStatus];
    return config ? (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <span className="font-medium">{t(config.labelKey)}</span>
        </AlertDescription>
      </Alert>
    ) : null;
  };

  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2">
      {/* Primary Card - Animal Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="mb-1">{animal.name}</CardTitle>
              <CardDescription>
                {animal.breeds.map((breed) => breed.name).join(" • ")}
              </CardDescription>
              {animal.city && animal.state && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {animal.city}, {animal.state}
                  </span>
                </div>
              )}
            </div>
            <CardAction>
              <Badge variant="outline">
                {t(`animals.listingStatusOptions.${animal.listingStatus}`)}
              </Badge>
            </CardAction>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Image and Quick Stats Grid */}
          <div className="flex gap-4">
            <div className="relative flex h-28 w-28 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-secondary">
              {firstImage ? (
                <Image
                  src={firstImage}
                  alt={t("animals.sectionCards.photoAlt", { name: animal.name })}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              ) : (
                <span className="text-4xl">🐾</span>
              )}
            </div>

            <div className="flex-1 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-md p-2.5">
                <p className="text-xs text-muted-foreground mb-0.5">
                  {t("animals.sectionCards.species")}
                </p>
                <p className="font-semibold">{animal.species.name}</p>
              </div>
              <div className="rounded-md p-2.5">
                <p className="text-xs text-muted-foreground mb-0.5">
                  {t("animals.sectionCards.age")}
                </p>
                <p className="font-semibold">
                  {calculateAgeString({ birthDate: animal.birthDate })}
                </p>
              </div>
              <div className="rounded-md p-2.5">
                <p className="text-xs text-muted-foreground mb-0.5">
                  {t("animals.sectionCards.sex")}
                </p>
                <p className="font-semibold">
                  {t(`animals.sexOptions.${animal.sex}`)}
                </p>
              </div>
              <div className="rounded-md p-2.5">
                <p className="text-xs text-muted-foreground mb-0.5">
                  {t("animals.sectionCards.size")}
                </p>
                <p className="font-semibold">
                  {t(`animals.sizeOptions.${animal.size}`)}
                </p>
              </div>
            </div>
          </div>

          {/* Health Status Alert */}
          {getHealthStatusBadge()}

          {/* Quick Stats Row */}
          <div className="flex items-center gap-4 border-t pt-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="font-medium">{likesCount}</span>
              <span className="text-muted-foreground">
                {t("animals.sectionCards.likesLabel", { count: likesCount })}
              </span>
            </div>
            {daysSinceIntake && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-muted-foreground">
                  {t("animals.sectionCards.inCare", {
                    duration: daysSinceIntake,
                  })}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-green-600">
                {applicationCount}
              </span>
              <span className="text-muted-foreground">
                {t("animals.sectionCards.applicationsLabel", {
                  count: applicationCount,
                })}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Button asChild className="w-full">
            <Link
              href={
                animal.listingStatus !== AnimalListingStatus.ARCHIVED
                  ? `/dashboard/outcomes/create?animalId=${animal.id}`
                  : `/dashboard/animals/${animal.id}/intake/create`
              }
            >
              {approvedApplications > 0
                ? t("animals.sectionCards.completeAdoption")
                : animal.listingStatus === AnimalListingStatus.ARCHIVED
                ? t("animals.sectionCards.createIntake")
                : t("animals.sectionCards.createOutcome")}
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Secondary Card - Detailed Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t("animals.sectionCards.detailsTitle")}</CardTitle>
          <CardDescription>
            {t("animals.sectionCards.detailsDescription")}
          </CardDescription>
          <CardAction>
            <Button asChild size="sm">
              <Link href={`/dashboard/animals/${animal.id}/edit`}>
                {t("animals.sectionCards.editProfile")}
              </Link>
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Medical Information */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              {t("animals.sectionCards.medicalTitle")}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b pb-2 text-sm">
                <span className="text-muted-foreground">
                  {t("animals.sectionCards.spayedNeutered")}
                </span>
                <span className="font-medium">
                  {animal.sex !== Sex.UNKNOWN ? (
                    animal.isSpayedNeutered ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="h-4 w-4" /> {t("common.yes")}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        {t("common.no")}
                      </span>
                    )
                  ) : (
                    <span className="text-muted-foreground">
                      {t("common.na")}
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between border-b pb-2 text-sm">
                <span className="text-muted-foreground">
                  {t("animals.sectionCards.healthStatus")}
                </span>
                <span className="font-medium capitalize">
                  {animal.healthStatus
                    ? t(`animals.healthStatusOptions.${animal.healthStatus}`)
                    : t("animals.healthStatusOptions.HEALTHY")}
                </span>
              </div>
              <div className="flex items-center justify-between border-b pb-2 text-sm">
                <span className="text-muted-foreground">
                  {t("animals.sectionCards.legalStatus")}
                </span>
                <span className="font-medium">
                  {animal.legalStatus
                    ? t(`animals.legalStatusOptions.${animal.legalStatus}`)
                    : t("animals.legalStatusOptions.NONE")}
                </span>
              </div>
            </div>
          </div>

          {/* Identification */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              {t("animals.sectionCards.identificationTitle")}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b pb-2 text-sm">
                <span className="text-muted-foreground">
                  {t("animals.sectionCards.microchip")}
                </span>
                <span className="font-mono text-xs font-medium">
                  {animal.microchipNumber || t("animals.sectionCards.noMicrochip")}
                </span>
              </div>
              <div className="flex items-center justify-between border-b pb-2 text-sm">
                <span className="text-muted-foreground">
                  {t("animals.sectionCards.primaryColor")}
                </span>
                <span className="font-medium">
                  {animal.colors[0]?.name || t("common.na")}
                </span>
              </div>
            </div>
          </div>

          {/* Pending Tasks Alert */}
          {pendingTasksCount > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <span className="font-medium">
                  {t("animals.sectionCards.pendingTasks", {
                    count: pendingTasksCount,
                  })}
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("animals.sectionCards.pendingTasksHint")}
                </p>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimalSectionCards;
