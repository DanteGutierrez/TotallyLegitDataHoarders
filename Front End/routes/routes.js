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

const findResult = async (collectionName, requirements) => {
    if (collectionName != "") {
        let collection = db.collection(collectionName);
        await client.connect();
        let findResult = await collection.find(requirements).toArray();
        client.close();
        return findResult;
    }
    return null;
};
const getRandomResult = (resultList) => {
    let random = Math.floor(Math.random() * resultList.length);
    return resultList[random];
};

exports.type = async (req, res) => {
    let collectionName = req.params.type;
    let resultList = await findResult(collectionName, {});
    let result = getRandomResult(resultList);
    let bonusList;
    switch (collectionName) {
        case "accounts":
            bonusList = await findResult("following", {followed: result.profile.username});
            res.render('account', {
                title: 'Account',
                account: result,
                followers: bonusList
            });
            break;
        case "posts":
            bonusList = await findResult("comments", {postid: result._id});
            res.render('post', {
                title: "Post",
                post: result,
                comments: bonusList
            });
            break;
        default:
            res.redirect('/');
            break;
    }
};
