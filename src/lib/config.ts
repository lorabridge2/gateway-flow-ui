import { env } from '$env/dynamic/public';

export const couchdb = {
    username: env.PUBLIC_COUCHDB_USER ?? "admin",
    password: env.PUBLIC_COUCHDB_PASSWORD ?? "couchdb",
    host: env.PUBLIC_COUCHDB_HOST ?? null,
    port: env.PUBLIC_COUCHDB_PORT ?? 5984,
    db: env.PUBLIC_COUCHDB_DB ?? "mydb",
    scheme: env.PUBLIC_COUCHDB_SCHEME ?? 'http',
};
