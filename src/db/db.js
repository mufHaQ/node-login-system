const {
  sequelize,
  User
} = require('../models/user')
const {
  nanoid
} = require('nanoid')


async function CreateUser(username, email, password) {
  await User.create({
    nanoid: nanoid(10),
    username: username,
    email: email,
    password: password
  })
}


module.exports = {
  sequelize,
  CreateUser
}
