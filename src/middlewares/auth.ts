
import Koa from "koa";
import compose from "koa-compose";
import jwt from "koa-jwt";
import Response, { STATUS_CODES, STATUS_MESSAGE } from "../utils/response";
import { PROTECTED_OP } from "../utils/constants";

const auth = () => {
  return async (ctx: Koa.Context, next: Function) => {
    try {
      if (
        ctx.request.body &&
        ctx.request.body.operationName &&
        PROTECTED_OP.includes(ctx.request.body.operationName)
      ) {
        if (!ctx.state.user || ctx.state.jwtOriginalError) {
          return Response.unauthorized(ctx, STATUS_MESSAGE.UNAUTHORIZED);
        }
      }
      await next();
    } catch (err) {
      return Response.error(ctx, STATUS_CODES.INTERNAL_SERVER_ERROR, STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  };
};

export const authMiddleware = (jwt_options: jwt.Options) =>
  compose([jwt(jwt_options), auth()]);

