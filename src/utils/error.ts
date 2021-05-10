import Const from '~/const';

export const handleError = (status: number, message: string, errorStackTrace?: unknown): Error => {
  const {DEBUG, NODE_ENV} = process.env;
  if (DEBUG || NODE_ENV !== 'test') {
    console.error(status, message, errorStackTrace || '');
  }
  const error = new Error(message ? message : Const.ERRORS.UNKNOWN);
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'status' does not exist on type 'Error'.
  error.status = status;

  console.log('API- handleError', {error, errorMsg: error.message});
  return error;
};
