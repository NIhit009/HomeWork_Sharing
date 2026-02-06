const mongo = require('mongodb');
require('dotenv').config();
const mongoclient  = mongo.MongoClient;

let _db;

const MongoConnect = (callback) => {mongoclient.connect(process.env.MONGODB_URI).then((client) => {
    console.log("Mongo Connected");
    _db = client.db('homework');
    callback();
}).catch((error) => {
    console.log("Failed to connect to Mongo", error);
    callback(error);
})}

const getDB = () => {
    if (!_db){
        console.log("Could not find the database")
    }
    return _db;
}

exports.MongoConnect = MongoConnect;
exports.getDB = getDB;