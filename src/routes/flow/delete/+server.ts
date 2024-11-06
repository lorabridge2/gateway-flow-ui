import { pushFlowTask } from '$lib/util.server.js';

export async function POST({ params, request }) {
    await pushFlowTask({ task: "delete", flow: (await request.json()).payload });
    console.log('flow deleted');
    return new Response(undefined);
}