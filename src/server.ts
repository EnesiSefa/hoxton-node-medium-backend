import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
const app = express();
const prisma = new PrismaClient({ log: ["warn", "error", "info", "query"] });
app.use(cors());
app.use(express.json());
const port = 4000;

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({ include: { posts: true } });
  res.send(users);
});
app.get("/users/:id", async (req, res) => {
  try {
    const users = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      include: { posts: true },
    });
    res.send(users);
  } catch {
    res.status(404).send({ error: "user not found" });
  }
});
app.post("/users", async (req, res) => {
  try {
    const users = await prisma.user.create({ data: req.body });
    res.send(users);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.delete({
      where: { id: Number(req.params.id) },
    });
    res.send(user);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

app.get("/comments", async (req, res) => {
  const comments = await prisma.comment.findMany({ include: { post: true } });
  res.send(comments);
});
app.get("/posts", async (req, res) => {
  const posts = await prisma.post.findMany({ include: { comments: true } });
  res.send(posts);
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
