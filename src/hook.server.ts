import { env } from '$env/dynamic/private';
// import { dev } from '$app/environment';
import { redisConfig } from '$lib/config.server';
// import { Level } from "level";
import { createClient, TimeSeriesAggregationType, type RedisClientOptions, type RedisClientType } from 'redis';
import { sseClients, sseMsgsClients, getDevices, rSep, rEventsPrefix, getSystemMessages, getUserMessages } from '$lib/util.server';
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

export const devices = await getDevices(client);

export const subscriber = client.duplicate()
    .on('error', err => console.error(err));
export const systemSubscriber = client.duplicate()
    .on('error', err => console.error(err))
export const userSubscriber = client.duplicate()
    .on('error', err => console.error(err));

console.log("messsages");
export let systemMessages = await getSystemMessages(client);
export let userMessages = await getUserMessages(client);
export let mergedMessages = [...systemMessages, ...userMessages].sort((a, b) => parseFloat(b.timestamp) - parseFloat(a.timestamp))

export const reloadMessages = async () => {
    systemMessages = await getSystemMessages(client);
    userMessages = await getUserMessages(client);
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