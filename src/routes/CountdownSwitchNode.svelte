<script lang="ts">
	import { type NodeProps, Handle, Position, useHandleConnections, useStore } from '@xyflow/svelte';
	import { Hr } from 'flowbite-svelte';
	import IntegerInput from './IntegerInput.svelte';
	import { saveState } from '$lib/util';

	interface $$Props extends NodeProps {}

	export let data: $$Props['data'] = { label: 'Node', counter: 0 };
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
</script>

<div>
	<Handle type="target" position={targetPosition ?? Position.Top} {isConnectable} />
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
		<IntegerInput
			{disabled}
			class="mt-1"
			bind:count={data.counter}
			onchange={() => {
				saveState();
			}}>Counter (Sec)</IntegerInput
		>
	</div>
	<Handle type="source" position={sourcePosition ?? Position.Bottom} />
</div>

<style>
	:global(.svelte-flow__node-countdown) {
		padding: 10px;
		border-radius: 3px;
		width: 160px;
		font-size: 0.75rem;
		color: var(--xy-node-color-default);
		text-align: center;
		border: var(--xy-node-border-default);
		background-color: var(--xy-node-background-color-default);
	}
	:global(.svelte-flow__node-countdown:hover) {
		box-shadow: var(--xy-node-boxshadow-hover-default);
	}
	:global(.selected) {
		border-color: #999;
		box-shadow: none !important;
	}
</style>
