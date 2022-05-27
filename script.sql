ALTER TABLE `Activities` DROP FOREIGN KEY `FK_Activities_ActivityJoinDetails_ActivityJoinDetailsId`;

ALTER TABLE `Activities` DROP INDEX `IX_Activities_ActivityJoinDetailsId`;

ALTER TABLE `ActivityJoinDetails` DROP COLUMN `ActivityUrl`;

ALTER TABLE `ActivityJoinDetails` DROP COLUMN `MeetingId`;

ALTER TABLE `ActivityJoinDetails` DROP COLUMN `MeetingPsw`;

ALTER TABLE `ActivityJoinDetails` DROP COLUMN `Zoom`;

ALTER TABLE `Activities` DROP COLUMN `ActivityJoinDetailsId`;

ALTER TABLE `Activities` DROP COLUMN `CallRoomId`;

ALTER TABLE `ActivityJoinDetails` ADD `ActivityId` char(36) NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000';

ALTER TABLE `ActivityJoinDetails` ADD `ChannelName` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `ActivityJoinDetails` ADD `HostUrl` longtext CHARACTER SET utf8mb4 NULL;

ALTER TABLE `ActivityJoinDetails` ADD `LastUpdateDate` datetime(6) NOT NULL DEFAULT '0001-01-01 00:00:00.000000';

ALTER TABLE `ActivityJoinDetails` ADD `ViewUrl` longtext CHARACTER SET utf8mb4 NULL;

CREATE UNIQUE INDEX `IX_ActivityJoinDetails_ActivityId` ON `ActivityJoinDetails` (`ActivityId`);

ALTER TABLE `ActivityJoinDetails` ADD CONSTRAINT `FK_ActivityJoinDetails_Activities_ActivityId` FOREIGN KEY (`ActivityId`) REFERENCES `Activities` (`Id`) ON DELETE CASCADE;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20220525143711_ActivityOnlineInfo', '3.1.3');

