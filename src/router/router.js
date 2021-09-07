const express = require('express')
const router = express.Router()
const emailValidator = require('email-validator')
const bcrypt = require('bcrypt')
const {
  sequelize,
  CreateUser
} = require('../db/db')
const {
  User
} = require('../models/user')


function Template(req, msg, error = false) {
  const date = new Date().toLocaleString('id-id').split('/').join('-').split('.').join(':')
  if (msg && (typeof (msg) != 'boolean')) {
    return {
      date: date,
      method: req.method,
      error,
      msg,
    }
  } else if (typeof msg == 'boolean') {
    return {
      date: date,
      method: req.method,
      error: msg,
    }
  } else {
    return {
      date: date,
      method: req.method,
      error,
    }
  }
}


router.get('/', (req, res) => {
  res.json(Template(req, 'Hello'))
})


router.route('/signup')
  .get((req, res) => {
    res.json(Template(req, 'User POST method for signup'))
  })
  .post((req, res) => {
    const username = req.body['username']
    const email = req.body['email']
    const plainPassword = req.body['password']

    if (Object.values(req.body) < 1) {
      res.json(Template(req, "Need json", true))
    } else {
      if (emailValidator.validate(email)) {
        if (((email && plainPassword) || (username && plainPassword) || (email && username && plainPassword))) {
          const password = bcrypt.hashSync(plainPassword, 10)
          try {
            CreateUser(username, email, password)
            res.json(Template(req, `Create user ${username}`, false))
          } catch (err) {
            res.json(Template(req, err.message, true))
          }
        } else {
          res.json(Template(req, "Need email/username and password", true))
        }
      } else {
        res.json(Template(req, "Email must be like: example@example.com", true))
      }
    }
  })


router.route('/signin')
  .post(async (req, res) => {
    const plainPassword = req.body['password']
    const username = req.body['username']
    const email = req.body['email']

    async function findByUser(field) {
      let user = null
      switch (field) {
        case "username":
          user = await User.findOne({
            where: {
              username: username,
            }
          })
          break
        case 'email':
          user = await User.findOne({
            where: {
              email: email,
            }
          })
          break
      }

      bcrypt.compare(plainPassword, user['password'])
        .then(result => {
          if (result) {
            res.json({
              ...Template(req),
              login: true
            })
          } else {
            res.json({
              ...Template(req, true),
              login: false
            })
          }
        })
    }

    if ((email && plainPassword) || (username && plainPassword) || (email && username && plainPassword)) {
      try {
        if (username) {
          await findByUser("username")
        } else if (email) {
          await findByUser("email")
        }
      } catch (err) {
        res.json({
          ...Template(req, true),
          login: false
        })
      }
    } else {
      res.json(Template(req, "Need email/username and password", true))
    }
  })
  .get((req, res) => {
    res.json(Template(req, 'User POST method for signin'))
  })


router.get('/sync', async (req, res) => {
  try {
    await sequelize.sync()
    res.json(Template(req, "Sync models"))
  } catch (err) {
    res.json(Template(req, err.message, true))
  }
})


router.get('/drop', async (req, res) => {
  try {
    await sequelize.drop()
    res.json(Template(req, "Drop models"))
  } catch (err) {
    res.json(Template(req, err.message, true))
  }
})


module.exports = router
