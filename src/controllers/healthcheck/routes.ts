import {Router} from 'express';

import HealthcheckController from '.';

const routes = Router();

routes.get('/', HealthcheckController.index);

export default routes;
