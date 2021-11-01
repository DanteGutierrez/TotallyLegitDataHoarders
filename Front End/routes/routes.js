const { MongoClient, ObjectId } = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'test';
const db = client.db(dbName);

exports.index = (req, res) => {
    res.render('index', {
        title: "Home"
    });
};

const findResult = async (collectionName) => {
    if (collectionName != "") {
        let collection = db.collection(collectionName);
        await client.connect();
        let findResult = await collection.find({}).toArray();
        client.close();
        return findResult[0];
    }
    return null;
};

exports.type = async (req, res) => {
    let collectionName = req.params.type;
    let result = await findResult(collectionName);
    switch (collectionName) {
        case "accounts":
            res.render('account', {
                title: 'Account',
                account: result
            });
            break;
        case "posts":
            res.render('post', {
                title: "Post",
                post: result
            });
            break;
        default:
            res.redirect('/');
            break;
    }
};
