import { produce } from 'sveltekit-sse'
import { sseStatusClients } from '$lib/util.server'
import { client, subscriber } from '$hook.server';

export async function POST({ params, request }) {
    return new Response(null, { status: 410 });
    console.log("slug " + params.slug);
    let flowId = params.slug;
    // let flowId = (await request.json()).flowId;
    // console.log(flowId);
    console.log("test");
    let clientId = crypto.randomUUID();
    return produce(async function start({ emit }) {
        console.log(flowId);
        if (!(flowId in sseStatusClients)) {
            sseStatusClients[flowId] = {};
        }
        console.log("emit");
        sseStatusClients[flowId][clientId] = emit;
        console.log("emitted");
    }, {
        stop() {
            console.log("client disconnected");
            console.log(flowId);
            delete sseStatusClients[flowId][clientId];
        }
    })
}