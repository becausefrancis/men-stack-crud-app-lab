const mongoose = require("mongoose");

const deitySchema = new mongoose.Schema({
    name: String,
    isOlympian: Boolean,
    description: String,
});

const Deity = mongoose.model("Deity", deitySchema);

module.exports = Deity;