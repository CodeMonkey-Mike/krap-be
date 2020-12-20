import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import Koa, { Context } from "koa";
import session from "koa-session";
import cors from "@koa/cors";
import redisStore from "koa-redis";
import { ApolloServer } from "apollo-server-koa";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user/resolver";
import { createConnection } from "typeorm";
import config from "./utils/ormconfig"; 

const app = new Koa();
const path = "/graphql";
const PORT = process.env.HTTP_PORT || 4000;
app.keys = [process.env.SESSION_SECRET||'qowiueojwojfalksdjoqiwueo'];
const redis = redisStore({
  url: process.env.REDIS_URL
})
const SESSION_CONFIG:any = {
  key: 'koa:sess',
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  store: redis,
  overwrite: true, 
  httpOnly: true,
  signed: true, 
  rolling: true,
  renew: false,
  secure: process.env.NODE_ENV === 'production' ? true : false,
  sameSite: 'none',
};

const main = async () => { 
  try {
    const connection = await createConnection(config);
    await connection.runMigrations();
    console.log('DB connecting!');
    const schema = await buildSchema({
      resolvers: [UserResolver],
    }); 
    
    // Enable cors with default options
    const corsOptions = {
      credentials: true,
    };
    app.use(cors(corsOptions));
    app.use(session(SESSION_CONFIG, app));
    const apolloServer = new ApolloServer({
      schema,
      introspection: true,
      playground: true,
      tracing: true,
      context: ({ctx}: Context) => ({
        ctx,
        session: ctx.session,
        redis
      }),
    });
    apolloServer.applyMiddleware({ app, path, bodyParserConfig: true });  
    app.listen(PORT, () => {
      console.log(`🚀 started http://localhost:${PORT}${path}`);
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

main();
