import { env } from '$env/dynamic/private';
// import { dev } from '$app/environment';
import { redisConfig } from '$lib/config.server';
// import { Level } from "level";
import { createClient, TimeSeriesAggregationType, type RedisClientOptions, type RedisClientType } from 'redis';
import { sseClients, sseMsgsClients } from '$lib/util.server';
import { building } from '$app/environment';
import { json } from '@sveltejs/kit';
// export const db = new Level<string, any>(env.DBPath ?? './db', { valueEncoding: 'json' });

export const client: RedisClientType = createClient({
    url: `redis://${redisConfig.host}:${redisConfig.port}`
})
    .on('error', err => console.log('Redis Client Error', err));

if (!building) {
    await client.connect();
}
const rPrefix = "lorabridge:devman";
export const rEventsPrefix = "lorabridge:events"
export const rSep = ":";
async function getDevices() {
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
export const devices = await getDevices();

export const subscriber = client.duplicate()
    .on('error', err => console.error(err));
export const systemSubscriber = client.duplicate()
    .on('error', err => console.error(err))
export const userSubscriber = client.duplicate()
    .on('error', err => console.error(err));

async function getMessages(queue: string) {
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

async function getSystemMessages() {
    return await getMessages("system");
}

async function getUserMessages() {
    return await getMessages("user");
}

console.log("messsages");
export let systemMessages = await getSystemMessages();
export let userMessages = await getUserMessages();
export let mergedMessages = [...systemMessages, ...userMessages].sort((a, b) => parseFloat(b.timestamp) - parseFloat(a.timestamp) )

export const reloadMessages = async () => {
    systemMessages = await getSystemMessages();
    userMessages = await getUserMessages();
    mergedMessages = [...systemMessages, ...userMessages].sort((a, b) => parseFloat(a.timestamp) - parseFloat(b.timestamp))
};

if (!building) {
    // handle devices
    subscriber.connect();

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

    // handle events
    systemSubscriber.connect();
    userSubscriber.connect();
    const systemMsgsListener = async (message, channel) => {
        console.log(message);
        console.log(channel);
        let startIndex = 0;
        if (systemMessages.length > 0) {
            console.log(systemMessages[systemMessages.length - 1]);
            console.log(systemMessages[systemMessages.length - 1].timestamp);
            console.log(parseFloat(systemMessages[systemMessages.length - 1].timestamp) + .1);
            startIndex = parseFloat(systemMessages[systemMessages.length - 1].timestamp) + .1;
        }
        let newMsgs = await client.zRangeByScore([rEventsPrefix, "system", "msgs"].join(rSep), startIndex, "+inf")
        let msgs = [];
        console.log(newMsgs);
        for (let index = 0; index < newMsgs.length; index++) {
            let msg = await client.hGetAll([rEventsPrefix, "system", newMsgs[index]].join(rSep));
            msg.type = "system";
            systemMessages.push(msg);
            mergedMessages.unshift(msg);
            for (let i = 0; i < sseMsgsClients.length; i++) {
                sseMsgsClients[i]("message", JSON.stringify(msg));
                console.log("message");
            }
            // msgs.push(msg);
        }

    };

    const userMsgsListener = async (message, channel) => {
        console.log(message);
        console.log(channel);
        let startIndex = 0;
        if (userMessages.length > 0) {
            console.log(userMessages[userMessages.length - 1]);
            console.log(userMessages[userMessages.length - 1].timestamp);
            console.log(parseFloat(userMessages[userMessages.length - 1].timestamp) + .1);
            startIndex = parseFloat(userMessages[userMessages.length - 1].timestamp) + .1;
        }
        let newMsgs = await client.zRangeByScore([rEventsPrefix, "user", "msgs"].join(rSep), startIndex, "+inf")
        let msgs = [];
        console.log(newMsgs);
        for (let index = 0; index < newMsgs.length; index++) {
            let msg = await client.hGetAll([rEventsPrefix, "user", newMsgs[index]].join(rSep));
            msg.type = "user";
            userMessages.push(msg);
            mergedMessages.unshift(msg);
            for (let i = 0; i < sseMsgsClients.length; i++) {
                sseMsgsClients[i]("message", JSON.stringify(msg))
            }
            // msgs.push(msg);
        }

    };
    await systemSubscriber.subscribe("__keyspace@0__:" + [rEventsPrefix, "system", "msgs"].join(rSep), systemMsgsListener)
    await userSubscriber.subscribe("__keyspace@0__:" + [rEventsPrefix, "user", "msgs"].join(rSep), userMsgsListener)
}