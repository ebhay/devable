/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[googleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "profilePic" TEXT NOT NULL DEFAULT 'https://github.com/shadcn.png',
ALTER COLUMN "password" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "profilePic" TEXT NOT NULL DEFAULT 'https://github.com/evilrabbit.png',
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_googleId_key" ON "Admin"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
