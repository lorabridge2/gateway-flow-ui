import { nanoid } from 'nanoid';
import { get, writable } from 'svelte/store';

export function getID() {
    let id;
    do {
        id = nanoid();
    } while (id.startsWith("_"))
    return id;
}
export function getRandomInt(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

export let db = writable();
export let syncDB = writable();
export let activeTab = writable();
export let edges = writable([]);
export let nodes = writable([]);
export let theme = writable("light");
export let back = writable(0);
export let forth = writable(0);
export let cancel = writable(0);
export let save = writable(0);

export let renameItem = writable();
export let delItem = writable();
export let showBack = writable();
export let showForth = writable();

export let closeMenues = writable(0);

export const saveState = async () => {
    let database = get(db);
    if (database) {
        console.log("save db");
        let doc = await database.get(get(activeTab));
        await database.put({
            ...doc,
            nodes: JSON.stringify(get(nodes)),
            edges: JSON.stringify(get(edges))
        });
    }
};

export let handleClass = "!w-3 !h-3 !border-2";