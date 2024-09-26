<script lang="ts">
	import { type NodeProps, Handle, Position, useHandleConnections, useStore } from '@xyflow/svelte';
	import { Hr } from 'flowbite-svelte';
	import FloatInput from './FloatInput.svelte';
	import { saveState } from '$lib/util';
	import IntegerInput from './IntegerInput.svelte';

	interface $$Props extends NodeProps {}

	export let data: $$Props['data'] = { label: 'Node', min: 0.0, max: 0.0 };
	export let targetPosition: $$Props['targetPosition'] = undefined;
	export let sourcePosition: $$Props['sourcePosition'] = undefined;
	// this is a workaround for suppressing the warning about unused props
	$$restProps;

	export let id: $$Props['id'];

	const connections = useHandleConnections({ nodeId: id, type: 'target' });
	$: isConnectable = $connections.length === 0;
	const { nodesDraggable, nodesConnectable, elementsSelectable } = useStore();
	$: disabled = !($nodesDraggable || $nodesConnectable || $elementsSelectable);
	// const filter: Function = (value: number) => {
	// 	let tmp = value.toString().replaceAll(/[^0-9.]*/g, '');
	// 	console.log(tmp);
	// 	let res = '';
	// 	for (let i = 0, count = 0; i < tmp.length; i++) {
	// 		if (tmp[i] !== '.') {
	// 			res += tmp[i];
	// 		} else {
	// 			if (count >= 1) {
	// 				continue;
	// 			} else {
	// 				res += tmp[i];
	// 				count++;
	// 			}
	// 		}
	// 	}
	// 	return res;
	// 	// return parseFloat(res);
	// };
	// const add = (value: string) => {
	// 	return (parseFloat(value) + 1.0).toString();
	// };
	// const sub = (value: string) => {
	// 	return (parseFloat(value) - 1.0).toString();
	// };
	// let initalisation = true;
	// $: {
	// 	if (!initalisation) {
	// 		console.log(data.min);
	// 		console.log(data.max);
	// 		saveState();
	// 	}
	// 	initalisation = false;
	// }
</script>

<div>
	<Handle type="target" position={targetPosition ?? Position.Top} {isConnectable} />
	{data?.label}
	<Hr hrClass="h-px my-1 bg-gray-200 border-0 dark:bg-gray-700" />
	<div class="text-left text-[0.5rem]">
		<div>Properties:</div>
		<FloatInput
			class="mt-1"
			bind:count={data.min}
			{disabled}
			onchange={() => {
				saveState();
			}}>Min Value</FloatInput
		>
		<FloatInput
			class="mt-1"
			bind:count={data.max}
			{disabled}
			onchange={() => {
				saveState();
			}}>Max Value</FloatInput
		>
		<!-- <IntegerInput class="mt-1" bind:count={data.min} {filter} {add} {sub}>Min Value</IntegerInput> -->
		<!-- <IntegerInput class="mt-1" bind:count={data.max} {filter} {add} {sub}>Max Value</IntegerInput> -->
	</div>
	<Handle type="source" position={sourcePosition ?? Position.Bottom} />
</div>

<style>
	:global(.svelte-flow__node-hysteresis) {
		padding: 10px;
		border-radius: 3px;
		width: 150px;
		font-size: 0.75rem;
		color: var(--xy-node-color-default);
		text-align: center;
		border: var(--xy-node-border-default);
		background-color: var(--xy-node-background-color-default);
	}
	:global(.svelte-flow__node-hysteresis:hover) {
		box-shadow: var(--xy-node-boxshadow-hover-default);
	}
	:global(.selected) {
		border-color: #999;
		box-shadow: none !important;
	}
</style>
