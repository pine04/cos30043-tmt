const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.status(200).send("Hello world.");
});

app.listen(8000, () => console.log("Listening on port 8000..."));

process.on("SIGINT", () => {
    console.log("Sigint received.");
    process.exit(0);
});
