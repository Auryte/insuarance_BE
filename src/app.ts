import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import swaggerSpec from 'config/swaggerJSDoc';
import { globalErrorHandler } from 'middlewares/globalErrorHandler';
import unless from 'middlewares/exceptionWrapper';
import tokenAuth from 'middlewares/tokenAuth';
import userRouter from 'routes/user';
import employerRouter from 'routes/employer';
import claimRouter from 'routes/claim';
import imageRouter from 'routes/image';

// Start express app
const app: Application = express();

// Enable CORS
app.use(cors());

// Setup logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Setup body parser
app.use(express.json());

// Setup documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Setup authorization middleware
app.use(unless(['/', '/users/login'], tokenAuth));

// Setup routes
app.use('/users', userRouter);
app.use('/employers', employerRouter);
app.use('/claims', claimRouter);
app.use('/image', imageRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world!');
});

// Handle global errors
app.use(globalErrorHandler);

export default app;
