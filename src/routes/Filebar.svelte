<script lang="ts" context="module">
	// export let fileItems = writable(Array());
</script>

<script lang="ts">
	import PouchDB from 'pouchdb';
	let db;
	// let fileItems = [];
	let fileDict = {};
	let revisions = [];
	let cur_rev = '';
	// let syncItems = [];
	import { randomNoun, randomAdjective, randomAdverb, randomUser, leet } from '$lib/names';
	import {
		SvelteFlow,
		Controls,
		Background,
		BackgroundVariant,
		MiniMap,
		useSvelteFlow,
		type Node,
		useNodes,
		useEdges
	} from '@xyflow/svelte';
	import {
		edges,
		nodes,
		back,
		forth,
		showBack,
		showForth,
		cancel,
		save,
		activeTab,
		syncDB,
		getName
	} from '$lib/util';
	onMount(() => {
		console.log('ONMOUNT');
		db = new PouchDB(couchdb.db);
		db.allDocs({ include_docs: true, descending: true }).then(async (docs) => {
			// console.log(docs);
			// fileItems = docs.rows.map((item) => {
			// 	return item.doc;
			// });
			// let tmp = [];
			if (docs.total_rows == 0) {
				let id = getID();
				db.put({ _id: id, name: getName(), id: id });
			}
			let tmp = {};
			for (let i = 0; i < docs.rows.length; i++) {
				try {
					let doc = await get(syncDB).get(docs.rows[i].doc._id);
					if (doc.rev === docs.rows[i].doc._rev) {
						docs.rows[i].doc['color'] = 'bg-green-400';
					} else {
						docs.rows[i].doc['color'] = 'bg-yellow-400';
					}
					console.log(await get(syncDB).get(docs.rows[i].doc._id));
				} catch (err) {
					// console.log('s');
					docs.rows[i].doc['color'] = 'bg-red-400';
				}
				// tmp.push(docs.rows[i].doc);
				tmp[docs.rows[i].doc._id] = docs.rows[i].doc;
				// console.log(tmp);
			}
			//trigger svelte reactivity only once
			fileDict = tmp;

			// console.log('dict');
			// console.log(fileDict);
			// fileItems = tmp;
			// if (fileItems.length > 0) {
			// 	activeTab.set(localStorage.getItem('lastOpened') ?? fileItems[0]?.id);
			// }
			if (Object.keys(fileDict).length > 0) {
				activeTab.set(localStorage.getItem('lastOpened') ?? fileDict[Object.keys(fileDict)[0]]?.id);
			}
			// fileItems.set(
			// 	docs.rows.map((item) => {
			// 		return item.doc;
			// 	})
			// );
		});
		const changes = db
			.changes({
				since: 'now',
				live: true,
				include_docs: true
			})
			.on('change', function (change) {
				console.log('change');
				console.log(change);
				// handle change
				//   console.log(change);
				db.allDocs({ include_docs: true, descending: true }).then(async (docs) => {
					// console.log(docs);
					let tab = get(activeTab);
					if (change.deleted && docs.total_rows == 0) {
						let id = getID();
						db.put({ _id: id, name: getName(), id: id });
					} else if (change.deleted && change.id === tab) {
						let fileItems = Object.values(fileDict);
						for (let i = 0; i < fileItems.length; i++) {
							if (fileItems[i].id === tab) {
								if (i === fileItems.length - 1) {
									activeTab.set(fileItems[i - 1].id);
								} else {
									activeTab.set(fileItems[i + 1].id);
								}
								break;
							}
						}
					}
					// fileItems = docs.rows.map((item) => {
					// 	return item.doc;
					// });

					if (change.deleted) {
						delete fileDict[change.id];
						//trigger svelte reactivity
						fileDict = fileDict;
					} else {
						fileDict[change.id] = {
							...fileDict[change.id],
							...{ color: fileDict[change.id] === undefined ? 'bg-red-400' : 'bg-yellow-400' },
							...change.doc
						};
					}
					console.log('change22');
					console.log(change);
					console.log(fileDict);
					// let tmp = [];
					for (let i = 0; i < docs.rows.length; i++) {
						try {
							let doc = await get(syncDB).get(docs.rows[i].doc._id);
							// console.log(docs.rows[i].doc.name);
							if (doc.rev === docs.rows[i].doc._rev) {
								docs.rows[i].doc['color'] = 'bg-green-400';
							} else {
								// console.log(docs.rows[i].doc.name);
								// if(docs.rows[i].doc.name==="punked ChromeHunter"){
								// console.log(doc.rev);
								// console.log(docs.rows[i].doc._rev);}
								docs.rows[i].doc['color'] = 'bg-yellow-400';
							}
							console.log(await get(syncDB).get(docs.rows[i].doc._id));
						} catch (err) {
							// console.log('s');
							docs.rows[i].doc['color'] = 'bg-red-400';
						}
						// tmp.push(docs.rows[i].doc);
						// console.log(tmp);
					}
					// fileItems = tmp;

					if (Object.keys(fileDict).length === 1) {
						activeTab.set(Object.keys(fileDict)[0]);
					}

					let doc = await db.get(get(activeTab), { revs_info: true });
					revisions = doc._revs_info;
					cur_rev = revisions[0].rev;
					showForth.set(false);
					showBack.set(revisions.length > 1);

					// fileItems.set(
					// 	docs.rows.map((item) => {
					// 		return item.doc;
					// 	})
					// );
				});
			})
			.on('complete', function (info) {
				// changes() was canceled
			})
			.on('error', function (err) {
				console.log(err);
			});

		const syncChanges = get(syncDB)
			.changes({
				since: 'now',
				live: true,
				include_docs: true
			})
			.on('change', function (change) {
				console.log('yolo');
				console.log(change);
				if (change.id in fileDict) {
					fileDict[change.id].color = 'bg-green-400';
				}
				// for (let i = 0; i < fileItems.length; i++) {
				// 	if (fileItems[i].id === change.id) {
				// 		if (change.rev === fileItems[i]._rev) {
				// 			fileItems[i].color = 'bg-green-400';
				// 		} else {
				// 			fileItems[i].color = 'bg-yellow-400';
				// 		}
				// 		break;
				// 	}
				// }
			});

		activeTab.subscribe(async (value) => {
			console.log(value);
			if (value) {
				let doc = await db.get(value, { revs_info: true });
				revisions = doc._revs_info;
				cur_rev = revisions[0].rev;
				console.log(revisions);
				nodes.set(JSON.parse(doc.nodes ?? '[]'));
				edges.set(JSON.parse(doc.edges ?? '[]'));
				showForth.set(false);
				if (revisions.length <= 1) {
					showBack.set(false);
				} else {
					showBack.set(true);
				}
				localStorage.setItem('lastOpened', value);
			}
		});

		cancel.subscribe(async (value) => {
			let doc = await db.get(get(activeTab));
			cur_rev = revisions[0].rev;
			nodes.set(JSON.parse(doc.nodes ?? '[]'));
			edges.set(JSON.parse(doc.edges ?? '[]'));
			showBack.set(true);
			showForth.set(false);
		});

		save.subscribe(async (value) => {
			let doc = await db.get(get(activeTab));
			await db.put({
				...doc,
				nodes: JSON.stringify(get(nodes)),
				edges: JSON.stringify(get(edges))
			});
		});

		back.subscribe(async (value) => {
			if (revisions.length > 0) {
				let index = revisions.findIndex((x) => x.rev === cur_rev) + 1;
				if (index < revisions.length) {
					cur_rev = revisions[index].rev;
					let doc = await db.get(get(activeTab), { rev: cur_rev });
					nodes.set(JSON.parse(doc.nodes ?? '[]'));
					edges.set(JSON.parse(doc.edges ?? '[]'));
					showForth.set(true);
					console.log(cur_rev);
					if (index == revisions.length - 1) {
						showBack.set(false);
					}
				}
				// else {
				// 	showBack.set(false);
				// }
			}
		});

		forth.subscribe(async (value) => {
			if (revisions.length > 0) {
				let index = revisions.findIndex((x) => x.rev === cur_rev) - 1;
				if (index >= 0) {
					cur_rev = revisions[index].rev;
					let doc = await db.get(get(activeTab), { rev: cur_rev });
					nodes.set(JSON.parse(doc.nodes ?? '[]'));
					edges.set(JSON.parse(doc.edges ?? '[]'));
					showBack.set(true);
					if (index == 0) {
						showForth.set(false);
					}
				}
				//  else {
				// 		showForth.set(false);
				// 	}
			}
		});
	});

	import {
		Sidebar,
		SidebarDropdownWrapper,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper,
		Button,
		ButtonGroup,
		Hr
	} from 'flowbite-svelte';
	import { getID } from '$lib/util';
	import {
		CircleMinusOutline,
		CirclePlusOutline,
		FileCirclePlusOutline
	} from 'flowbite-svelte-icons';
	import { get, writable } from 'svelte/store';
	import { Badge, Heading, P, TabItem, Tabs } from 'flowbite-svelte';
	import FileItem from './FileItem.svelte';
	import { onMount } from 'svelte';
	import { couchdb } from '$lib/config';
	let fileItemCount = 17;
	// let entries = [];
	// fileItems.subscribe((value) => {
	// 	entries = value;
	// });
	// for (let index = 0; index < 17; index++) {
	// 	fileItems.update((arr) => {
	// 		arr.push({ name: nanoid(), id: nanoid() });
	// 		console.log(arr.length);
	// 		return arr;
	// 	});
	// }
	const onDragStart = (event: DragEvent, nodeType: string) => {
		if (!event.dataTransfer) {
			return null;
		}

		event.dataTransfer.setData('application/svelteflow', nodeType);
		event.dataTransfer.setData('application/svelteflow/name', event.currentTarget.innerText);
		event.dataTransfer.effectAllowed = 'move';
	};

	const addEntry = (event) => {
		// let name = [randomAdjective(), randomUser()].join(' ');
		let name = getName();
		let id = getID();
		// let id = Date.now().toString();
		db.put({ name: name, id: id, _id: id });
		activeTab.set(id);
		// fileItems.update((arr) => {
		// 	arr.unshift({ name: id, id: id });
		// 	return arr;
		// });
	};
	$: ordered = Object.keys(fileDict).sort((a, b) => {
		if (a > b) {
			return -1;
		} else if (a < b) {
			return 1;
		} else {
			return 0;
		}
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<Sidebar>
	<SidebarWrapper class="bg-gray-100">
		<SidebarGroup>
			<div dir="rtl" class="sticky mt-[-0.75rem] pr-5">
				<ButtonGroup class="space-x-px bg-gray-100 shadow-none dark:bg-gray-800">
					<Button class="h-7 border-0 p-1" color="green" outline on:click={addEntry}
						>New<CirclePlusOutline class="mr-2" /></Button
					>
				</ButtonGroup>
			</div>
			<Hr />
			<div class="max-h-[85vh] space-y-2 overflow-y-auto pr-2">
				{console.log(fileDict)}

				{#each ordered as item}
					{#key fileDict[item].id}
						<FileItem
							name={fileDict[item].name}
							id={fileDict[item].id}
							status_color={fileDict[item].color ?? 'bg-gray-500'}
						></FileItem>
					{/key}
				{/each}

				<!-- {#each Object.entries(fileDict) as [key, item]}
					{#key item.id}
						<FileItem name={item.name} id={item.id} status_color={item.color ?? 'bg-gray-500'}
						></FileItem>
					{/key}
				{/each} -->
			</div>
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>
