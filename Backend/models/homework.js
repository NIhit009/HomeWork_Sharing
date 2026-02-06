const {getDB} = require('../database/mongo');
const {ObjectId} = require('mongodb');
class HomeworkApp{
    constructor(Name, Week, file, SubmissionDate, SubmittedBy){
        this.Name = Name;
        this.Week = Week;
        this.file = file;
        this.SubmissionDate = SubmissionDate;
        this.SubmittedBy = SubmittedBy ? SubmittedBy : "Anonymous";
    }
    save(){
        const db = getDB();
        return db.collection('homeworks').insertOne(this);
    }
    static fetchAll(){
        const db = getDB();
        return db.collection('homeworks').find().toArray();
    }
    static getDataById(id){
        const db = getDB();
        return db.collection('homeworks').findOne({_id: new ObjectId(id)});
    }
}
module.exports = HomeworkApp;