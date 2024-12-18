<script lang="ts">
	import { type NodeProps, Handle, Position, useHandleConnections, useStore } from '@xyflow/svelte';
	import { Hr } from 'flowbite-svelte';
	import FloatInput from './FloatInput.svelte';
	import { handleClass, saveState } from '$lib/util';
	import IntegerInput from './IntegerInput.svelte';

	interface $$Props extends NodeProps {}

	export let data: $$Props['data'] = { label: 'Node' };
	export let targetPosition: $$Props['targetPosition'] = undefined;
	export let sourcePosition: $$Props['sourcePosition'] = undefined;
	// this is a workaround for suppressing the warning about unused props
	$$restProps;

	export let id: $$Props['id'];

	// const connections = useHandleConnections({ nodeId: id, type: 'target' });
	// $: isConnectable = $connections.length === 0;
	// const { nodesDraggable, nodesConnectable, elementsSelectable } = useStore();
	// $: disabled = !($nodesDraggable || $nodesConnectable || $elementsSelectable);
</script>

<div>
	<Handle
		id={id + '-0'}
		type="target"
		position={Position.Left}
		style="top:30%"
		class={handleClass}
	/>
	<Handle
		id={id + '-1'}
		type="target"
		position={Position.Left}
		style="top:70%"
		class={handleClass}
	/>
	{data?.label}
	<!-- <Hr hrClass="h-px my-1 bg-gray-200 border-0 dark:bg-gray-700" />
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
	</div> -->
	<Handle type="source" position={sourcePosition ?? Position.Right} class={handleClass} />
</div>

<style>
	:global(.svelte-flow__node-logicor) {
		padding: 10px;
		border-radius: 3px;
		width: 150px;
		font-size: 0.75rem;
		color: var(--xy-node-color-default);
		text-align: center;
		border: var(--xy-node-border-default);
		background-color: var(--xy-node-background-color-default);
	}
	:global(.svelte-flow__node-logicor:hover) {
		box-shadow: var(--xy-node-boxshadow-hover-default);
	}
	:global(.selected) {
		border-color: #999;
		box-shadow: none !important;
	}
</style>
