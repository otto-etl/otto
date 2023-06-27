import express from "express";

const app = express();
const PORT = 3001;

app.get("/ping", (req, res) => {
  res.send("Pong");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
