import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Middleware to check if a user is an admin
export function requireAdmin(req, res, next) {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).send('Forbidden');
    }
};

export const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            _id: decoded._id,
            "tokens.token": token,
        });

        if (!user) {
            throw new Error();
        }

        // Check if the user is verified
        if (!user.isVerified) {
            return res.status(403).send({ error: "User is not verified." });
        }

        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({ error: "Please authenticate." });
    } 
};