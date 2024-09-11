import Posts from "../models/Posts.js";
import Media from "../models/Media.js";

export default {
    async create (req, res)  {
        try {
            const {description} = req.body;
            const {id} = req.user;
            const {files} = req;

            const post = await Posts.create({
                description,
                userId: id,
            });

            for (let file of files ) {
                const filePath = file.path.replace('public/', '') ;

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
    }
}