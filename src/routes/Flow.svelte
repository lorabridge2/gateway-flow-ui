<script lang="ts">
	import { writable } from 'svelte/store';
	import {
		SvelteFlow,
		Controls,
		Background,
		BackgroundVariant,
		MiniMap,
		useSvelteFlow,
		type Node,
		type NodeTypes,
		useNodes,
		useEdges,
		useStore
	} from '@xyflow/svelte';
	// import Sidebar from './Sidebar.svelte';
	import { onMount, tick } from 'svelte';
	import '@xyflow/svelte/dist/style.css';
	import { Button, P } from 'flowbite-svelte';
	import { get } from 'svelte/store';
	import PouchDB from 'pouchdb';
	import { edges, nodes, theme, activeTab, saveState, db, syncDB } from '$lib/util';
	import TimerSwitchNode from './TimerSwitchNode.svelte';
	import { Position } from '@xyflow/system';
	import { closeMenues } from '$lib/util';
	import { couchdb } from '$lib/config';

	// let db;
	// const saveState = async () => {
	// 	let doc = await db.get(get(activeTab));
	// 	await db.put({
	// 		...doc,
	// 		nodes: JSON.stringify(get(nodes)),
	// 		edges: JSON.stringify(get(edges))
	// 	});
	// };

	const nodeTypes: NodeTypes = {
		timer: TimerSwitchNode,
		countdown: CountdownSwitchNode,
		hysteresis: Hysteresis,
		binarysensor: BinarySensor,
		numericsensor: NumericSensor,
		binarydevice: BinaryDevice,
		logicand: LogicAnd,
		logicor: LogicOr,
		alert: Alert
	};
	let offsetX;
	let offsetY;
	onMount(() => {
		// db = new PouchDB('mydb');
		db.set(new PouchDB(couchdb.db));
		syncDB.set(new PouchDB('synced'));
		get(db)
			.sync(
				`${couchdb.scheme}://${couchdb.username}:${couchdb.password}@${couchdb.host || window.location.hostname}:${couchdb.port}/${couchdb.db}`,
				{
					style: 'main_only',
					live: true,
					retry: true
				}
			)
			.on('change', async function (info) {
				console.log(info);
				console.log('a');
				for (let i = 0; i < info.change.docs.length; i++) {
					let newDoc = { _id: info.change.docs[i]._id, rev: info.change.docs[i]._rev };
					try {
						let doc = await get(syncDB).get(info.change.docs[i]._id);
						newDoc['_rev'] = doc._rev;
					} catch (err) {
						//ignore error if doc does not exist
					}
					get(syncDB).put(newDoc);
					// include revision shit
				}
			})
			.on('complete', function (info) {
				console.log(info);
			});
		// 	get(syncDB).allDocs({ include_docs: true, descending: true }).then((docs) => {
		// 	console.log(docs);
		// });
		var element = document.getElementsByClassName('svelte-flow')[0];
		var position = element.getBoundingClientRect();
		offsetX = position.left;
		offsetY = position.top;
		// nodes.subscribe(async (value) => {
		// 	if (get(activeTab)) {
		// 		console.log(value?.[0]?.position?.x + ' ' + value?.[0]?.position?.y);
		// 		// count++;
		// 		console.log(get(activeTab));
		// 		let doc = await db.get(get(activeTab));
		// 		console.log(doc);
		// 		try {
		// 			await db.put({
		// 				...doc,
		// 				nodes: JSON.stringify(get(nodes))
		// 			});
		// 		} catch (error) {
		// 			// console.log(error);
		// 			if (error.status !== 409) {
		// 				throw error;
		// 			}
		// 		}
		// 	}
		// 	// console.log(get(nodes));
		// });
		// edges.subscribe(async (value) => {
		// 	if (get(activeTab)) {
		// 		// console.log(value?.[0]?.position?.x + ' ' + value?.[0]?.position?.y);
		// 		// count++;
		// 		console.log(get(activeTab));
		// 		let doc = await db.get(get(activeTab));
		// 		console.log(doc);
		// 		try {
		// 			await db.put({
		// 				...doc,
		// 				edges: JSON.stringify(get(edges))
		// 			});
		// 		} catch (error) {
		// 			// console.log(error);
		// 			if (error.status !== 409) {
		// 				throw error;
		// 			}
		// 		}
		// 	}
		// 	// console.log(get(nodes));
		// });
	});
	// const nodes = writable([]);
	// const edges = writable([]);

	// const nodes = useNodes();
	// const edges = useEdges();

	let menu: { id: string; top?: number; left?: number; right?: number; bottom?: number } | null;
	let width: number;
	let height: number;

	function handleContextMenu({ detail: { event, node } }) {
		doMenuHandling(event, node);
		// Prevent native context menu from showing
		// event.preventDefault();
		// console.log(node);
		// // Calculate position of the context menu. We want to make sure it
		// // doesn't get positioned off-screen.
		// menu = {
		// 	id: node.id,
		// 	top: event.clientY - offsetY < height - 200 ? event.clientY - offsetY : undefined,
		// 	left: event.clientX - offsetX < width - 200 ? event.clientX - offsetX : undefined,
		// 	right: event.clientX - offsetX >= width - 200 ? width - event.clientX + offsetX : undefined,
		// 	bottom: event.clientY - offsetY >= height - 200 ? height - event.clientY + offsetY : undefined,
		// };
		// console.log(event.clientY);
		// console.log(event.clientX);
		// console.log(menu);
	}

	function doMenuHandling(event, obj) {
		event.preventDefault();
		closeMenues.update((val) => (val += 1));
		tick();
		console.log(obj);
		// Calculate position of the context menu. We want to make sure it
		// doesn't get positioned off-screen.
		menu = {
			id: obj.id,
			top: event.clientY - offsetY < height - 200 ? event.clientY - offsetY : undefined,
			left: event.clientX - offsetX < width - 200 ? event.clientX - offsetX : undefined,
			right: event.clientX - offsetX >= width - 200 ? width - event.clientX + offsetX : undefined,
			bottom: event.clientY - offsetY >= height - 200 ? height - event.clientY + offsetY : undefined
		};
		console.log(event.clientY);
		console.log(event.clientX);
		console.log(menu);
	}

	function handleEdgeContextMenu({ detail: { event, edge } }) {
		doMenuHandling(event, edge);
		// Prevent native context menu from showing
		// event.preventDefault();
		// console.log(edge);
		// // Calculate position of the context menu. We want to make sure it
		// // doesn't get positioned off-screen.
		// menu = {
		// 	id: edge.id,
		// 	top: event.clientY < height - 200 ? event.clientY : undefined,
		// 	left: event.clientX < width - 200 ? event.clientX : undefined,
		// 	right: event.clientX >= width - 200 ? width - event.clientX : undefined,
		// 	bottom: event.clientY >= height - 200 ? height - event.clientY : undefined
		// };
	}
	closeMenues.subscribe(() => {
		menu = null;
	});
	// Close the context menu if it's open whenever the window is clicked.
	function handlePaneClick() {
		closeMenues.update((val) => (val += 1));
		// menu = null;
	}

	const { screenToFlowPosition } = useSvelteFlow();
	const onDragOver = (event: DragEvent) => {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	};

	const onDrop = (event: DragEvent) => {
		event.preventDefault();

		if (!event.dataTransfer) {
			return null;
		}

		const type = event.dataTransfer.getData('application/svelteflow');
		const name = event.dataTransfer.getData('application/svelteflow/name');

		const position = screenToFlowPosition({
			x: event.clientX,
			y: event.clientY
		});

		const newNode = {
			id: `${Math.random()}`,
			type,
			targetPosition: Position.Left,
			sourcePosition: Position.Right,
			position,
			data: { label: name },
			origin: [0.5, 0.0]
		} satisfies Node;

		nodes.update((arr) => {
			arr.push(newNode);
			return arr;
		});
		console.log('node created');
		saveState();

		// $nodes.push(newNode);
		// $nodes = $nodes;
	};
	let colorMode = 'light';
	theme.subscribe((value) => {
		colorMode = value;
	});

	// onMount(() => {
	// 	colorMode = localStorage.getItem('color-theme');
	// 	let iframe = iframeRef(document.getElementById('notifyframe'));
	// 	window.addEventListener(
	// 		'storage',
	// 		function (event) {
	// 			if (event.storageArea === localStorage && event.key === 'color-theme') {
	// 				// It's local storage
	// 				parent.postMessage(
	// 					{
	// 						type: 'preview.compiled',
	// 						other: event.newValue
	// 					},
	// 					'/'
	// 				);
	// 			}
	// 		},
	// 		false
	// 	);
	// 	window.addEventListener('message', function (message) {
	// 		if (message.data.type == 'preview.compiled') {
	// 			colorMode = message.data.other;
	// 		}
	// 	});
	// });
	// function iframeRef(frameRef) {
	// 	return frameRef.contentWindow ? frameRef.contentWindow.document : frameRef.contentDocument;
	// }

	let nodesBak =
		'[{"id":"0.16273077306674322","type":"input","position":{"x":405,"y":110},"data":{"label":"Numeric sensor"},"origin":[0.5,0],"measured":{"width":150,"height":40},"selected":false},{"id":"0.8298740470766617","type":"default","position":{"x":520.75,"y":75.25},"data":{"label":"Timer switch"},"origin":[0.5,0],"measured":{"width":150,"height":40},"selected":false},{"id":"0.3423722899323688","type":"default","position":{"x":242.25,"y":125.25},"data":{"label":"Hysteresis"},"origin":[0.5,0],"measured":{"width":150,"height":40},"selected":true,"dragging":false},{"id":"0.6244961673465648","type":"default","position":{"x":679.75,"y":160.25},"data":{"label":"Countdown switch"},"origin":[0.5,0],"measured":{"width":150,"height":58},"selected":false},{"id":"0.5898823877967887","type":"input","position":{"x":249,"y":65.5},"data":{"label":"Numeric sensor"},"origin":[0.5,0],"measured":{"width":150,"height":40},"selected":false},{"id":"0.49062769854153143","type":"output","position":{"x":524,"y":210.875},"data":{"label":"Binary device"},"origin":[0.5,0],"measured":{"width":150,"height":40}}]';
	let edgesBak =
		'[{"source":"0.5898823877967887","target":"0.3423722899323688","id":"xy-edge__0.5898823877967887-0.3423722899323688"},{"source":"0.3423722899323688","target":"0.8298740470766617","id":"xy-edge__0.3423722899323688-0.8298740470766617"},{"source":"0.16273077306674322","target":"0.8298740470766617","id":"xy-edge__0.16273077306674322-0.8298740470766617"},{"source":"0.8298740470766617","target":"0.6244961673465648","id":"xy-edge__0.8298740470766617-0.6244961673465648"},{"source":"0.6244961673465648","target":"0.49062769854153143","id":"xy-edge__0.6244961673465648-0.49062769854153143"}]';
	import {
		Sidebar,
		SidebarBrand,
		SidebarCta,
		SidebarDropdownItem,
		SidebarDropdownWrapper,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper
	} from 'flowbite-svelte';
	import CountdownSwitchNode from './CountdownSwitchNode.svelte';
	import Hysteresis from './Hysteresis.svelte';
	import BinarySensor from './BinarySensor.svelte';
	import NumericSensor from './NumericSensor.svelte';
	import BinaryDevice from './BinaryDevice.svelte';
	import FlowContextMenu from './FlowContextMenu.svelte';
	import LogicAnd from './LogicAnd.svelte';
	import LogicOr from './LogicOr.svelte';
	import Alert from './Alert.svelte';
	const { nodesDraggable, nodesConnectable, elementsSelectable } = useStore();
	$: disabled = !($nodesDraggable || $nodesConnectable || $elementsSelectable);
</script>

<!-- <iframe title="notifyframe" id="notifyframe" src="/blank" height="0px" width="0px" hidden></iframe> -->
<main bind:clientWidth={width} bind:clientHeight={height}>
	<SvelteFlow
		{nodes}
		{edges}
		fitView
		on:dragover={onDragOver}
		on:drop={onDrop}
		{colorMode}
		{nodeTypes}
		deleteKey={['Backspace', 'Delete']}
		on:nodedragstop={(event) => {
			console.log('drag stopped');
			saveState();
		}}
		ondelete={(event) => {
			console.log('thing deleted');
			saveState();
		}}
		onconnect={(event) => {
			console.log('connected');
			saveState();
		}}
		on:nodecontextmenu={handleContextMenu}
		on:edgecontextmenu={handleEdgeContextMenu}
		on:paneclick={handlePaneClick}
		on:panecontextmenu={({ detail: { event } }) => {
			event.preventDefault();
		}}
	>
		<Controls />
		<Background variant={BackgroundVariant.Dots} />
		<MiniMap />
		{#if menu && !disabled}
			<FlowContextMenu
				id={menu.id}
				top={menu.top}
				left={menu.left}
				right={menu.right}
				bottom={menu.bottom}
			/>
		{/if}
	</SvelteFlow>
	<Sidebar />
</main>
<svelte:window on:click={handlePaneClick} />

<!-- <Button
	on:click={() => {
		console.log(JSON.stringify(get(nodes)));
	}}>Nodes</Button
> -->

<!-- 
<Button
	on:click={() => {
		console.log(JSON.stringify(get(edges)));
	}}>Edges</Button
>

<Button
	on:click={() => {
		nodes.set(JSON.parse(nodesBak));
		edges.set(JSON.parse(edgesBak));
	}}>Restore</Button
> -->

<style>
	main {
		height: 90vh;
		display: flex;
		flex-direction: column-reverse;
	}
	:global(g) {
		:global(path) {
			stroke-width: 3px !important;
		}
	}
</style>
