const express = require("express");
const router = express.Router();
const { createUser, checkUsername, sync, drop } = require("../db/db");
const { user } = require("../models/user");
const resTemplate = require("./resTemplate");
const { Sign, Auth } = require("../auth/auth");

router.get("/sync", async (req, res) => {
  const table_name = await sync(user);
  res.json(resTemplate(req, "sync table", false, { table: await table_name }));
});

router.get("/drop", async (req, res) => {
  const table_name = await drop(user);
  res.json(resTemplate(req, "drop table", false, { table: await table_name }));
});

router.post("/signup", async (req, res) => {
  const { error, message } = await createUser(req);
  if (!error) {
    res.json(resTemplate(req, message));
  } else {
    res.json(resTemplate(req, message, error));
  }
});

router.post("/signin", async (req, res) => {
  checkUsername(req).then(async (result) => {
    if (result) {
      res.cookie("jwt", await Sign(req));
      res.json(resTemplate(req, false, { login: true }));
    } else {
      res.json(resTemplate(req, true, { login: false }));
    }
  });
});

router.get("/data", async (req, res) => {
  if (req.cookies["jwt"]) {
    if (await Auth(req, user)) {
      res.json(resTemplate(req, "Welcome!", false, req.cookies));
    }
  } else {
    res.json(resTemplate(req, "Login first", true));
  }
});

router.get("/signout", (req, res) => {
  res.cookie("jwt", "", {
    maxAge: -1,
  });
  res.json(resTemplate(req, "Signout"));
});

module.exports = router;
