-- DropForeignKey
ALTER TABLE "Music" DROP CONSTRAINT "Music_linkId_fkey";

-- DropForeignKey
ALTER TABLE "Show" DROP CONSTRAINT "Show_linkId_fkey";

-- AddForeignKey
ALTER TABLE "Show" ADD CONSTRAINT "Show_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Music" ADD CONSTRAINT "Music_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Music.linkId_unique" RENAME TO "Music_linkId_key";

-- RenameIndex
ALTER INDEX "Show.linkId_unique" RENAME TO "Show_linkId_key";

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";
