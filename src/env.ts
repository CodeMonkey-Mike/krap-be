const processEnv = () => {
  const { env } = process;
  process.env.TYPEORM_CONNECTION = env.TYPEORM_CONNECTION || "postgres";
  process.env.TYPEORM_HOST = env.TYPEORM_HOST || "127.0.0.1";
  process.env.TYPEORM_PORT = env.TYPEORM_PORT || "5432";
  process.env.TYPEORM_ENTITIES =
    env.TYPEORM_ENTITIES || "dist/db/entities/*.entity{.ts,.js}";
  process.env.TYPEORM_MIGRATIONS =
    env.TYPEORM_MIGRATIONS || "dist/db/migrations/*{.ts,.js}";
  process.env.TYPEORM_MIGRATIONS_RUN =
    env.TYPEORM_MIGRATIONS_RUN || "dist/db/migrations";
  process.env.TYPEORM_MIGRATIONS_DIR =
    env.TYPEORM_MIGRATIONS_DIR || "dist/db/migrations";
  process.env.TYPEORM_ENTITIES_DIR =
    env.TYPEORM_ENTITIES_DIR || "dist/db/entities";
  process.env.TYPEORM_SEEDING_SEEDS =
    env.TYPEORM_SEEDING_SEEDS || "dist/db/seeds/*{.ts,.js}";
  process.env.HTTP_PORT = env.HTTP_PORT || "4000";
  process.env.DOMAIN = env.DOMAIN || "localhost";
  process.env.SESSION_SECRET =
    env.SESSION_SECRET || "qowiueojwojfalksdjoqiwueo";
  process.env.REMEMBER_ME_DURATION = env.REMEMBER_ME_DURATION || "365";
  process.env.NOT_REMEMBER_ME_DURATION = env.NOT_REMEMBER_ME_DURATION || "5";
  process.env.TYPEORM_USERNAME = env.TYPEORM_USERNAME || "postgres";
  process.env.TYPEORM_PASSWORD = env.TYPEORM_PASSWORD || "123456";
  process.env.TYPEORM_DATABASE = env.TYPEORM_DATABASE || "krapstack";
};

export default processEnv;
