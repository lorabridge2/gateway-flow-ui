<script lang="ts">
	import { type NodeProps, Handle, Position, useHandleConnections, useStore } from '@xyflow/svelte';
	import { Hr, Select } from 'flowbite-svelte';
	import IntegerInput from './IntegerInput.svelte';
	import { handleClass, saveState } from '$lib/util';
	import Dropdown from './Dropdown.svelte';

	interface $$Props extends NodeProps {}

	export let data: $$Props['data'] = { label: 'Node', value: 0, compareMethod: null };
	export let targetPosition: $$Props['targetPosition'] = undefined;
	export let sourcePosition: $$Props['sourcePosition'] = undefined;
	// this is a workaround for suppressing the warning about unused props
	$$restProps;
	const { nodesDraggable, nodesConnectable, elementsSelectable } = useStore();
	$: disabled = !($nodesDraggable || $nodesConnectable || $elementsSelectable);
	export let id: $$Props['id'];
	const connections = useHandleConnections({ nodeId: id, type: 'target' });
	$: isConnectable = $connections.length === 0;
	// let initalisation = true;
	// $: {
	// 	if (!initalisation) {
	// 		console.log(data.counter);
	// 		saveState();
	// 	}
	// 	initalisation = false;
	// }
	$:console.log(data.compareMethod);

	let compareMethod = [
		{ value: 'eq', name: 'equal' },
		{ value: 'lt', name: 'lower' },
		{ value: 'lte', name: 'lower or equal' },
		{ value: 'gt', name: 'greater' },
		{ value: 'gte', name: 'greater or equal' }
	];
	let selected: string;
</script>

<div>
	<Handle
		type="target"
		position={targetPosition ?? Position.Top}
		{isConnectable}
		class={handleClass}
	/>
	{data?.label}
	<Hr hrClass="h-px my-1 bg-gray-200 border-0 dark:bg-gray-700" />
	<div class="text-left text-[0.5rem]">
		<div>Properties:</div>
		<!-- <div class="flex space-x-3">
			<div>
				<Label class="mb-1 text-[0.5rem]">Start Time</Label>
				<Input
					type="time"
					min="00:00"
					max="23:59"
					id="visitors"
					placeholder=""
					required
					class="h-5 w-14 !py-0 text-[8px]"
				/>
			</div>
			<div>
				<Label class="mb-1 text-[0.5rem]">Stop Time</Label>
				<Input
					type="time"
					min="00:00"
					max="23:59"
					id="visitors"
					placeholder=""
					required
					class="h-5 w-14 !py-0 text-[8px]"
				/>
			</div>
		</div> -->
		<!-- <Select class="mt-1" items={compareMethod} bind:value={selected} /> -->
		<Dropdown class="mt-1" {compareMethod} bind:value={data.compareMethod} onchange={() => {
				saveState();
			}}>Method</Dropdown>
		<IntegerInput
			{disabled}
			class="mt-1"
			bind:count={data.value}
			onchange={() => {
				saveState();
			}}>Value</IntegerInput
		>
	</div>
	<Handle type="source" position={sourcePosition ?? Position.Bottom} class={handleClass} />
</div>

<style>
	:global(.svelte-flow__node-valuefilter) {
		padding: 10px;
		border-radius: 3px;
		width: 200px;
		font-size: 0.75rem;
		color: var(--xy-node-color-default);
		text-align: center;
		border: var(--xy-node-border-default);
		background-color: var(--xy-node-background-color-default);
	}
	:global(.svelte-flow__node-valuefilter:hover) {
		box-shadow: var(--xy-node-boxshadow-hover-default);
	}
	:global(.selected) {
		border-color: #999;
		box-shadow: none !important;
	}
</style>
