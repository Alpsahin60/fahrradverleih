-- CreateTable
CREATE TABLE `fahrraeder` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `hersteller` VARCHAR(191) NOT NULL,
    `status` ENUM('FREI', 'BELEGT') NOT NULL DEFAULT 'FREI',
    `zustand` VARCHAR(191) NOT NULL,
    `typ` VARCHAR(191) NOT NULL DEFAULT 'Standardbike',
    `istEBike` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ausleihen` (
    `id` VARCHAR(191) NOT NULL,
    `fahrradId` VARCHAR(191) NOT NULL,
    `datum` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `rueckgabeDatum` DATETIME(3) NULL,
    `status` ENUM('AKTIV', 'ZURUECKGEGEBEN') NOT NULL DEFAULT 'AKTIV',
    `name` VARCHAR(191) NOT NULL,
    `telefonnummer` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ausleihen` ADD CONSTRAINT `ausleihen_fahrradId_fkey` FOREIGN KEY (`fahrradId`) REFERENCES `fahrraeder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
