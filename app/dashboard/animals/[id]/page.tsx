import AnimalSectionCards from "@/components/pet-section-cards";
import ActivityFeed from "./ui/activity";
import { AnimalNavTabs } from "@/components/dashboard/animals/animal-nav-tabs";
import {
  AnimalByIDPayload,
  IDParamType,
  SearchParamsType,
} from "@/app/lib/types";
import { fetchAnimalById } from "@/app/lib/data/animals/animal.data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ActivityFeedItem from "./ui/ActivityFeedItem";

export enum PetActivityType {
  FIELD_UPDATE = "FIELD_UPDATE",
  NOTE_ADDED = "NOTE_ADDED",
  PHOTO_UPLOADED = "PHOTO_UPLOADED",
  MEDICAL_RECORD_ADDED = "MEDICAL_RECORD_ADDED",
  ASSESSMENT_COMPLETED = "ASSESSMENT_COMPLETED",
  TASK_CREATED = "TASK_CREATED",
  TASK_STATUS_CHANGED = "TASK_STATUS_CHANGED",
  STATUS_CHANGE = "STATUS_CHANGE",
  INTAKE_PROCESSED = "INTAKE_PROCESSED",
  OUTCOME_PROCESSED = "OUTCOME_PROCESSED",
  CREATED = "CREATED",
}

export interface Person {
  id: string;
  name: string;
  initials: string;
  avatarUrl?: string;
}

export interface PetActivityLog {
  id: string;
  activityType: PetActivityType;
  changedBy: Person;
  changeSummary?: string | null;
  changedAt: string; // e.g., "1 day ago", "2 weeks ago"
}

const activities: PetActivityLog[] = [
  {
    id: "1",
    activityType: PetActivityType.FIELD_UPDATE,
    changedBy: { id: "user1", name: "Jane Doe", initials: "JD" },
    changedAt: "1 day ago",
    changeSummary: `• Changed 'healthStatus' from "Awaiting Vet Exam" to "Healthy".
• Changed 'weightKg' from "5.2" to "6.1".
• Updated notes on leash reactivity.`,
  },
  {
    id: "2",
    activityType: PetActivityType.NOTE_ADDED,
    changedBy: { id: "user2", name: "John Smith", initials: "JS" },
    changedAt: "3 days ago",
  },
  {
    id: "3",
    activityType: PetActivityType.PHOTO_UPLOADED,
    changedBy: { id: "user1", name: "Jane Doe", initials: "JD" },
    changedAt: "3 days ago",
  },
  {
    id: "4",
    activityType: PetActivityType.INTAKE_PROCESSED,
    changedBy: { id: "user3", name: "Alan Turing", initials: "AT" },
    changedAt: "2 weeks ago",
  },
];

interface Props {
  params: IDParamType;
  searchParams: SearchParamsType;
}

const Page = async ({ params, searchParams }: Props) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm font-sans">
        <h1 className="text-2xl font-bold text-gray-900 pb-4 border-b border-gray-200">
          Activity
        </h1>
        <p className="mt-6 text-gray-500">No activity to display.</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>Activity feed for this animal.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((activity, index) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {index !== activities.length - 1 && (
                    <span
                      className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                  <ActivityFeedItem activity={activity} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default Page;

// import { PetSectionCards } from "@/components/pet-section-cards";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import ActivityFeed from "./ui/activity";
// import { PetCharacteristicsManager } from "./ui/characteristics";
// import PetNotes from "./ui/notes";
// import AssessmentForm from "./ui/assessmentDiaolog";
// import { SearchParamsType } from "@/app/lib/types";

// interface Props {
//   searchParams: SearchParamsType;
// }

// const Page = async ({ searchParams }: Props) => {

//   return (
//     <>
//       <PetSectionCards />

//       <Tabs defaultValue="activity">
//         <TabsList>
//           <TabsTrigger value="activity">Activity</TabsTrigger>
//           <TabsTrigger value="tasks">Tasks</TabsTrigger>
//           <TabsTrigger value="characteristics">Characteristics</TabsTrigger>
//           <TabsTrigger value="journey">Journey</TabsTrigger>
//           <TabsTrigger value="notes">Notes</TabsTrigger>
//           <TabsTrigger value="assessment">Assessment</TabsTrigger>
//           <TabsTrigger value="documents">Documents</TabsTrigger>
//         </TabsList>

//         <TabsContent value="activity">
//           <ActivityFeed />
//         </TabsContent>

//         <TabsContent value="tasks">
// <Card>
//   <CardHeader>
//     <CardTitle>Tasks</CardTitle>
//     <CardDescription>Tasks associated with this pet.</CardDescription>
//   </CardHeader>
//   <CardContent className="grid gap-6">
//     <div className="flex flex-1 flex-col">
//       <div className="@container/main flex flex-1 flex-col gap-2">
//         <div className="flex flex-col gap-4 md:gap-6">

//           tasks

//         </div>
//       </div>
//     </div>
//   </CardContent>
// </Card>
//         </TabsContent>

//         <TabsContent value="characteristics">
//           <PetCharacteristicsManager />
//         </TabsContent>

//         <TabsContent value="journey">
//           <Card>
//             <CardHeader>
//               <CardTitle>Journey</CardTitle>
//               <CardDescription>
//                 intake and outcome history for this pet. to be implemented
//               </CardDescription>
//               <CardAction>
//                 <Button variant="outline">New Intake</Button>
//               </CardAction>
//             </CardHeader>
//           </Card>
//         </TabsContent>

//         <TabsContent value="notes">
//           <PetNotes />
//         </TabsContent>

//         <TabsContent value="assessment">
//           <Card>
//             <CardHeader>
//               <CardTitle>Assessments</CardTitle>
//               <CardDescription>
//                 Assessments associated with this pet. to be implemented
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="grid gap-6">
//               <AssessmentForm />
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="documents">
//           <Card>
//             <CardHeader>
//               <CardTitle>Documents</CardTitle>
//               <CardDescription>
//                 Documents associated with this pet.
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="grid gap-6">to be implemented</CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </>
//   );
// };

// export default Page;
