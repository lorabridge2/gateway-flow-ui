import { produce } from 'sveltekit-sse'
import { sseClients } from '$lib/util.server'
import { client, devices } from "$hook.server";

export function POST() {
    console.log("test");
    return new Response(JSON.stringify(devices));
}