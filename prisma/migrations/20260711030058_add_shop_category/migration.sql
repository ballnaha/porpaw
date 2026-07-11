/*
  Warnings:

  - You are about to drop the column `category` on the `shopproduct` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `ShopProduct_category_idx` ON `shopproduct`;

-- AlterTable
ALTER TABLE `shopproduct` DROP COLUMN `category`,
    ADD COLUMN `categoryId` VARCHAR(191) NULL,
    ADD COLUMN `categoryTag` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE `ShopCategory` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ShopCategory_slug_key`(`slug`),
    UNIQUE INDEX `ShopCategory_name_key`(`name`),
    INDEX `ShopCategory_isActive_sortOrder_idx`(`isActive`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `ShopProduct_categoryId_idx` ON `ShopProduct`(`categoryId`);

-- CreateIndex
CREATE INDEX `ShopProduct_categoryTag_idx` ON `ShopProduct`(`categoryTag`);

-- AddForeignKey
ALTER TABLE `ShopProduct` ADD CONSTRAINT `ShopProduct_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `ShopCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
