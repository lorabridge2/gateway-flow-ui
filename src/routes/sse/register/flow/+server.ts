import { client } from '$hook.server';
import { mappingFlowToUUID, mappingUUIDToFlow, sseClients } from '$lib/util.server.js';

export async function POST({ params, request }) {
    let { flow_id, uuid } = await request.json();
    // if uuid was already registered to a flow
    // remove old association
    if (uuid in mappingUUIDToFlow) {
        console.log("remove old association");
        delete mappingFlowToUUID[mappingUUIDToFlow[uuid]][uuid];
    }
    mappingUUIDToFlow[uuid] = flow_id;
    if (!(flow_id in mappingFlowToUUID)) {
        mappingFlowToUUID[flow_id] = {};
    }
    mappingFlowToUUID[flow_id][uuid] = sseClients[uuid];
    console.log("registered");
    return new Response(null, {
        status: 200
    });
}