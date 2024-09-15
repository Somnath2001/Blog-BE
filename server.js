require("dotenv").config();
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(
  cors({
    origin: [
      "https://blog-1wspgshbx-somnathdudhat222gmailcoms-projects.vercel.app",
    ],
    methods: "GET,POST,PUT,DELETE",
  })
);

app.use(bodyParser.json());

// Connect to MySQL database using Sequelize
const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: "mysql",
    dialectModule: require("mysql2"),
  }
);

// Define the Post model
const Post = sequelize.define(
  "Post",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "posts",
  }
);

// Sync model with the database (creates table if it doesn't exist)
sequelize
  .sync()
  .then(() => {
    console.log("Connected to MySQL database and synced Post model.");
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });

// Get all posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json({ posts });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get post by ID
app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id);
    if (post) {
      res.json({ post });
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create a new post
app.post("/posts", async (req, res) => {
  const { title, content } = req.body;
  try {
    const newPost = await Post.create({ title, content });
    res.json(newPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a post by ID
app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id);
    if (post) {
      await post.destroy();
      res.json({ message: "Post deleted successfully" });
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const port = process.env.PORT || 8081;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Or specify your frontend origin
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Handle preflight request
  }

  // Handle actual request...
  res.json({ message: "Hello World !!!" });
};
