import {Router} from 'express';
import postsSchema from '../schemas/posts.js';
import validate from '../middleware/validate.js';
import uploadFile from "../middleware/uploadFile.js";
import checkToken from "../middleware/checkToken.js";
import controller from '../controllers/posts.controller.js';

const router = Router();

router.post(
    '/create',
    uploadFile('public/posts').array('images', 4),
    checkToken,
    validate(postsSchema.create, 'body'),
    controller.create
);

router.get(
    '/list',
    checkToken,
    validate(postsSchema.getPosts, 'query'),
    controller.getPosts
);

router.delete(
    '/delete/:id',
    checkToken,
    validate(postsSchema.delete, 'params'),
    controller.delete
)

export default router