const { ObjectId } = require('mongodb');
const {getDB} = require('../database/mongo');

class User{
    constructor(fullName, Email, Password, GoogleId, userType, isVerified, verifyCode, codeExpires){
        this.fullName = fullName;
        this.Email = Email;
        this.Password = Password;
        this.GoogleId = GoogleId;
        this.userType = userType;
        this.isVerified = isVerified ? isVerified : false;
        this.verifyCode = verifyCode;
        this.codeExpires = codeExpires;
    }
    save(){
        const db = getDB();
        if (this.Password){
            return db.collection('Users').insertOne({fullName : this.fullName, Email: this.Email, Password: this.Password, UserType: this.userType, VerifyCode: this.verifyCode, CodeExpired: this.codeExpires});
        }else{
            return db.collection('Users').insertOne({fullName : this.fullName, Email: this.Email, GoogleId: this.GoogleId, UserType: this.userType, VerifyCode: this.verifyCode, CodeExpired: this.codeExpires});
        }
        
    }
    static getUser(){
        const db = getDB();
        return db.collection('Users').find().toArray();
    }
    static getUserByEmail(email){
        const db = getDB();
        return db.collection('Users').findOne({Email: email});
    }
    static getUserByGoogleId(GoogleId){
        const db = getDB();
        return db.collection('Users').findOne({GoogleId: GoogleId});
    }
    static getUserById(id){
        const db = getDB();
        return db.collection('Users').findOne({_id: ObjectId(id)});
    }
    static verifyEmail(email){
        const db = getDB();
        return db.collection('Users').updateOne({Email: email}, {$set: {isVerified: true}});
    }
}
module.exports = User;