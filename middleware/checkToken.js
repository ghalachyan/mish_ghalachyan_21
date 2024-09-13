import jwt from 'jsonwebtoken';
import Users from "../models/Users.js";

const { JWT_SECRET } = process.env; 

export default async (req, res, next) => {
    const token = req.headers.authorization;

    if(!token) {
        res.status(401).json({message: 'Unauthorized'});
        return;
    }

    try{
        const decryptedData = jwt.verify(token, JWT_SECRET);

        const user = await Users.findByPk(decryptedData.id, {raw: true});

        if (!user) {
            res.status(401).json({
                message: 'User not found',
            });
            return;
        }
        if (!decryptedData) {
            res.status(401).json({
                message: 'Invalid or expired token',
            });
            return;
        }

        req.user = user;

        next();
    }catch(e) {
        console.log(e.message);
        res.status(401).json({message: e.message});
    }
}