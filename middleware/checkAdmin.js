import Users from '../models/Users.js';

const checkAdmin = async (req, res, next) => {
    try {
        const user = req.user;
        const userExists = await Users.findByPk(user.id);

        if (!user) {
            res.status(401).send({
                message: 'Unauthorized: User is not authenticated',
            });
            return;
        }

        if (!userExists || userExists.type !== 'admin') {
            res.status(403).send({
                message: 'Forbidden: User does not have admin privileges'
            })
            return;
        }

        next();

    } catch (e) {
        console.error('Error in checkAdmin middleware:', e);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

export default checkAdmin;