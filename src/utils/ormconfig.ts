import { ConnectionOptions } from "typeorm";
import path from "path";
import {
  HOST,
  PORT,
  USERNAME,
  PASSWORD,
  DATABASE,
  ENTITIES,
  MIGRATIONS,
  MIGRATIONS_DIR,
} from "./constants";

const config: ConnectionOptions = {
  type: "postgres",
  host: String(HOST),
  port: Number(PORT),
  username: String(USERNAME),
  password: String(PASSWORD),
  database: String(DATABASE),
  logging: false,
  synchronize: false,
  migrationsRun: false,
  entities: [ENTITIES || ""],
  migrations: [MIGRATIONS || ""],
  cli: {
    migrationsDir: path.join(__dirname, "./" + MIGRATIONS_DIR),
  },
};
export default config;
