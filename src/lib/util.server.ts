import { createClient, type RedisClientType } from 'redis';
import { redisConfig } from '$lib/config.server';
import { building } from '$app/environment';

export const rPrefix = "lorabridge:devman";
export const rEventsPrefix = "lorabridge:events";
export const rSep = ":";

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

export async function getDevices(client: RedisClientType) {
    if (building) {
        return [];
    }
    let devices: any = {};
    let lbIDToIeeeMapping = await client.hGetAll([rPrefix, "index:lb"].join(rSep));
    for (const [key, value] of Object.entries(lbIDToIeeeMapping)) {
        let name = await client.get([rPrefix, "device:name", key].join(rSep));
        let attributes = await client.sMembers([rPrefix, "device:attributes", key].join(rSep));
        devices[key] = { name: name, attributes: attributes, ieee: value, lb_id: key };
    }
    return devices;
};

export async function getMessages(queue: string, client: RedisClientType) {
    if (building) {
        return [];
    }
    let msgIDs = [];
    let start = 0;
    let stop = start + 100 - 1;
    let res;
    let msgs = [];
    console.log([rEventsPrefix, queue, "msgs"].join(rSep));
    while ((res = await client.zRange([rEventsPrefix, queue, "msgs"].join(rSep), start, stop)).length === 100 || (start === 0 && res.length > 0)) {
        console.log("length of zRange " + res.length);
        start = stop + 1;
        stop = stop + 100;
        msgIDs = msgIDs.concat(res);
    }

    for (let index = 0; index < msgIDs.length; index++) {
        let msg = await client.hGetAll([rEventsPrefix, queue, msgIDs[index]].join(rSep));
        msg.type = queue;
        msgs.push(msg);
    }
    console.log(msgs);
    return msgs;
}

export async function getSystemMessages(client: RedisClientType) {
    return await getMessages("system", client);
}

export async function getUserMessages(client: RedisClientType) {
    return await getMessages("user", client);
}

export const sseClients: any = [];
export const sseMsgsClients: any = [];
export const sseStatusClients: any = {};