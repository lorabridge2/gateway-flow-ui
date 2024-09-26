import { env } from '$env/dynamic/public';

export const couchdb = {
    username: env.COUCHDB_USER ?? "admin",
    password: env.COUCHDB_PASSWORD ?? "couchdb",
    host: env.COUCHDB_HOST ?? "localhost",
    port: env.COUCHDB_PORT ?? 5984,
    db: env.COUCHDB_DB ?? "mydb"
};
