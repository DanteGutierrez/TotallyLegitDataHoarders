const { MongoClient, ObjectId } = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'test';
const db = client.db(dbName);

exports.index = async (req, res) => {
    // await addGeneratedAccounts();
    // await addGeneratedPosts();
    // await addGeneratedFollowings();
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

const dropCollection = async (collectionName) => {
    let collection = db.collection(collectionName);
    await client.connect();
    await collection.drop();
    client.close();
}

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

const insertDataSet = async (collectionName, data) => {
    let collection = db.collection(collectionName);
    await client.connect();
    const insertResult = await collection.insertMany(data);
    client.close();
    return insertResult;
};

// const addGeneratedAccounts = async () => {
//     await dropCollection("accounts");
//     const profile = require("../../Back End/Generated Data/profile.json");
//     const pii = require("../../Back End/Generated Data/pii.json");
//     const location = require("../../Back End/Generated Data/location.json");
//     let date = new Date();
//     let accounts = [];
//     let currentDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
//     if (profile.length == pii.length) {
//         for (let i = 0; i < profile.length; i++) {
//             let account = {
//                 profile: {
//                     username: profile[i].username,
//                     picture: "BLOB",
//                     bio: profile[i].bio
//                 },
//                 creationdate: new Date(new Date(currentDate).toISOString()),
//                 pii: {
//                     firstname: pii[i].firstname,
//                     lastname: pii[i].lastname,
//                     dob: new Date(new Date(pii[i].dob).toISOString()),
//                     email: pii[i].email,
//                     phone: pii[i].phone,
//                     location: {
//                         city: location.city,
//                         state: location.state,
//                         country: location.country
//                     }
//                 }
//             };
//             accounts.push(account);
//         }
//     }
//     await insertDataSet("accounts", accounts);
// };

// const addGeneratedPosts = async () => {
//     await dropCollection("posts");
//     const postData = require("../../Back End/Generated Data/posts.json");
//     let posts = [];
//     for (let i = 0; i < postData.length; i++) {
//         let post = {
//             poster: postData[i].poster,
//             picture: "BLOB",
//             desc: postData[i].description
//         };
//         posts.push(post);
//     }
//     await insertDataSet("posts", posts);
// };

// const addGeneratedFollowings = async () => {
//     await dropCollection("following");
//     const followingData = require("../../Back End/Generated Data/following.json");
//     let following = [];
//     for (let i = 0; i < followingData.length; i++) {
//         let follow = {
//             followed: followingData[i].followed,
//             follower: followingData[i].follower
//         };
//         following.push(follow);
//     }
//     for (let i = 0; i < followingData.length; i++) {
//         let follow = {
//             followed: followingData[i].follower,
//             follower: followingData[i].followed
//         };
//         following.push(follow);
//     }
//     await insertDataSet("following", following);
// };