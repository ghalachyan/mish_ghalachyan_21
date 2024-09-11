import jwt from 'jsonwebtoken';

const {JWT_SECRET} = process.env;

export default {
    createToken: (payload, options) => {
        return jwt.sign(payload, JWT_SECRET, options);
    },
}