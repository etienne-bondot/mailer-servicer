import cors from 'cors';
import express from 'express';
import 'dotenv/config';
import type {NextFunction, Request, Response} from 'express';

import Const from '~/const';
import routes from '~/routes';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/', routes);

// Catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new Error(Const.ERRORS.ROUTE_NOT_FOUND);
  // @ts-expect-error Property 'status' does not exist on type 'Error'.
  err.status = 404;
  next(err);
});

// Error handler
app.use((err: Error, req: Request, res: Response) => {
  console.log('forwarding', err);
  // @ts-expect-error Property 'status' does not exist on type 'Error'.
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
