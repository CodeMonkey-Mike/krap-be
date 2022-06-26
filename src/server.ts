import "reflect-metadata";
import dotenv from "dotenv";
import processEnv from "./env";
dotenv.config();
processEnv();

import Koa, { Context } from "koa";
import jwtDecode from "jwt-decode";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-koa";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user/resolver";
import { authMiddleware } from "./middlewares/auth";
import config from "./utils/ormconfig";


const app = new Koa();
const path = "/graphql";
const PORT = process.env.HTTP_PORT || 4000;
app.keys = [process.env.SESSION_SECRET || "jwt_secret"];
app.proxy = true;
const isProd = process.env.NODE_ENV === "production" ? true : false;
const JWT_SECRET = process.env.SESSION_SECRET || "jwt_secret";
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
    
    const corsOptions = {
      credentials: true,
    };
    app.use(cors(corsOptions));
    app.use(bodyParser());
    app.use(
      authMiddleware({ secret: JWT_SECRET, passthrough: true, debug: true })
    );
    const apolloServer = new ApolloServer({
      schema,
      introspection: true,
      playground: !isProd,
      tracing: true,
      uploads: false,
      context: ({ ctx }: Context) => {
        const token = ctx.headers.authorization || "";
        if (!token) {
          return { ctx, user: null };
        }
        const user = jwtDecode(token);
        return {
          ctx,
          user,
        }
      },
    });
    apolloServer.applyMiddleware({ app, path, bodyParserConfig: true });
    app.listen(PORT, () => {
      console.log(`🚀 started at ${PORT}`);
    });
  } catch (error) {
    throw new Error(error);
  }
};

main();
