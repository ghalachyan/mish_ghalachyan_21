import Posts from "../models/Posts.js";
import Media from "../models/Media.js";
import Users from "../models/Users.js";

export default {
    async create(req, res) {
        try {
            const {description} = req.body;
            const {id} = req.user;
            const {files} = req;

            if (!files) {
                res.status(409).json({
                    message: 'File or files not found!'
                });
                return;
            }
            const post = await Posts.create({
                description,
                userId: id,
            });

            for (let file of files) {
                const filePath = file.path.replace('public/', '');

                await Media.create({
                    path: filePath,
                    postId: post.id,
                })
            }

            const result = await Posts.findByPk(post.id, {
                include: [
                    {
                        model: Media,
                        as: 'images',
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

            const page = +req.query.page;
            const limit = +req.query.limit;

            const total = Posts.count()
            const offset = (page - 1) * limit;
            const maxPageCount = Math.ceil(total / limit);


            if (page > maxPageCount) {
                res.status(404).json({
                    message: 'Posts does not found.',
                    posts: []
                });

                return;
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
                        attributes: ['path', 'createdAt', 'postId'],
                    },
                ],
                order: [['id', 'DESC']],
                limit,
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
    },

    async delete(req, res) {
        try {
            const {id} = req.params;

            if (!id) {
                res.status(400).json({message: 'Id is required'});
                return;
            }

            const post = await Posts.findByPk(id);

            if (!post) {
                res.status(404).json({
                    message: 'Post Id not found.',
                })
                return;
            }

            const images = await Media.findAll(
                {
                    where: {postId: id}
                });

            await Media.deleteFiles(images);
            await Media.destroy({where: {postId: id}});
            await post.destroy();

            res.status(200).json({
                message: 'Post and associated media deleted successfully.'
            });
        } catch (e) {
            res.status(500).json({
                message: 'Internal server error',
                error: e.message,
            })
        }
    }
}