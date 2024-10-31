const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    name: String,
    url: String,
    method: String,
})

module.exports = mongoose.model("Permission", permissionSchema);