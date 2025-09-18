import { AppSidebar } from "@/components/app-sidebar";
import { DataTable } from "@/components/dashboard/data-table";
import { AnimalSectionCards } from "@/components/pet-section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import data from "./data/data.json";
import activityData from "./data/activity.json";
import { Activity } from "./types";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ActivityFeed from "./ui/activity";
import { PetCharacteristicsManager } from "./ui/characteristics";
import PetNotes from "./ui/notes";
import PetTasks from "./ui/tasks";
import AssessmentForm from "./ui/assessmentDiaolog";

export default function Page() {
  const typedActivityData = activityData as Activity[];

  return (
    <>
      <AnimalSectionCards />

      <Tabs defaultValue="activity">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="characteristics">Characteristics</TabsTrigger>
          <TabsTrigger value="journey">Journey</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          {/* <Card>
                    <CardHeader>
                      <CardTitle>Activity</CardTitle>
                      <CardDescription>
                        Make changes to your account here. Click save when
                        you&apos;re done.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                      <ActivityFeed data={typedActivityData} />
                      </CardContent>
                      </Card> */}
          <ActivityFeed />
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>Tasks associated with this pet.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                  <div className="flex flex-col gap-4 md:gap-6">
                    <PetTasks />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="characteristics">
          <PetCharacteristicsManager />
        </TabsContent>

        <TabsContent value="journey">
          <Card>
            <CardHeader>
              <CardTitle>Journey</CardTitle>
              <CardDescription>
                intake and outcome history for this pet.
              </CardDescription>
              <CardAction>
                <Button variant="outline">New Intake</Button>
              </CardAction>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <PetNotes />
        </TabsContent>

        <TabsContent value="assessment">
          <Card>
            <CardHeader>
              <CardTitle>Assessments</CardTitle>
              <CardDescription>
                Assessments associated with this pet.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <AssessmentForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                Documents associated with this pet.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6"></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
