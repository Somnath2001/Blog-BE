const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database("./blog.db", (err) => {
  if (err) {
    console.error("Failed to connect to the database:", err);
  } else {
    console.log("Connected to SQLite database.");
    db.run(
      "CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT)"
    );
  }
});

app.get("/posts", (req, res) => {
  db.all("SELECT * FROM posts", [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json({ posts: rows });
    }
  });
});

app.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM posts WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json({ post: row });
    }
  });
});

app.post("/posts", (req, res) => {
  const { title, content } = req.body;
  db.run(
    "INSERT INTO posts (title, content) VALUES (?, ?)",
    [title, content],
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, title, content });
      }
    }
  );
});

app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM posts WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json({ message: "Post deleted successfully" });
    }
  });
});

const port = process.env.PORT || 8081;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
