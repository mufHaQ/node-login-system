const express = require("express");
const router = express.Router();
const { createUser, checkUser, sync, drop } = require("../db/db");
const { user } = require("../models/user");
const resTemplate = require("./resTemplate");

router.get("/sync", async (req, res) => {
  const table_name = await sync(user);
  res.json(
    resTemplate(req, "sync table", false, {
      table: await table_name,
    })
  );
});

router.get("/drop", async (req, res) => {
  const table_name = await drop(user);
  res.json(
    resTemplate(req, "drop table", false, {
      table: await table_name,
    })
  );
});

router.post("/signup", async (req, res) => {
  const result = await createUser(req);
  if (result) {
    res.json(resTemplate(req, `create user ${req.body["username"]}`));
  } else {
    res.json(resTemplate(req, "need valid email, username and password", true));
  }
});

router.post("/signin", async (req, res) => {
  const result = await checkUser(req);
  if (result) {
    res.json(resTemplate(req, "welcome!"));
  } else {
    res.json(resTemplate(req, "wrong email/username or password", true));
  }
});

router.route("/signup").post(async (req, res) => {});

module.exports = router;
