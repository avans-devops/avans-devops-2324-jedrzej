const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URL_PHOTO;
const client = new MongoClient(uri);
const db = client.db(process.env.DB_NAME_PHOTO);
module.exports = {
    db: db,
    client: client
};

