import Posts from "../models/Posts.js";
import Media from "../models/Media.js";
import Users from "../models/Users.js";
import fs from "fs/promises";

export default {
    async create(req, res) {
        try {
            const {description} = req.body;
            const {id} = req.user;
            const {files} = req;

            const post = await Posts.create({
                description,
                userId: id,
            });

            for (let file of files) {
                const filePath = file.path.replace('public/', '');

                await Media.create({
                    images: filePath,
                    postId: post.id,
                })
            }

            const result = await Posts.findByPk(post.id, {
                include: [
                    {
                        model: Media,
                    }
                ]
            });

            res.status(201).json({
                message: 'Post created successfully',
                result
            })

        } catch (e) {
            res.status(500).json({
                message: 'Internal server error',
                error: e.message,
            });
        }
    },

    async getPosts(req, res) {
        try {
            const {id: userId} = req.user;
            const {
                page,
                limit
            } = req.query;

            const total = Posts.count()
            const offset = (page - 1) * limit;
            const maxPageCount = Math.ceil(total/limit);
            const user = await Users.findByPk(userId);

            if (!user) {
                 res.status(404).json({
                    message: 'User not found',
                    user: []
                });

                return;
            }

            if(page > maxPageCount) {
                res.status(404).json({
                    message: 'Posts does not found.',
                    posts: []
                });

                return ;
            }

            const posts = await Posts.findAll({
                attributes: ['id', 'description', 'createdAt'],
                include: [
                    {
                        model: Users,
                        include: [
                            {
                                model: Media,
                                as: 'avatar',
                                attributes: ['images'],
                            },
                        ],
                    },
                    {
                        model: Media,
                        attributes: ['images', 'createdAt', 'postId'],
                    },
                ],
                order: [['id', 'DESC']],
                limit: parseInt(limit, 10),
                offset
            });

            res.status(200).json({
                message: 'Posts list',
                posts
            })
        } catch (e) {
            res.status(500).json({
                message: 'Internal server error',
                error: e.message,
            })
        }
    }
}