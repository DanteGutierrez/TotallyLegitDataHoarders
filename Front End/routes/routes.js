const mongo = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const dbName = "exampleDB";
exports.index = (req, res) => {
    res.render('index', {
        title: 'Home',
    });
};
mongo.connect(url, (err, client) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Connected successfully to server');
    const db = client.db(dbName);
});
