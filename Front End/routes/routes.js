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
    let resultList = req.query.id != undefined ? await findResult("accounts", {_id: ObjectId(req.query.id)}) : await findResult("accounts", {});
    let result = getRandomResult(resultList);
    let bonusList = await findResult("following", {followed: result.profile.username});
    res.render('account', {
        title: 'Account',
        account: result,
        followers: bonusList
    });
};
exports.post = async (req, res) => {
    let resultList = req.query.id != undefined ? await findResult("posts", { _id: ObjectId(req.query.id)}) : await findResult("posts", {});
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
    let currentDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    let account = {
        profile: {
            username: req.body.username,
            picture: "BLOB",
            bio: req.body.bio
        },
        creationdate: new Date(new Date(currentDate).toISOString()),
        pii: {
            firstname: req.body.fname,
            lastname: req.body.lname,
            dob: new Date(new Date(req.body.dob).toISOString()),
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
    res.redirect(`/account?id=${result.insertedId.toString()}`);
};
exports.postedPost = async (req, res) => {
    let post = {
        poster: req.body.poster,
        picture: "BLOB",
        desc: req.body.desc
    }
    let result = await insertData("posts", post);
    res.redirect(`/post?id=${result.insertedId.toString()}`);
};
exports.followedAccount = async (req, res) => {
    let follow = {
        followed: req.body.followed,
        follower: req.body.follower
    };
    let result = await insertData("following", follow);
    res.redirect(`account?id=${req.query.id}`);
};
exports.commentedPost = async (req, res) => {
    let comment = {
        postid: ObjectId(req.body.postid),
        commenter: req.body.commenter,
        words: req.body.words
    };
    let result = await insertData("comments", comment);
    res.redirect(`post?id=${req.query.id}`);
};
