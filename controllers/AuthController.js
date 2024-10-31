const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secret1key2from3Hieu';

exports.signup = async (req, res) => {
    try {
        // Tạo một đối tượng người dùng mới
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
        });

        // Lưu người dùng vào cơ sở dữ liệu
        const user = await newUser.save();

        // Kiểm tra và gán vai trò cho người dùng
        if (req.body.roles) {
            const roles = await Role.find({ name: { $in: req.body.roles } });
            user.roles = roles.map(role => role._id);
        } else {
            const role = await Role.findOne({ name: "user" });
            user.roles = [role._id];
        }

        // Lưu lại người dùng với vai trò
        await user.save();
        res.send({ message: "User was registered successfully!" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.signIn = async (req, res) => {
    try {
        // Tìm người dùng theo email
        const user = await User.findOne({ email: req.body.email }).populate("roles");

        if (!user) {
            return res.status(401).send({ message: "User not found" });
        }

        // Kiểm tra mật khẩu
        const validPassword = bcrypt.compareSync(req.body.password, user.password);
        if (!validPassword) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid password"
            });
        }

        // Tạo token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

        // Lấy danh sách vai trò của người dùng
        const authorities = user.roles.map(role => role.name);

        res.status(200).send({
            id: user._id,
            user: user.name,
            email: user.email,
            roles: authorities,
            accessToken: token,
        });
    } catch (err) {
        res.status(500).send({ message: err });
    }
};
