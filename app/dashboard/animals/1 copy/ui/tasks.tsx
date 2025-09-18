import { promises as fs } from "fs"
import path from "path"
import Image from "next/image"
import { z } from "zod"

import { columns } from "@/components/dashboard/tasks/components/task-table-columns"
import { DataTable } from "@/components/dashboard/tasks/components/task-data-table"
import { UserNav } from "@/components/dashboard/tasks/components/user-nav"
import { Task, taskSchema } from "@/components/dashboard/tasks/data/schema"
import data from "@/components/dashboard/tasks/data/tasks.json"

// Simulate a database read for tasks.x
// async function getTasks() {
//   const data = await fs.readFile(
//     path.join(process.cwd(), "/data/tasks.json")
//   )

//   const tasks = JSON.parse(data.toString())

//   return z.array(taskSchema).parse(tasks)
// }

export default async function PetTasks() {
  // const tasks = await getTasks()

  return (
    <>
      {/* <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        <DataTable data={data} columns={columns} />
        </div> */}
        <DataTable data={data} columns={columns} />
    </>
  )
}