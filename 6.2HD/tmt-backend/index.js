const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(morgan("dev"));

app.get("/register", (req, res) => {
    res.status(200).send("Success");
});

app.listen(8000, () => console.log("Listening on port 8000..."));
