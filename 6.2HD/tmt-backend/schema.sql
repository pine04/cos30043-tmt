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