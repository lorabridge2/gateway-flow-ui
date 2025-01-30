import { pushFlowTask } from '$lib/util.server.js';
import { client, reloadMessages } from "$hook.server";
import { rSep, rEventsPrefix } from '$lib/util.server.js';
export async function POST({ params, request }) {
    // let req = await request.json();
    // await pushFlowTask({ task: "delete", flow: (await request.json()).payload });
    // console.log('flow deleted');

    let sysIDs = await client.zRangeByScore([rEventsPrefix, "system", "msgs"].join(rSep), 0, "+inf");
    client.del([rEventsPrefix, "system", "msgs"].join(rSep));
    let userIDs = await client.zRangeByScore([rEventsPrefix, "user", "msgs"].join(rSep), 0, "+inf");
    client.del([rEventsPrefix, "user", "msgs"].join(rSep));

    for (let index = 0; index < sysIDs.length; index++) {
        client.del([rEventsPrefix, "system", sysIDs[index]]);
    }
    for (let index = 0; index < userIDs.length; index++) {
        client.del([rEventsPrefix, "user", userIDs[index]]);
    }
    await reloadMessages();
    return new Response(undefined);
}