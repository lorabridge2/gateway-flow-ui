import { pushFlowTask } from '$lib/util.server.js';


export async function POST({ params, request }) {
    await pushFlowTask({ task: "deploy", flow: (await request.json()).payload });
    // console.log(`redis://${redisConfig.host}:${redisConfig.port}`);
    // const client = await createClient({
    //     url: `redis://${redisConfig.host}:${redisConfig.port}`
    // })
    //     .on('error', err => console.log('Redis Client Error', err))
    //     .connect();
    // const payload = (await request.json()).payload;
    // console.log(payload);
    // await client.lPush("lorabridge:flowman:flow-queue", JSON.stringify(payload));
    // await client.quit();
    // await mClient.publish('zigbee2mqtt/bridge/request/device/remove', JSON.stringify({ id: id }));
    // await mClient.publish(
    //     'zigbee2mqtt/bridge/request/device/remove',
    //     JSON.stringify({ id: id, force: true })
    // );

    console.log('flow deployed');
    return new Response(undefined);
}