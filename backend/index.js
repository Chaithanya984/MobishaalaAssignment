const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

const dbpath = path.join(__dirname, "userlog.db");

let db = null;

const initializeDBANDServer = async () => {
  try {
    db = await open({ filename: dbpath, driver: sqlite3.Database });

    app.listen(4000, () => {
      console.log("server started");
    });
  } catch (e) {
    console.log(`error occured in db${e}`);
    process.exit(1);
  }
};

initializeDBANDServer();

const authentication = (request, response, next) => {
  let jwtToken;
  const authheader = request.headers["authorization"];
  if (authheader != undefined) {
    jwtToken = authentication.split(" ")[1];
  }

  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid jwttoken");
  } else {
    jwt.verify(jwtToken, "my_secret_token", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid Jwt Token");
      } else {
        response.username = payload.username;
        next();
      }
    });
  }
};

app.post("/register", async (request, response) => {
  const { username, password } = request.body;
  console.log("hj", password);
  const hashpassword = await bcrypt.hash(request.body.password, 10);
  const query = `SELECT * FROM USERS WHERE USERNAME = "${username}"`;
  const getQuery = await db.get(query);
  console.log(getQuery, "jj");
  if (getQuery === undefined) {
    const creatingNewuser = `INSERT INTO users(username,password)
    VALUES
      ("${username}","${hashpassword}")
    `;
    const addusers = await db.run(creatingNewuser);
    response.status(200);
    response.send("user created");
  } else {
    response.send("user already exists");
  }
});

app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const queryget = `SELECT * FROM USERS WHERE USERNAME="${username}"`;
  const checkingQuery = await db.get(queryget);
  console.log(checkingQuery, "kk", password);
  if (checkingQuery === undefined) {
    response.status(400);
    response.send("User doesn't exist please create");
  } else {
    const checkingPassword = await bcrypt.compare(
      password,
      checkingQuery.password
    );
    console.log(checkingPassword);
    if (checkingPassword === true) {
      const payload = {
        username: username,
      };
      const jwtverified = jwt.sign(payload, "my_secret_token");
      response.status(200);
      response.send(jwtverified);
    } else {
      response.status("400");
      response.send("invalid password");
    }
  }
});
