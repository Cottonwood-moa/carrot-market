
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'c58d9e61-a41e-4bed-d579-fd8bc65f1500',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_phone_key` (`phone`),
  UNIQUE KEY `User_email_key` (`email`)
);

CREATE TABLE `Answer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `userId` int NOT NULL,
  `postId` int NOT NULL,
  `answer` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `Chat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `buyerId` int NOT NULL,
  `productId` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `ChatMessage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `message` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` int NOT NULL,
  `chatId` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `Fav` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `userId` int NOT NULL,
  `productId` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `Post` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `question` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `Product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `userId` int NOT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int NOT NULL,
  `description` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `Purchase` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `userId` int NOT NULL,
  `productId` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `Review` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `review` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdById` int NOT NULL,
  `createdForId` int NOT NULL,
  `score` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
);

CREATE TABLE `Sale` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),  
  `updatedAt` datetime(3) NOT NULL,
  `userId` int NOT NULL,
  `productId` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `Token` (
  `id` int NOT NULL AUTO_INCREMENT,
  `payload` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Token_payload_key` (`payload`)
);

CREATE TABLE `Wondering` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `userId` int NOT NULL,
  `postId` int NOT NULL,
  PRIMARY KEY (`id`)
);

ALTER TABLE `Answer` ADD FOREIGN KEY (`userId`) REFERENCES `User` (`id`);
ALTER TABLE `Chat` ADD FOREIGN KEY (`buyerId`) REFERENCES `User` (`id`);
ALTER TABLE `Chat` ADD FOREIGN KEY (`productId`) REFERENCES `Product` (`id`);
ALTER TABLE `ChatMessage` ADD FOREIGN KEY (`userId`) REFERENCES `User` (`id`);
ALTER TABLE `ChatMessage` ADD FOREIGN KEY (`chatId`) REFERENCES `Chat` (`id`);
ALTER TABLE `Fav` ADD FOREIGN KEY (`userId`) REFERENCES `User` (`id`);
ALTER TABLE `Fav` ADD FOREIGN KEY (`productId`) REFERENCES `Product` (`id`);
ALTER TABLE `Post` ADD FOREIGN KEY (`userId`) REFERENCES `User` (`id`);
ALTER TABLE `Product` ADD FOREIGN KEY (`userId`) REFERENCES `User` (`id`);
ALTER TABLE `Purchase` ADD FOREIGN KEY (`userId`) REFERENCES `User` (`id`);
ALTER TABLE `Purchase` ADD FOREIGN KEY (`productId`) REFERENCES `Product` (`id`);
ALTER TABLE `Review` ADD FOREIGN KEY (`createdById`) REFERENCES `User` (`id`);
ALTER TABLE `Review` ADD FOREIGN KEY (`createdForId`) REFERENCES `User` (`id`);
ALTER TABLE `Sale` ADD FOREIGN KEY (`userId`) REFERENCES `User` (`id`);
ALTER TABLE `Sale` ADD FOREIGN KEY (`productId`) REFERENCES `Product` (`id`);
ALTER TABLE `Token` ADD FOREIGN KEY (`userId`) REFERENCES `User` (`id`);
ALTER TABLE `Wondering` ADD FOREIGN KEY (`userId`) REFERENCES `User` (`id`);
ALTER TABLE `Wondering` ADD FOREIGN KEY (`postId`) REFERENCES `User` (`id`);