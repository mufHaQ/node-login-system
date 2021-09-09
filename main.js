require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./src/router/router");

const port = process.env.PORT;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.listen(port, () => {
  console.log(`Listening @ http://localhost:${port}`);
});
app.use(router);
