import { Context } from "koa";
import { AuthenticationError } from "apollo-server-koa";

/**
 * HTTP Status codes
 */
export const STATUS_CODES = {
  CONTINUE: 100,
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  NOT_ACCEPTABLE: 406,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  REQUEST_ENTITY_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

/**
 * HTTP Status message
 */
export const STATUS_MESSAGE = {
  UNAUTHORIZED: 'Authentication Error',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
};

/**
 * Utility Class to easily make Graphql Errors Response
 */
export default class Response {
  static get STATUS_CODES() {
    return STATUS_CODES;
  }

  static error(ctx: Context, statusCode: number, message: string) {
    ctx.status = statusCode || ctx.status;
    if (ctx.status < 500) {
      ctx.status = this.STATUS_CODES.INTERNAL_SERVER_ERROR;
    }
    throw new AuthenticationError(message);
  }

  static unauthorized(ctx: Context, message: string) {
    ctx.status = this.STATUS_CODES.UNAUTHORIZED;
    throw new AuthenticationError(message);
  }
}
