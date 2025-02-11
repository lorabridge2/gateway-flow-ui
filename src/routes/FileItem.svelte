<script lang="ts">
	import { Button, Input, P } from 'flowbite-svelte';
	import {
		CircleMinusOutline,
		FileCopyOutline,
		PenOutline,
		TrashBinOutline
	} from 'flowbite-svelte-icons';
	import { inputClass } from 'flowbite-svelte/Radio.svelte';
	import { mount, onDestroy, onMount, unmount } from 'svelte';
	import { createClassComponent } from 'svelte/legacy';
	import PouchDB from 'pouchdb';
	import ItemContextMenu from './ItemContextMenu.svelte';
	import { renameItem, delItem, activeTab, syncDB, duplicateItem, getID, getName } from '$lib/util';
	import { get } from 'svelte/store';
	import { couchdb } from '$lib/config';
	interface Props {
		name: string;
		id: string;
		status_color: string;
	}
	let { name, id, status_color = 'bg-gray-500' }: Props = $props();
	// let label;
	let inputVal: string = $state('');
	let hidden = $state(true);
	let active = $state(false);

	let db;
	const duplicate = async (event) => {
		event?.preventDefault();
		event?.stopPropagation();
		if (!db) {
			return;
		}
		let newId = getID();
		let doc = await db.get(id);
		console.log(doc);
		await db.put({
			_id: newId,
			name: getName(),
			id: newId,
			edges: doc.edges,
			nodes: doc.nodes
		});
		activeTab.set(newId);
		duplicateItem.set(undefined);
	};
	const rename = async (event) => {
		hidden = !hidden;
		console.log('rename');
		if (inputVal) {
			name = inputVal;
			let doc = await db.get(id);
			console.log(doc);
			await db.put({
				_id: id,
				_rev: doc._rev,
				name: inputVal,
				id: id,
				edges: doc.edges,
				nodes: doc.nodes
			});
			inputVal = '';
		}
		event?.preventDefault();
		event?.stopPropagation();
		renameItem.set(undefined);
	};

	const del = async (event) => {
		event?.preventDefault();
		event?.stopPropagation();
		console.log('delete');

		let doc = await db.get(id);
		await db.remove(doc);

		let syncDoc = await get(syncDB).get(id);
		await get(syncDB).remove(syncDoc);

		fetch('flow/delete', {
			method: 'POST',
			body: JSON.stringify({ payload: doc }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
	};

	onMount(async () => {
		db = new PouchDB(couchdb.db);
	});

	// let status_color = $state('bg-gray-500'); //bg-green-500
	activeTab.subscribe((activeId) => {
		if (activeId === id) {
			active = true;
		} else {
			active = false;
		}
	});

	renameItem.subscribe((changedId) => {
		if (changedId === id) {
			rename(null);
		}
	});

	delItem.subscribe((removedId) => {
		if (removedId === id) {
			del(null);
		}
	});

	let dupUnsub = duplicateItem.subscribe((duplicateId) => {
		if (duplicateId === id) {
			console.log('dup id check ' + id);
			duplicate(null);
		}
	});

	// necessary because for some reasons duplicateItem handlers seem to be copied, when the item is duplicated
	// even though the id changes
	onDestroy(() => {
		dupUnsub();
	});

	const select = (event) => {
		// active = true;
		activeTab.set(id);
	};
	const enter = (event) => {
		switch (event.key) {
			case 'Enter':
				// Do something for "enter" or "return" key press.
				rename(null);
				break;
		}
	};
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div>
	<ItemContextMenu {id}>
		<div
			class="flex rounded border-2 {active
				? 'bg-gray-400 dark:bg-gray-500'
				: 'bg-gray-100 dark:bg-gray-800'}"
			on:click={select}
		>
			<span class="w-2 shrink-0 {status_color}"></span>
			<span class="flex w-full px-2 py-2">
				<P class="py-auto break-words overflow-hidden {!hidden ? ' hidden' : ''}">{name}</P>
				<Input
					class="h-1 w-[7rem] {hidden ? ' hidden' : ''}"
					placeholder={name}
					bind:value={inputVal}
					on:keydown={enter}
				></Input>
				<span dir="rtl" class="grid grid-cols-2 mb-auto ml-auto shrink-0">
					<Button class="ml-1 mr-0 h-6 w-5 border-0 px-0" outline on:click={rename}
						><PenOutline /></Button
					>
					<Button
						class="mr-0 h-6 w-5 border-0 px-0"
						outline
						on:click={duplicate}><FileCopyOutline /></Button
					>
					<Button class="h-6 w-5 border-0 px-0" color="red" on:click={del} outline
						><TrashBinOutline /></Button
					>
				</span>
			</span>
		</div>
	</ItemContextMenu>
</div>
