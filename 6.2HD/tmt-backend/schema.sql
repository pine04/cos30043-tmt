CREATE DATABASE IF NOT EXISTS `tmt`;

USE `tmt`;

CREATE TABLE IF NOT EXISTS `User` (
    `UserID` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `Username` VARCHAR(30) NOT NULL,
    `Email` VARCHAR(100) NOT NULL,
    `Password` VARCHAR(60) NOT NULL,
    `DisplayName` VARCHAR(50) NOT NULL,
    `Gender` ENUM("Male", "Female", "Non-binary", "Undisclosed") NOT NULL,
    `Birthdate` DATE NOT NULL,
    `Location` VARCHAR(100),
    `RelationshipStatus` ENUM("Single", "Dating", "Engaged", "Married", "Undisclosed"),
    `ProfilePicture` VARCHAR(100),
    `Bio` VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS `Post` (
    `PostID` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `UserID` INT NOT NULL,
    `TimePosted` DATETIME NOT NULL,
    `TextContent` VARCHAR(255) NOT NULL,

    FOREIGN KEY (`UserID`) REFERENCES `User` (`UserID`)
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `PostMedia` (
    `PostID` INT NOT NULL,
    `MediaName` CHAR(41) NOT NULL,
    `Order` INT NOT NULL,

    FOREIGN KEY (`PostID`) REFERENCES `Post` (`PostID`)
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `PostReaction` (
    `PostID` INT NOT NULL,
    `ReactorID` INT NOT NULL,
    `Reaction` ENUM("Like", "Dislike") NOT NULL,

    PRIMARY KEY (`PostID`, `ReactorID`),

    FOREIGN KEY (`PostID`) REFERENCES `Post` (`PostID`)
        ON UPDATE CASCADE,

    FOREIGN KEY (`ReactorID`) REFERENCES `User` (`UserID`)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `Friendship` (
    `UserA` INT NOT NULL,
    `UserB` INT NOT NULL,
    `Status` ENUM("Pending", "Accepted") NOT NULL,

    PRIMARY KEY (`UserA`, `UserB`),

    FOREIGN KEY (`UserA`) REFERENCES `User` (`UserID`)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    FOREIGN KEY (`UserB`) REFERENCES `User` (`UserID`)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

INSERT INTO `PostReaction` (`PostID`, `ReactorID`, `Reaction`)
	VALUES (7, (SELECT `UserID` AS `ReactorID` FROM `User` WHERE `Username` = "pine2"), "Dislike")
    ON DUPLICATE KEY UPDATE `Reaction` = "Dislike";
    
SELECT `Reaction` FROM `PostReaction` WHERE `PostID` = 7 AND `ReactorID` = (SELECT `UserID` FROM `User` WHERE `Username` = "pine2");
    
DELETE FROM `PostReaction` WHERE `PostID` = 4 AND `ReactorID` = (SELECT `UserID` FROM `User` WHERE `Username` = "pine3");


-- Find friends of user with Username

SELECT * FROM `User`
JOIN `Friendship` ON `User`.`UserID` = `Friendship`.`UserA` OR `User`.`UserID` = `Friendship`.`UserB`
WHERE `Username` != ? AND `Status` = "Accepted" AND (`UserA` = (SELECT `UserID` FROM `User` WHERE `Username` = ?) OR `UserB` = (SELECT `UserID` FROM `User` WHERE `Username` = ?))
LIMIT ?, 20;


-- UserA sends friend request to UserB

INSERT INTO `Friendship` VALUES (?, ?, "Pending");

-- UserB accepts friend request of UserA

UPDATE `Friendship` SET `Status` = "Accepted" WHERE `UserA` = ? AND `UserB` = ?;

-- UserB declines friend request of or unfriends UserA

DELETE FROM `Friendship` WHERE `UserA` = ? AND `UserB` = ?;

-- Gets list of users and their friendship status with UserA (with Username)

-- one more query to get userID
SELECT * FROM `User`
LEFT JOIN (SELECT * FROM `Friendship` WHERE `UserA` = ? OR `UserB` = ?) AS `UserARelationships`
ON (`User`.`UserID` = `UserARelationships`.`UserA` OR `User`.`UserID` = `UserARelationships`.`UserB`)
WHERE `UserID` != ?;

SELECT *, COUNT(DISTINCT ReactorID) AS Reactors FROM `Post`
JOIN `User` ON `Post`.`UserID` = `User`.`UserID`
LEFT JOIN `PostMedia` ON `Post`.`PostID` = `PostMedia`.`PostID`
LEFT JOIN `PostReaction` ON `Post`.`PostID` = `PostReaction`.`PostID`
WHERE `Post`.`PostID` = 4
GROUP BY `ReactorID`; -- consider separating them into different queries :)

SELECT COUNT(`ReactorID`) AS `ReactionCount`, `Reaction` FROM `PostReaction` WHERE `PostID` = 4 GROUP BY `Reaction`;


-- Gets one user (usernameA) and their friendship status with UserB (usernameB).
-- one more query to get userID
SELECT * FROM `User`
LEFT JOIN (SELECT * FROM `Friendship` WHERE `UserA` = ? OR `UserB` = ?) AS `UserARelationships`
ON (`User`.`UserID` = `UserARelationships`.`UserA` OR `User`.`UserID` = `UserARelationships`.`UserB`)
WHERE `Username` = ?;

SELECT * FROM `Post`
JOIN `Friendship` ON `Post`.`UserID` = `Friendship`.`UserA` OR `Post`.`UserID` = `Friendship`.`UserB`
WHERE `UserA` = (SELECT `UserID` FROM `User` WHERE `Username` = ?) OR `UserB` = (SELECT `UserID` FROM `User` WHERE `Username` = ?) AND `Status` = "Accepted";

UPDATE `Post` SET `TextContent` = ? WHERE `PostID` = ?;

DELETE FROM `Post` WHERE `PostID` = ?;

SELECT `UserID`, `Username`, `DisplayName`, `Gender`, `Birthdate`, `Location`, `RelationshipStatus`, `ProfilePicture`, `Bio` FROM `User`
JOIN `Friendship` ON `User`.`UserID` = `Friendship`.`UserA`
WHERE `UserB` = (SELECT `UserID` FROM `User` WHERE `Username` = ?) AND `Status` = "Pending";

SELECT `UserID`, `Username`, `DisplayName`, `Gender`, `Birthdate`, `Location`, `RelationshipStatus`, `ProfilePicture`, `Bio` FROM `User`
JOIN `Friendship` ON `User`.`UserID` = `Friendship`.`UserB`
WHERE `UserA` = (SELECT `UserID` FROM `User` WHERE `Username` = ?) AND `Status` = "Pending";