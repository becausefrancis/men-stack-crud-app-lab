const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const methodOverride = require("method-override");
const morgan = require("morgan");

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Deity = require("./models/deity.js")

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

app.post("/deities", async (req, res) => {
    if (req.body.isOlympian === "on") {
        req.body.isOlympian = true;
    } else {
        req.body.isOlympian = false;
    }
      
    await Deity.create(req.body);
    res.redirect("/deities");
});

app.get("/deities", async (req, res) => {
    const allDeities = await Deity.find();
    res.render("deities/index.ejs", { deities: allDeities });
});

app.get("/", async (req, res) => {
    res.render("index.ejs");
});

app.get("/deities/new", (req, res) => {
    res.render("deities/new.ejs");
});

app.get("/deities/:deityId", async (req, res) => {
    const foundDeity = await Deity.findById(req.params.deityId);
    res.render("deities/show.ejs", { deity: foundDeity });
});

app.get("/deities/:deityId/edit", async (req, res) => {
    const foundDeity = await Deity.findById(req.params.deityId);
    res.render("deities/edit.ejs", {
        deity: foundDeity,
    });
});

app.put("/deities/:deityId", async (req, res) => {
    if (req.body.isOlympian === "on") {
      req.body.isOlympian = true;
    } else {
      req.body.isOlympian = false;
    }
    
    await Deity.findByIdAndUpdate(req.params.deityId, req.body);
  
    res.redirect(`/deities/${req.params.deityId}`);
});

app.delete("/deities/:deityId", async (req, res) => {
    await Deity.findByIdAndDelete(req.params.deityId);
    res.redirect("/deities");
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
