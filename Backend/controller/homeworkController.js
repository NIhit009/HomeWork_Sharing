const HomeworkApp = require('../models/homework');
const Homework = require('../models/homework');
const fs = require('fs');
require('dotenv').config();
const { check, validationResult } = require('express-validator');

exports.getHomeworkPage = (req, res, next) => {
    // Getting all the Homework from the database
    Homework.fetchAll().then((homework) => {
        return res.status(200).json({ homework, Access: true });
    }).catch((error) => {
        //Handling the error
        console.log("Could not fetch items", error);
        return res.sendStatus(500);
    })
}
exports.postHomeworkPage = [
    check('Name')
        .trim()
        .notEmpty()
        .withMessage("Module name cannot be empty!!")
        .matches(/[A-Za-z]+(?:\s[A-Za-z]+)+$/),
    check('Week')
        .trim()
        .notEmpty()
        .withMessage('Module Week cannot be empty')
        .isNumeric()
        .withMessage("Module Week should be a Number")
        .custom((value) => {
            if (value > 13) {
                throw new Error("Value Cannot be greater than 13!!");
            } return true
        }),
    check('SubmissionDate')
        .trim()
        .isDate()
        .withMessage("Submission Date should be a valid date!!")
        .custom((value) => {
            const valueDate = new Date(value);
            const valueYear = valueDate.getFullYear();
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            if (currentYear - valueYear != 0) {
                throw new Error("Date cannot be more than a Year!!");
            } return true
        }),
    check('SubmittedBy')
        .trim()
        .matches(/[A-Za-z0-9]+(?:\s[A-Za-z0-9]+)+$/)
        .withMessage("Please provide a proper name"),
    (req, res, next) => {
        // Getting the HomeworkInfo from req.body
        if (req.user.UserType === 'Teacher') {
            const { Name, Week, SubmissionDate, SubmittedBy } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Errors found", errors: errors.array() })
            }
            console.log(req.file);
            if (!req.file) {
                return res.status(404).json({ message: "File Required" });
            }
            //Creating file buffer
            const data = fs.readFileSync(req.file.path);
            // Creating a file object to be stored
            const fileObj = {
                data,
                contentType: req.file.mimetype,
                fileName: req.file.originalname
            }
            //End of file buffer
            const newHomework = new Homework(Name, Week, fileObj, SubmissionDate, SubmittedBy);
            // Saving the newHomework
            newHomework.save().then(() => {
                fs.unlinkSync(req.file.path); // Deleting the file from the uploads folder after being stored in the database
                console.log("Date saved successfully!!");
                return res.status(201).json({ Access: true, message: "Data saved successfully" });
            }).catch((error) => {
                console.log("Could not saved the data", error);
                return res.status(500).json({ Access: true, message: "Could not save data" });
            })
        }
        return res.status(400).json({message: "Only teacher can access this page!!!", userType: 'Student'})

    }]
exports.getDownloadPage = (req, res, next) => {
    // Getting the fileId through the url params
    const fileId = req.params.id;
    //Finding the file data through fileId
    Homework.getDataById(fileId).then((homework) => {
        const fileBuffer = homework.file.data.buffer;
        // Telling the browser about the Content-Disposition (tells the browser how to handle the file)
        // attachment --> Download
        // inline --> display
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${homework.file.fileName}"`
        )
        // Content-Type is self-explentory
        res.setHeader(
            'Content-Type',
            homework.file.contentType
        )
        // sending the file buffer
        return res.status(200).send(fileBuffer);
    }).catch((err) => {
        console.log("Error While fetching the file", err);
        return res.status(500).json({ message: "Error while fetching the file" });
    })

}
exports.getDisplayPage = (req, res, next) => {
    const fileId = req.params.id;
    Homework.getDataById(fileId).then((homework) => {
        const fileBuffer = homework.file.data.buffer;
        res.setHeader(
            'Content-Disposition',
            `inline; filename="${homework.file.fileName}"`
        )
        res.setHeader(
            'Content-Type',
            homework.file.contentType
        )
        return res.status(200).send(fileBuffer);
    }).catch((err) => {
        console.log("Error While fetching the file", err);
        return res.status(500).json({ message: "Error while fetching the file" });
    })

}

exports.getCurrentPage = async (req, res, next) => {
    try {
        const homeworks = await HomeworkApp.fetchAll();
        const currentHomework = homeworks.filter((homework) => {
            const submitDate = new Date(homework.SubmissionDate);
            const currentDate = new Date()
            const diffMiliSec = currentDate - submitDate
            const diffDay = Math.abs(Math.floor(diffMiliSec / (1000 * 60 * 60 * 24)))
            console.log(diffDay);
            if (diffDay < 7) {
                return homework
            }
        })
        console.log(currentHomework)
        if (currentHomework.length === 0) {
            return res.status(404).json({ message: "No Homework this week", Access: true });
        }
        return res.status(200).json({ currentHomework, Access: true });
    }
    catch (error) {
        return res.status(400).json({ message: "Error while getting Current Homework", Access: true });
    }

}
exports.checkLogin = (req, res, next) => {
    const user = req.user;
    console.log(user);
    res.status(200).json({ Access: true, userType: user.userType });
}