/* 
    Author: Mohan Talupula
    github: https://www.github.com/mohanmonu777
*/
//basic imports
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const serviceAccount = require("./serviceAccount");
const cors = require("cors");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// express app init
const app = express();
app.use(express.json());
app.use(cors());

const db = admin.firestore();

// /register
app.post("/register", async (request, response) => {
  const { userId, password } = request.body; // getting fields from request body
  const userExists = await isUserExists(userId); // checking whether user exists or not

  if (userExists) {
    response.status(400).send({
      error: "User already exists!"
    });
  } else {
    const addedUser = await db.collection("users").add({
      userId, // userId : userId
      password // password : password
    });
    response.status(200).send({
      id: addedUser.id,
      userId
    });
  }
});

const isUserExists = async userId => {
  const result = await db
    .collection("users")
    .where("userId", "==", userId)
    .get();
  return result.empty ? false : true;
};

exports.yourFunction = functions.https.onRequest(app);
