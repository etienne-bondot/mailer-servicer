import {Router} from 'express';

import HealthcheckRouter from '~/controllers/healthcheck/routes';
import TestRouter from '~/controllers/test/routes';

const routes = Router();

routes.use('/healthcheck', HealthcheckRouter);
routes.use('/test', TestRouter);

export default routes;
