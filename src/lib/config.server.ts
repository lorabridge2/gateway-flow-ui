import { env } from '$env/dynamic/private';

export const redisConfig = {
    host: env.REDIS_HOST ?? "localhost",
    port: env.REDIS_PORT ?? 6379,
    db: env.REDIS_DB ?? 0
}
    ;