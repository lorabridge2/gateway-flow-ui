import { createClient } from 'redis';



export async function POST({ params, request }) {
    const client = await createClient({
        url: 'redis://127.0.0.1:6379'
    })
        .on('error', err => console.log('Redis Client Error', err))
        .connect();
    const payload = (await request.json()).payload;
    console.log(payload);
    await client.lPush("lorabridge:flowman:flow-queue", JSON.stringify(payload));
    await client.quit();
    // await mClient.publish('zigbee2mqtt/bridge/request/device/remove', JSON.stringify({ id: id }));
    // await mClient.publish(
    //     'zigbee2mqtt/bridge/request/device/remove',
    //     JSON.stringify({ id: id, force: true })
    // );

    console.log('flow deployed');
    return new Response(undefined);
}