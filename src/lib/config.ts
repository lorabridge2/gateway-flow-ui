import { env } from '$env/dynamic/public';
import { env as envPrivate } from '$env/dynamic/private';

export const couchdb = {
    username: env.PUBLIC_COUCHDB_USER ?? "admin",
    password: env.PUBLIC_COUCHDB_PASSWORD ?? "couchdb",
    host: env.PUBLIC_COUCHDB_HOST ?? "localhost",
    port: env.PUBLIC_COUCHDB_PORT ?? 5984,
    db: env.PUBLIC_COUCHDB_DB ?? "mydb"
};

export const redisConfig = {
    host: envPrivate.REDIS_HOST ?? "localhost",
    port: envPrivate.REDIS_PORT ?? 6379,
    db: envPrivate.REDIS_DB ?? 0
}
    ;