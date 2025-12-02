/*
  Warnings:

  - Added the required column `clubId` to the `facilities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "facilities" ADD COLUMN     "clubId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
