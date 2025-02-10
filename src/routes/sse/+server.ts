import { produce } from 'sveltekit-sse'
import { mappingFlowToUUID, mappingUUIDToFlow, sseClients } from '$lib/util.server'
import { SSEEvents } from '$lib/util.js';

export function POST() {
    let clientId = crypto.randomUUID();
    return produce(async function start({ emit }) {
        console.log("sse connected");
        sseClients[clientId] = emit;
        emit(SSEEvents.REGISTERED, JSON.stringify({ uuid: clientId }))
    }, {
        stop() {
            console.log("client disconnected");
            delete sseClients[clientId];
            if (clientId in mappingUUIDToFlow) {
                delete mappingFlowToUUID[mappingUUIDToFlow[clientId]][clientId];
                delete mappingUUIDToFlow[clientId];
            }
        }
    })
}