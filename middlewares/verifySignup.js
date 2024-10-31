const Role = require('../models/Role');
const User = require('../models/User');

exports.checkDuplicateEmail = async (req, res, next) => {
    try {
        // Kiểm tra tên người dùng
        const userByUsername = await User.findOne({ username: req.body.name });
        if (userByUsername) {
            return res.status(401).send({ message: "User already exists" });
        }

        // Kiểm tra email
        const userByEmail = await User.findOne({ email: req.body.email });
        if (userByEmail) {
            return res.status(401).send({ message: "Email already in use" });
        }

        next();
    } catch (err) {
        res.status(500).send({ message: err });
    }
};

exports.checkRoleExists = async (req, res, next) => {
    if (req.body.roles) {
        const roles = await Role.find({ name: { $in: req.body.roles } }).select('-__v');

        const existingRoles = roles.map(role => role.name);
        const nonExistingRoles = req.body.roles.filter(role => !existingRoles.includes(role));

        if (nonExistingRoles.length > 0) {
            return res.status(400).send({
                message: `${nonExistingRoles.join(', ')} does not exist`
            });
        }
    }

    next();
};
