const { sequelize, user } = require("../models/user");
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const emailValidator = require("email-validator");

async function sync(instance) {
  await instance.sync();
  return instance.tableName;
}

async function drop(instance) {
  await instance.drop();
  return instance.tableName;
}

async function createUser(req) {
  const plainPassword = req.body["password"];
  const email = req.body["email"];
  const username = req.body["username"];

  if (emailValidator.validate(email)) {
    await bcrypt.hash(plainPassword, 10, async (err, hash) => {
      if (err) throw new Error(err);
      await user.create({
        nanoid: nanoid(10),
        username: username,
        email: email,
        password: hash,
      });
    });
    return true;
  } else {
    return false;
  }
}

async function checkUser(req) {
  let email = req.body["email"];
  let username = req.body["username"];
  const plainPassword = req.body["password"];
  let result = false;

  async function search(temp, searchData) {
    if (username && temp == searchData["username"]) {
      temp = true;
    } else if (email && temp == searchData["email"]) {
      temp = true;
    } else {
      temp = false;
    }

    if (temp) {
      await bcrypt
        .compare(plainPassword, searchData["password"])
        .then((bcryptResult) => {
          result = bcryptResult;
        })
        .catch((bcryptResult) => {
          result = bcryptResult;
        });
    }
  }

  if (username) {
    const temp = username;
    username = await user.findOne({
      where: {
        username: username,
      },
    });
    await search(temp, username);
  } else if (email) {
    const temp = email;
    email = await user.findOne({
      where: {
        email: email,
      },
    });
    await search(temp, email);
  }

  return result;
}

module.exports = {
  sequelize,
  sync,
  drop,
  createUser,
  checkUser,
};
