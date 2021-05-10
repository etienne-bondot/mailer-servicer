import {Router} from 'express';

import TestController from '.';

const routes = Router();

routes.post('/', TestController.index);

export default routes;
