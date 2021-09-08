import "reflect-metadata";
import dotenv from "dotenv";
import Koa, { Context } from "koa";
import session from "koa-session";
import cors from "@koa/cors";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-koa";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user/resolver";
import config from "./utils/ormconfig";

dotenv.config();

const app = new Koa();
const path = "/graphql";
const PORT = process.env.HTTP_PORT || 4000;
app.keys = [process.env.SESSION_SECRET || ''];

const SESSION_CONFIG: Partial<session.opts> = {
  key: "koa:sess",
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: true,
  renew: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
};

const main = async () => { 
  try {
    const connection = await createConnection(config);
    if (connection.isConnected) {
      console.log("DB connecting!");
      await connection.runMigrations();
    } else {
      console.log("Error connecting DB!");
    }
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
      uploads: false,
      context: ({ ctx }: Context) => ({
        ctx,
        session: ctx.session,
      }),
    });
    apolloServer.applyMiddleware({ app, path, bodyParserConfig: true });  
    app.listen(PORT, () => {
      console.log(`🚀 started at ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    console.log(error.message);
  }
};

main();
