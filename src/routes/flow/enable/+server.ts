import { pushFlowTask } from '$lib/util.server.js';

export async function POST({ params, request }) {
    await pushFlowTask({ task: "enable", flow: (await request.json()).payload });
    console.log('flow enabled');
    return new Response(undefined);
}