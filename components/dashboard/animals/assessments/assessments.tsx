"use client";

import React from "react";
import { MoreHorizontal, Edit, Trash2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AssessmentPayload } from "@/app/lib/data/animals/animal-assessment.data";
import { AssessmentOutcome } from "@prisma/client";
import { formatDateToLongString } from "@/app/lib/utils/date-utils";
import { formatSingleEnumOption } from "@/app/lib/utils/enum-formatter";
import Link from "next/link";

// --- MOCK DATA ---
// In a real app, this would come from your API (e.g., `trpc.animal.getAssessments.useQuery()`)
// const mockAssessments = [
//   {
//     id: "asmt_1",
//     type: "INTAKE_BEHAVIORAL",
//     date: "2025-07-10T14:00:00.000Z",
//     assessor: { name: "Dr. Jane Doe" },
//     overallOutcome: "GOOD",
//     summary:
//       "Fido is a friendly and energetic dog. He showed no signs of aggression and was curious about his new environment. He pulls a bit on the leash but is responsive to commands.",
//     fields: [
//       {
//         id: "f1",
//         fieldName: "Reaction to Handling",
//         fieldValue: "Tolerant",
//         notes: "Allowed petting all over, including paws and ears.",
//       },
//       {
//         id: "f2",
//         fieldName: "Food Guarding",
//         fieldValue: "None Observed",
//         notes: null,
//       },
//       {
//         id: "f3",
//         fieldName: "Leash Manners",
//         fieldValue: "Pulls Heavily",
//         notes: "Responds to corrections but gets easily excited.",
//       },
//       {
//         id: "f4",
//         fieldName: "Toy Aggression",
//         fieldValue: "None Observed",
//         notes: "Happily shared a ball.",
//       },
//     ],
//     deletedAt: null,
//   },
//   {
//     id: "asmt_2",
//     type: "DAILY_MONITORING",
//     date: "2025-07-11T09:30:00.000Z",
//     assessor: { name: "John Smith" },
//     overallOutcome: "NEEDS_ATTENTION",
//     summary:
//       "Noticed some slight limping on the rear left leg this morning. Seems hesitant to put full weight on it. Otherwise, normal appetite and mood.",
//     fields: [
//       {
//         id: "f5",
//         fieldName: "Appetite",
//         fieldValue: "Normal",
//         notes: "Ate all of his breakfast.",
//       },
//       {
//         id: "f6",
//         fieldName: "Mobility",
//         fieldValue: "Limping (Rear Left)",
//         notes: "Should be checked by a vet.",
//       },
//       {
//         id: "f7",
//         fieldName: "Kennel Condition",
//         fieldValue: "Clean",
//         notes: null,
//       },
//     ],
//     deletedAt: null,
//   },
//   {
//     id: "asmt_3",
//     type: "INTAKE_MEDICAL",
//     date: "2025-07-09T11:00:00.000Z",
//     assessor: { name: "Dr. Evelyn Reed" },
//     overallOutcome: "POOR",
//     summary:
//       "Animal is underweight and has a moderate skin infection on its back. Also has a grade 2/6 heart murmur. Requires immediate vet care.",
//     fields: [
//       {
//         id: "f8",
//         fieldName: "Body Condition Score",
//         fieldValue: "2/9 (Underweight)",
//         notes: "Ribs and spine prominent.",
//       },
//       {
//         id: "f9",
//         fieldName: "Dermatology",
//         fieldValue: "Moderate pyoderma",
//         notes: "Located on the dorsal lumbar region.",
//       },
//       {
//         id: "f10",
//         fieldName: "Cardiology",
//         fieldValue: "Grade 2/6 Systolic Murmur",
//         notes: "Best heard on the left side.",
//       },
//     ],
//     deletedAt: null,
//   },
// ];

const getOutcomeBadgeVariant = (outcome: AssessmentOutcome) => {
  switch (outcome) {
    case AssessmentOutcome.EXCELLENT:
    case AssessmentOutcome.GOOD:
      return "default"; // Green in default theme
    case AssessmentOutcome.NEEDS_ATTENTION:
    case AssessmentOutcome.FAIR:
      return "secondary"; // Yellow-ish in default theme
    case AssessmentOutcome.POOR:
      return "destructive";
    default:
      return "outline";
  }
};

interface Props {
  animalAssessments: AssessmentPayload[];
  animalId: string;
}

// --- THE MAIN COMPONENT ---
const AnimalAssessmentsTab = ({ animalAssessments, animalId }: Props) => {
  const handleEdit = (assessmentId: string) => {
    console.log(`Opening modal to edit assessment: ${assessmentId}`);
    // Open a Dialog/Modal with the form pre-filled with this assessment's data
  };

  const handleSoftDelete = (assessmentId: string) => {
    console.log(`Soft deleting assessment: ${assessmentId}`);
    // This would trigger a mutation:
    // softDeleteAssessment.mutate({ assessmentId });
    // This would update the `deletedAt` field in the database.
    alert(`In a real app, this would soft delete assessment ${assessmentId}.`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Animal Assessments</CardTitle>
        <CardDescription>
          A log of all behavioral and medical evaluations.
        </CardDescription>
        <CardAction>
          <Button asChild>
              <Link href={`/dashboard/animals/${animalId}/assessments/create`}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create First Assessment
              </Link>
            </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {animalAssessments && animalAssessments.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {animalAssessments.map((assessment) => (
              <AccordionItem value={assessment.id} key={assessment.id}>
                <div className="flex w-full items-center justify-between">
                  <AccordionTrigger className="flex-1 text-left hover:no-underline">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-semibold text-primary">
                        {formatSingleEnumOption(assessment.type)}
                      </span>
                      <span className="text-muted-foreground text-sm whitespace-nowrap">
                        on {formatDateToLongString(assessment.date)}
                      </span>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        by {assessment.assessor.name}
                      </span>
                      {assessment.overallOutcome && (
                        <Badge
                          variant={getOutcomeBadgeVariant(
                            assessment.overallOutcome
                          )}
                        >
                          {formatSingleEnumOption(assessment.overallOutcome)}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>

                  <div className="pl-2 mt-2 self-start">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0"
                        >
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => handleEdit(assessment.id)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => handleSoftDelete(assessment.id)}
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    {assessment.summary && (
                      <div>
                        <h4 className="font-semibold">Overall Summary</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {assessment.summary}
                        </p>
                      </div>
                    )}

                    <Separator />

                    <div>
                      <h4 className="font-semibold">Detailed Findings</h4>
                      <ul className="mt-2 space-y-2">
                        {assessment.fields.map((field) => (
                          <li
                            key={field.id}
                            className="grid grid-cols-3 gap-4 text-sm"
                          >
                            <span className="col-span-1 text-muted-foreground">
                              {field.fieldName}:
                            </span>
                            <div className="col-span-2">
                              <p className="font-medium text-foreground">
                                {field.fieldValue}
                              </p>
                              {field.notes && (
                                <p className="text-xs text-muted-foreground mt-1 italic">
                                  Note: {field.notes}
                                </p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">
              No assessments have been recorded for this animal yet.
            </p>
            <Button asChild className="mt-2">
              <Link href={`/dashboard/animals/${animalId}/assessments/create`}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create First Assessment
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnimalAssessmentsTab;
