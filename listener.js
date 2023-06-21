const express = require("express");
const app = express();

const PORT = 8000;

app.get("/", async (req, res) => {
  console.log("HELLO WORLD");
  res.send("HELLO WORLD");
});

app.listen(PORT, () => {
  console.log(`⚡Server is running here 👉 http://localhost:${PORT}`);
});
