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

exports.account = async (req, res) => {
    let resultList = req.query.id != undefined ? await findResult("accounts", {_id: req.query.id}) : await findResult("accounts", {});
    let result = getRandomResult(resultList);
    let bonusList = await findResult("following", {followed: result.profile.username});
    res.render('account', {
        title: 'Account',
        account: result,
        followers: bonusList
    });
};
exports.post = async (req, res) => {
    let resultList = req.query.id != undefined ? await findResult("posts", { _id: req.query.id }) : await findResult("posts", {});
    let result = getRandomResult(resultList);
    let bonusList = await findResult("comments", {postid: result._id});
    res.render('post', {
        title: 'Post',
        post: result,
        comments: bonusList
    });
};

const insertData = async (collectionName, data) => {
    let collection = db.collection(collectionName);
    await client.connect();
    const insertResult = await collection.insertOne(data);
    client.close();
    return insertResult;
};

exports.accountCreate = (req, res) => {
    res.render('createAccount', {
        title: 'Create Account'
    });
};
exports.postCreate = (req, res) => {
    res.render('createPost', {
        title: 'Create Post'
    });
};
exports.postedAccount = async (req, res) => {
    let date = new Date();
    let account = {
        profile: {
            username: req.body.name,
            picture: "BLOB",
            bio: req.body.bio
        },
        creationdate: { $toDate: date.getDate() },
        pii: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            dob: { $toDate: req.body.dob },
            email: req.body.email,
            phone: req.body.phone,
            location: {
                city: req.body.city,
                state: req.body.state,
                country: req.body.country
            }
        }
    };
    let result = await insertData("accounts", account);
    res.redirect("/account");
};
exports.postedPost = (req, res) => {

};

