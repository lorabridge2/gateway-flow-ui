import { createClient } from 'redis';
import { redisConfig } from '$lib/config.server';

export async function pushFlowTask(task) {
    console.log(`redis://${redisConfig.host}:${redisConfig.port}`);
    const client = await createClient({
        url: `redis://${redisConfig.host}:${redisConfig.port}`
    })
        .on('error', err => console.log('Redis Client Error', err))
        .connect();
    // const payload = (await request.json()).payload;
    console.log(task);
    await client.lPush("lorabridge:flowman:flow-queue", JSON.stringify(task));
    await client.quit();
}

export const sseClients:any = [];
export const sseMsgsClients: any = [];