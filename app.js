import YAML from 'yamljs';
import dotenv from 'dotenv'
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import authRouter  from './src/routes/auth.route';
import {checkJWT} from './src/middlewares/auth.middleware';
import locationsRouter  from './src/routes/location.route';
import {resourceNotFoundException} from './src//middlewares/error.middleware';


const swaggerDocument = YAML.load('./swagger.yaml');

dotenv.config();
mongoose.set('useCreateIndex', true);
mongoose.connect(
  process.env.NODE_ENV==='test' ?
  process.env.TEST_MONGO_DB_URI:
  process.env.MONGO_DB_URI,
  {useNewUrlParser: true });

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/auth', authRouter);
app.use('/locations', checkJWT, locationsRouter);

app.use(resourceNotFoundException);

export default app;
