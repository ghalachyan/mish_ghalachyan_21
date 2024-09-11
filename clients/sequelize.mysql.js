import Sequelize from 'sequelize';

const {
    DB_PORT,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_DATABASE,
} = process.env;

const dbConfig = {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false,
};

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, dbConfig);

( async () => {
    try {
        sequelize.authenticate().then(() => {
            console.log('Connection has been established successfully.');
        }).catch((e) => {
            console.error('Unable to connect to the database:', e);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

export default sequelize;