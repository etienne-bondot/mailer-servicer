import type {NextFunction, Request, Response} from 'express';
import {mailer} from '~/services/mailer';
import {handleError} from '~/utils/error';

import Const from '~/const';

const index = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const emailResponse = await mailer.send({
      subject: 'Subject',
      to: 'consulting@etiennebondot.com',
      template: 'testing-template',
      data: {
        link: 'http://fake-url.com',
        name: req.body.name,
        token: 'fake_token',
      },
    });

    if (emailResponse.success) {
      console.log({emailResponse: emailResponse.data, original: emailResponse.originalMessage});
      res.json({success: true});
    } else {
      console.error({emailResponse});
      return next(handleError(500, Const.ERRORS.UNKNOWN, emailResponse));
    }
  } catch (error) {
    console.error(error);
    return next(handleError(500, Const.ERRORS.UNKNOWN, error));
  }
};

export default {
  index,
};
