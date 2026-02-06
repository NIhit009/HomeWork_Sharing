const express = require('express');
const homeworkController = require('../controller/homeworkController');
const homeRouter = express.Router();
const upload = require('../multer/multersetup');
require('dotenv').config();
const isLoggedIn = require('../middlewares/authLogin');


homeRouter.get('/', isLoggedIn, homeworkController.getHomeworkPage);
homeRouter.get('/checkLogin', isLoggedIn, homeworkController.checkLogin)
homeRouter.post('/addHomework', upload.single('file'), isLoggedIn, homeworkController.postHomeworkPage);
homeRouter.get('/downloadhomework/:id', isLoggedIn, homeworkController.getDownloadPage);
homeRouter.get("/displayhomework/:id", isLoggedIn, homeworkController.getDisplayPage);
homeRouter.get("/currentHomework", isLoggedIn, homeworkController.getCurrentPage);

module.exports = homeRouter;