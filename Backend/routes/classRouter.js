const classRouter = require('express').Router();
const classController = require('../controller/classController');
const isLoggedIn = require("../middlewares/authLogin");

classRouter.get('/classes',isLoggedIn, classController.getAllClasses);
