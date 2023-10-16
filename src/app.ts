import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';


const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//Dynamic routes
app.use('/', require('./routes'));

export default app;
