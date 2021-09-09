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
  const check = (await checkUsername(req)) || (await checkEmail(req));

  if (check) {
    return {
      error: true,
      message: "username or email already exists",
    };
  }

  if (emailValidator.validate(email)) {
    await bcrypt.hash(plainPassword, 10, async (err, hash) => {
      if (err) throw new Error(err);
      await user.create({ nanoid: nanoid(10), username: username, email: email, password: hash });
    });
    return {
      error: false,
      message: `create new user '${username}'`,
    };
  } else {
    return {
      error: true,
      message: "need valid email, username and password",
    };
  }
}

async function check(instance, data) {
  let result = false;
  if (emailValidator.validate(data)) {
    result = await instance.findOne({ where: { email: data } });
  } else {
    result = await instance.findOne({ where: { username: data } });
  }

  return result ?? false;
}

async function checkUsername(req) {
  const username = req.body["username"];
  return await check(user, username);
}

async function checkEmail(req) {
  const email = req.body["email"];
  return await check(user, email);
}

module.exports = {
  sequelize,
  sync,
  drop,
  createUser,
  checkUsername,
  check,
};
