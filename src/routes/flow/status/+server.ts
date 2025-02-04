import { client } from '$hook.server';
import { pushFlowTask } from '$lib/util.server.js';


export async function POST({ params, request }) {
    let flow_id = (await request.json()).flowId;
    let channel = `lorabridge:flowman:task:status:${flow_id}`
    console.log(channel);
    let tasks = await client.hGetAll(channel);
    let status = await client.zRangeByScoreWithScores(channel + ":msg", "-inf", "+inf");
    console.log('fetched status');
    return new Response(JSON.stringify({ tasks: tasks, status: status }), {
        headers: {
            'Content-Type': 'application/json'
        },
        status: 200
    });
}