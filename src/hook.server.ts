import { env } from '$env/dynamic/private';
// import { dev } from '$app/environment';
import { redisConfig } from '$lib/config.server';
import { Level } from "level";
import { createClient, type RedisClientOptions, type RedisClientType } from 'redis';
import { sseClients } from '$lib/util.server';
export const db = new Level<string, any>(env.DBPath ?? './db', { valueEncoding: 'json' });

export const client: RedisClientType = await createClient({
    url: `redis://${redisConfig.host}:${redisConfig.port}`
})
    .on('error', err => console.log('Redis Client Error', err))
    .connect();
const rPrefix = "lorabridge:devman";
const rSep = ":";
async function getDevices() {
    let devices: any = {};
    let lbIDToIeeeMapping = await client.hGetAll([rPrefix, "index:lb"].join(rSep));
    for (const [key, value] of Object.entries(lbIDToIeeeMapping)) {
        let name = await client.get([rPrefix, "device:name", key].join(rSep));
        let attributes = await client.sMembers([rPrefix, "device:attributes", key].join(rSep));
        devices[key] = { name: name, attributes: attributes, ieee: value, lb_id: key };
    }
    return devices;
};
export const devices = await getDevices();

export const subscriber = await client.duplicate()
    .on('error', err => console.error(err)).
    connect();

const listener = (message, channel) => {
    console.log("pubsub");
    console.log(message);
    for (let i = 0; i < sseClients.length; i++) {
        console.log("pubsub");
        console.log(message);
        let dev = JSON.parse(message);
        if (!(dev["lb_id"] in devices)) {
            devices[dev["lb_id"]] = dev;
        }
        sseClients[i]("message", message);
    }
};
await subscriber.subscribe('lorabridge:devman:device:notification', listener);