import { client } from '$hook.server';
import { pushFlowTask } from '$lib/util.server.js';


export async function POST({ params, request }) {
    let timestamp = await client.get("lorabridge:connection:last_seen");

    console.log('fetched last_seen');
    return new Response(JSON.stringify({ last_seen: parseFloat(timestamp) }), {
        headers: {
            'Content-Type': 'application/json'
        },
        status: 200
    });
}