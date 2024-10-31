const User = require('../models/User');
const Role = require('../models/Role');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secret1key2from3Hieu';

// Middleware để xác thực token
exports.verifyToken = async (req, res, next) => {
    // const token = req.headers['x-auth-token'];

    const token = req.headers['authorization']?.split(' ').slice(-1).join('');

    if (!token) {
        return res.status(401).send({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, 'secret1key2from3Hieu');
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).send({ message: "Unauthorized" });
    }
};

// Middleware để kiểm tra quyền admin
exports.checkAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).exec();

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const roles = await Role.find({ _id: { $in: user.roles } });

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin" || roles[i].name === "admin_create" || roles[i].name === "admin_update") {
                return next(); // Tiếp tục nếu là admin
            }
        }

        return res.status(403).send({ message: "Require Admin Role!" }); // Phản hồi nếu không phải admin
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};
