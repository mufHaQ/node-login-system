const express = require("express");
const router = express.Router();
const { createUser, checkUsername, sync, drop } = require("../db/db");
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
  const { error, message } = await createUser(req);
  if (!error) {
    res.json(resTemplate(req, message));
  } else {
    res.json(resTemplate(req, message, error));
  }
});

router.post("/signin", async (req, res) => {
  console.log(await checkUsername(req));
  res.json(resTemplate(req, "signin"));
});

module.exports = router;
