export const HOST = process.env.TYPEORM_HOST
  ? process.env.TYPEORM_HOST
  : "localhost";
export const PORT = process.env.TYPEORM_PORT ? +process.env.TYPEORM_PORT : 5432;
export const USERNAME = process.env.TYPEORM_USERNAME
  ? process.env.TYPEORM_USERNAME
  : "";
export const PASSWORD = process.env.TYPEORM_PASSWORD
  ? process.env.TYPEORM_PASSWORD
  : "";
export const DATABASE = process.env.TYPEORM_DATABASE
  ? process.env.TYPEORM_DATABASE
  : "krap_ps_df";
export const ENTITIES =
  process.env.NODE_ENV === "development"
    ? "src/db/entities/*.entity{.ts,.js}"
    : process.env.TYPEORM_ENTITIES;
export const MIGRATIONS =
  process.env.NODE_ENV === "development"
    ? "src/db/migrations/*{.ts,.js}"
    : process.env.TYPEORM_MIGRATIONS;
export const MIGRATIONS_DIR =
  process.env.NODE_ENV === "development"
    ? "src/db/migrations/"
    : process.env.TYPEORM_MIGRATIONS_DIR;

export const PROTECTED_OP = [
  "getUser",
];