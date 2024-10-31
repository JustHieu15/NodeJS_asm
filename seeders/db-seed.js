const mongoose = require("mongoose");
const User = require("../models/User");
const Role = require("../models/Role");
const Permission = require("../models/Permission");
const bcrypt = require('bcryptjs');
const saltRounds = 10;

mongoose.connect('mongodb://127.0.0.1:27017/authASM', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
});

const seedDatabase = async () => {

    const permissions = await Permission.insertMany([
        { name: "ADMIN_ACCESS", url: "/admin", method: "/GET" },
        { name: "ADMIN_CREATE", url: "/admin/create", method: "/POST" },
        { name: "ADMIN_UPDATE", url: "/admin/update", method: "/PUT" },
        { name: "ADMIN_DELETE", url: "/admin/delete", method: "/POST" },
        { name: "USER_ACCESS",  url: "/user", method: "GET" ,}
    ]);

    const roles = await Role.insertMany([
        { name: "admin", permissions: [permissions[0]._id, permissions[1]._id, permissions[2]._id, permissions[3]._id] },
        { name: "admin_create", permissions: [permissions[0]._id, permissions[1]._id ] },
        { name: "admin_update", permissions: [permissions[0]._id, permissions[2]._id ] },
        { name: "admin_delete", permissions: [permissions[0]._id, permissions[3]._id ] },
        { name: "user", permissions: [permissions[4]._id] }
    ]);

    await User.insertMany([
        { name: "The Highest Admin User", email: "highestAdmin@gmail.com" , password: await bcrypt.hash('my password', 10), roles: [roles[0]._id] },
        { name: "The Admin Create User", email: "adminCreate@gmail.com" , password: await bcrypt.hash('my password', 10), roles: [roles[1]._id] },
        { name: "The Admin Update User", email: "adminUpdate@gmail.com" , password: await bcrypt.hash('my password', 10), roles: [roles[2]._id] },
        { name: "The Admin Delete User", email: "adminDelete@gmail.com" , password: await bcrypt.hash('my password', 10), roles: [roles[3]._id] },
        { name: "The Normal User", email: "user@gmail.com" , password: await bcrypt.hash('my password', 10), roles: [roles[4]._id] },
    ])

    console.log("Seeding completed.");
};

seedDatabase();
