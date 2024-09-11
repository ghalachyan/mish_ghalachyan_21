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


export default router