-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `businessName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KpiSubmission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `periodLabel` VARCHAR(191) NOT NULL,
    `revenue` DOUBLE NOT NULL,
    `previousRevenue` DOUBLE NOT NULL,
    `netIncome` DOUBLE NOT NULL,
    `totalExpenses` DOUBLE NOT NULL,
    `currentAssets` DOUBLE NOT NULL,
    `currentLiabilities` DOUBLE NOT NULL,
    `totalAssets` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `KpiSubmission_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BhsRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `submissionId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `bhs` DOUBLE NOT NULL,
    `riskLevel` ENUM('Low', 'Moderate', 'High', 'Critical') NOT NULL,
    `performanceBand` VARCHAR(191) NOT NULL,
    `profitMarginScore` DOUBLE NOT NULL,
    `currentRatioScore` DOUBLE NOT NULL,
    `roaScore` DOUBLE NOT NULL,
    `expenseRatioScore` DOUBLE NOT NULL,
    `revenueGrowthScore` DOUBLE NOT NULL,
    `breakdown` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `BhsRecord_submissionId_key`(`submissionId`),
    INDEX `BhsRecord_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `KpiSubmission` ADD CONSTRAINT `KpiSubmission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BhsRecord` ADD CONSTRAINT `BhsRecord_submissionId_fkey` FOREIGN KEY (`submissionId`) REFERENCES `KpiSubmission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BhsRecord` ADD CONSTRAINT `BhsRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
