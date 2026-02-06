const {getDB} = require('../database/mongo');
class Class{
    constructor(author, className, classCode, createdAt){
        this.Author = author;
        this.className = className;
        this.classCode = classCode;
        this.createdAt = createdAt ? createdAt : Date.now();
    }
    save(){
        const db = getDB();
        return db.collection('Classes').insertOne(this);
    }
    static getAllClasses(){
        const db = getDB();
        return db.collection('Classes').find().toArray();
    }
    static getClassByClassName(className){
        const db = getDB();
        return db.collection('Classes').findOne({className: className});
    }
}
module.exports = Class;