/*
  Warnings:

  - You are about to drop the `EntryTaskLog` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[projectId,title]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."EntryTaskLog" DROP CONSTRAINT "EntryTaskLog_taskId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Project" DROP CONSTRAINT "Project_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_projectId_fkey";

-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "description" TEXT,
ADD COLUMN     "targetHours" DECIMAL(8,2),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Task" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "public"."EntryTaskLog";

-- CreateTable
CREATE TABLE "public"."Entry" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "entryDate" TIMESTAMP(3) NOT NULL,
    "hoursLogged" DECIMAL(6,2) NOT NULL,
    "title" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Entry_taskId_idx" ON "public"."Entry"("taskId");

-- CreateIndex
CREATE INDEX "Entry_entryDate_idx" ON "public"."Entry"("entryDate");

-- CreateIndex
CREATE INDEX "Project_userId_idx" ON "public"."Project"("userId");

-- CreateIndex
CREATE INDEX "Project_name_idx" ON "public"."Project"("name");

-- CreateIndex
CREATE INDEX "Task_projectId_idx" ON "public"."Task"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Task_projectId_title_key" ON "public"."Task"("projectId", "title");

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Entry" ADD CONSTRAINT "Entry_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "public"."Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
