import type {Request, Response} from 'express';

const index = (req: Request, res: Response): void => {
  res.status(200).json({success: true});
};

export default {
  index,
};
