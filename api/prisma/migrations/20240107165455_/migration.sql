/*
  Warnings:

  - Made the column `quantity` on table `order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalAmount` on table `order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `quantity` INTEGER NOT NULL,
    MODIFY `price` INTEGER NOT NULL,
    MODIFY `totalAmount` INTEGER NOT NULL;
