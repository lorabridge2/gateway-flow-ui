import { devices } from "$hook.server";

export function POST() {
    console.log("devices");
    return new Response(JSON.stringify(devices));
}