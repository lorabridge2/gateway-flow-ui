import { produce } from 'sveltekit-sse'
import { sseMsgsClients } from '$lib/util.server'

export function POST() {
    return new Response(null, { status: 410 });
    console.log("test");
    return produce(async function start({ emit }) {
        console.log("emit");
        sseMsgsClients.push(emit);
        console.log("emitted");
    })
}