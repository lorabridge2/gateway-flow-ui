import { mergedMessages } from "$hook.server";

export function POST() {
    console.log("events");
    return new Response(JSON.stringify(mergedMessages));
}