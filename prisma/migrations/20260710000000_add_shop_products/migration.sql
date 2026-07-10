-- CreateTable
CREATE TABLE `ShopProduct` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `detail` TEXT NOT NULL,
    `description` TEXT NOT NULL,
    `weightKg` DECIMAL(8, 3) NOT NULL,
    `weightLabel` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `oldPrice` INTEGER NULL,
    `image` VARCHAR(191) NOT NULL,
    `galleryImages` JSON NULL,
    `color` VARCHAR(191) NOT NULL DEFAULT '#FFF0E8',
    `badge` VARCHAR(191) NULL,
    `rating` DECIMAL(3, 2) NOT NULL DEFAULT 4.80,
    `benefits` JSON NOT NULL,
    `ingredients` TEXT NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ShopProduct_slug_key`(`slug`),
    INDEX `ShopProduct_isActive_sortOrder_idx`(`isActive`, `sortOrder`),
    INDEX `ShopProduct_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
