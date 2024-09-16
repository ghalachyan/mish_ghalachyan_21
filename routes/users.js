import {query, Router} from 'express';
import usersSchema from '../schemas/users.js';
import validate from '../middleware/validate.js';
import uploadFile from "../middleware/uploadFile.js";
import checkToken from "../middleware/checkToken.js";
import controller from '../controllers/users.controller.js';

const router = Router();

router.post(
    '/registration',
    uploadFile('public/avatar').single('avatar'),
    validate(usersSchema.registration, 'body'),
    controller.registration
);

router.post(
    '/login',
    validate(usersSchema.login, 'body'),
    controller.login
);

router.post(
    '/recovery/password',
    checkToken,
    controller.passwordRecovery
)

router.post(
    '/follow/:followId',
    checkToken,
    validate(usersSchema.follow, 'params'),
    controller.followUser
)

router.put(
    '/update/password',
    checkToken,
    validate(usersSchema.updatePassword, 'body'),
    controller.passwordUpdate
)

router.get(
    '/profile',
    checkToken,
    controller.profile
);

router.get(
    '/activate',
    validate(usersSchema.activate, 'query'),
    controller.activate
)

router.get(
    '/posts',
    checkToken,
    controller.userPosts
)

router.get(
    '/followers',
    checkToken,
    validate(usersSchema.getFollowers, 'query'),
    controller.getFollowingUsers
)

router.delete(
    '/unfollow/:followId',
    checkToken,
    validate(usersSchema.unfollow, 'params'),
    controller.unfollowUser
)

export default router;