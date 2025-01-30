import { pushFlowTask } from '$lib/util.server.js';
import { client, mergedMessages, systemMessages, userMessages } from "$hook.server";
import { rSep,rEventsPrefix } from '$lib/util.server.js';
export async function POST({ params, request }) {
    let req = await request.json();
    // await pushFlowTask({ task: "delete", flow: (await request.json()).payload });
    // console.log('flow deleted');

    client.zRem([rEventsPrefix, req.type, "msgs"].join(rSep), req.id)
    client.del([rEventsPrefix, req.type, req.id].join(rSep))
    let delIndex;
    console.log("delete");
    console.log(req);
    console.log(req.type);
    switch (req.type) {
        case "user":
            delIndex = userMessages.findIndex((msg) => msg.id == req.id);
            if (delIndex > -1) {
                userMessages.splice(delIndex, 1);
            }
            break;
        case "system":
            delIndex = systemMessages.findIndex((msg) => msg.id == req.id);
            if (delIndex > -1) {
                systemMessages.splice(delIndex, 1);
            }
            break;
    }
    delIndex = mergedMessages.findIndex((msg) => msg.id == req.id);
    if (delIndex > -1) {
        mergedMessages.splice(delIndex, 1);
    }
    return new Response(undefined);
}