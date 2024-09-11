import Users from './models/Users.js';
import Posts from './models/Posts.js';
import Media from './models/Media.js';

const models = [
    Users,
    Posts,
    Media,
];

(async () => {
    for (const model of models) {
        await model.sync({ alter: true });
        console.log(`${model.name} table created or updated`);
    }
})()

export default models;