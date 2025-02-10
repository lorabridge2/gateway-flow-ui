import { client } from '$hook.server';
import { mappingFlowToUUID, mappingUUIDToFlow, sseClients } from '$lib/util.server.js';

export async function POST({ params, request }) {
    let { flowId, uuid } = await request.json();
    // if uuid was already registered to a flow
    // remove old association
    if (uuid in mappingUUIDToFlow) {
        console.log("remove old association");
        delete mappingFlowToUUID[mappingUUIDToFlow[uuid]][uuid];
    }
    mappingUUIDToFlow[uuid] = flowId;
    if (!(flowId in mappingFlowToUUID)) {
        mappingFlowToUUID[flowId] = {};
    }
    mappingFlowToUUID[flowId][uuid] = sseClients[uuid];
    console.log(mappingFlowToUUID);
    console.log("registered");
    return new Response(null, {
        status: 200
    });
}