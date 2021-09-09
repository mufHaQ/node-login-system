const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  host: "localhost",
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB,
  dialect: process.env.DB_DIALECT,
});

let users = "users";

if (process.env.NODE_ENV == "development") {
  users = "_test_users";
}

const User = sequelize.define(users, {
  nanoid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: {
        msg: "Must be email",
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = {
  sequelize,
  user: User,
};
