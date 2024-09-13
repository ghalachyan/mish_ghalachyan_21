import {v4 as uuid} from 'uuid';
import fs from 'fs/promises';

import utils from "../utils/utils.js";
import Users from "../models/Users.js";
import Media from "../models/Media.js";

import {sendMail} from "../services/Mail.js";

export default {
    async registration(req, res) {
        try {
            const {
                userName,
                email,
                password,
            } = req.body;

            const file = req.file;

            if (!file) {
                res.status(409).json({
                    message: 'File not found!'
                });
                return;
            }

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
                await fs.unlink(file.path);
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

            const activationKey = uuid();

            await Users.update({
                activationKey,
            }, {
                where: {
                    id: created.id
                }
            })

            await sendMail({
                to: result.email,
                subject: 'Welcome to send mail project',
                template: 'userActivation',
                templateData: {
                    link: `http://localhost:3000/users/activate?key=${activationKey}`,
                }
            });

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

    async activate(req, res) {
        try {
            const {key} = req.query;

            const user = await Users.findOne({
                where: {activationKey: key}
            });

            if (!user) {
                res.status(404).send({
                    message: 'User does not exist',
                });
                return;
            }

            if (user.status === 'active') {
                res.status(200).send({
                    message: 'User already activated',
                })
                return;
            }

            await Users.update({
                status: 'active',
            }, {
                where: {
                    id: user.id
                }
            })

            res.status(200).send({
                message: 'User activated successfully!',
            })

        } catch (e) {
            res.status(500).json({
                message: 'Internal server error',
                error: e.message,
            })
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

            if (user.status !== 'active') {
                res.status(401).send({
                    message: 'Please confirm your email',
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

    async profile(req, res) {
        try {
            const {id} = req.user;

            const user = await Users.findByPk(id, {
                include: [
                    {
                        model: Media,
                        as: 'avatar',
                        attributes: ['images']
                    },
                ],
            });

            if (!user) {
                res.status(404).json({
                    message: 'User not found',
                    user: []
                });
                return;
            }

            res.status(200).json({
                user
            })
        } catch (e) {
            res.status(500).json({
                message: 'Internal server error',
                error: e.message,
            })
        }
    }
}