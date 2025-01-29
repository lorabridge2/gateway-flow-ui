import { pushFlowTask } from '$lib/util.server.js';

export async function POST({ params, request }) {
    console.log("disable called");
    await pushFlowTask({ task: "disable", flow: (await request.json()).payload });
    console.log('flow disabled');
    return new Response(undefined);
}