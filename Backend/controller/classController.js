const Class = require('../models/class');
exports.getAllClasses = async (req, res, next) => {
    try {
        const classes = await Class.getAllClasses();
        if (!classes) {
            return res.status(404).json({ message: "Classes not found" })
        }
        return res.status(200).json({ message: "Got all the classes", classes });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Error while getting classes" })
    }
}

exports.postClass = async (req, res, next) => {
    const { author, className, classCode, createdAt } = req.body;
    const newClass = new Class(author, className, classCode, createdAt);
    try {
        if (await Class.getClassByClassName(newClass.className)){
            return res.status(404).json({message: "This class has already been created!!"});
        }
        await newClass.save();
    }
    catch(error){
        console.log("Error Occurred", error);
        return res.status(500).json({message: "Error occured while saving the data"});
    }
}