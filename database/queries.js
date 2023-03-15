const Pool = require("pg").Pool;
const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "url_shortener",
  password: "password",
  port: 5432,
});
const shortID = require("shortid");

const getUrls = (req, res) => {
  pool.query("SELECT * FROM urls ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

const createShortUrl = (req, res) => {
  const { fullurl } = req.body;
  const shorturl = shortID.generate();

  pool.query(
    "INSERT INTO urls (fullurl, shorturl) VALUES ($1, $2) RETURNING *",
    [fullurl, shorturl],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send(`URL added with ID: ${results.rows[0].id}`);
    }
  );
};

const getShortUrl = (req, res) => {
  const shortenUrl = req.params.shorturl;
  pool.query(
    "UPDATE urls SET clicks=clicks+1 WHERE shorturl=$1",
    [shortenUrl],
    (error, results) => {
      if (error) {
        throw error;
      }
    }
  );
  pool.query(
    "SELECT * FROM urls WHERE shorturl=$1",
    [shortenUrl],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
};

module.exports = {
  getUrls,
  createShortUrl,
  getShortUrl,
};
