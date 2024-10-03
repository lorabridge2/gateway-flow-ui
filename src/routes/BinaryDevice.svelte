<script lang="ts">
	import { type NodeProps, Handle, Position, useHandleConnections, useStore } from '@xyflow/svelte';
	import { Hr, Input } from 'flowbite-svelte';
	import FloatInput from './FloatInput.svelte';
	import { handleClass, saveState } from '$lib/util';
	import IntegerInput from './IntegerInput.svelte';
	import TextInput from './TextInput.svelte';

	interface $$Props extends NodeProps {}

	export let data: $$Props['data'] = {
		label: 'Node',
		attribute: '',
		device: ''
		// bool_true: true,
		// bool_false: false
	};

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
	// 		console.log(data.attribute);
	// 		console.log(data.bool_false);
	// 		console.log(data.bool_true);
	// 		saveState();
	// 	}
	// 	initalisation = false;
	// }
</script>

<div>
	<Handle type="target" position={targetPosition ?? Position.Top} {isConnectable} class={handleClass}/>
	{data?.label}
	<Hr hrClass="h-px my-1 bg-gray-200 border-0 dark:bg-gray-700" />
	<div class="text-left text-[0.5rem]">
		<div>Properties:</div>
		<TextInput
			class="mt-1"
			{disabled}
			bind:value={data.device}
			on:change={() => {
				saveState();
			}}>Device Name</TextInput
		>
		<TextInput
			class="mt-1"
			{disabled}
			bind:value={data.attribute}
			on:change={() => {
				saveState();
			}}>Attribute Name</TextInput
		>
		<!-- <TextInput
			class="mt-1"
			bind:value={data.bool_true}
			on:change={() => {
				saveState();
			}}>True Value</TextInput
		>
		<TextInput
			class="mt-1"
			bind:value={data.bool_false}
			on:change={() => {
				saveState();
			}}>False Value</TextInput
		> -->
	</div>
	<!-- <Handle type="source" position={sourcePosition ?? Position.Bottom} /> -->
</div>

<style>
	:global(.svelte-flow__node-binarydevice) {
		padding: 10px;
		border-radius: 3px;
		width: 200px;
		font-size: 0.75rem;
		color: var(--xy-node-color-default);
		text-align: center;
		border: var(--xy-node-border-default);
		background-color: var(--xy-node-background-color-default);
	}
	:global(.svelte-flow__node-binarydevice:hover) {
		box-shadow: var(--xy-node-boxshadow-hover-default);
	}
	:global(.selected) {
		border-color: #999;
		box-shadow: none !important;
	}
</style>
