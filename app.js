import 'dotenv/config.js';
import './migration.js'
import morgan from 'morgan';
import express from 'express';

import indexRouter from './routes/index.js';

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use('/', indexRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
