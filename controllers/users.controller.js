import utils from "../utils/utils.js";
import Users from "../models/Users.js";
import Media from "../models/Media.js";

export default {
    async registration(req, res) {
        try {
            const {
                userName,
                email,
                password,
            } = req.body;

            const file = req.file;

            const [created, param2] = await Users.findOrCreate({
                where: {email: email.toLowerCase()},
                defaults: {
                    userName,
                    email: email.toLowerCase(),
                    password,

                },
            });

            const filePath = req.file ? req.file.path.replace('public/', '') : null;

            await Media.create({
                userId: created.id,
                images: filePath
            })

            if (!param2) {
                res.status(409).json({
                    message: 'Email already exists!'
                });
                return;
            }

            const result = await Users.findByPk(created.id, {
                include: [
                    {
                        model: Media,
                        as: 'avatar',
                        attributes: ['images']
                    }
                ]
            })
            res.status(201).json({
                message: 'User created successfully',
                result
            });
        } catch (e) {
            res.status(500).json({
                message: 'Internal server error',
                error: e.message,
            });
        }
    },

    async login(req, res) {
        try {
            const {email, password} = req.body;
            const emailLowerCase = email.toLowerCase();

            const user = await Users.findOne({
                where: {email: emailLowerCase}
            });

            const hashPassword = Users.hash(password);

            if (!user || hashPassword !== user.getDataValue('password')) {
                res.status(401).json({
                    message: 'Invalid email or password',
                });
                return;
            }

            const payload = {
                id: user.id,
                email: user.email,
            };

            const expiresIn = {
                expiresIn: '50m'
            };

            const token = utils.createToken(payload, expiresIn);

            if (user.role === 'admin') {
                res.status(200).json({
                    message: 'Login successfully',
                    token,
                    isAdmin: true
                });
                return;
            }

            res.status(200).json({
                message: 'Login successfully',
                token,
                isAdmin: false
            });

        } catch (e) {
            res.status(500).json({
                message: 'Internal server error',
                error: e.message,
            });
        }
    },
}