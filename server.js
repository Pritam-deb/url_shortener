const express = require("express");
const shortid = require("shortid");
const bodyParser = require("body-parser");
const app = express();
const db = require("./database/queries");

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (request, response) => {
  response.json({ info: "URL Shortener API made in NodeJS and Postgres." });
});
app.get("/urls", db.getUrls);
app.post("/shortUrls", db.createShortUrl);
app.get("/urls/:shorturl", db.getShortUrl);
app.listen(3000, () => {
  console.log(`App running on port: 3000`);
});
