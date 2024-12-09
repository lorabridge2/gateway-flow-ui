<script lang="ts">
	import { type NodeProps, Handle, Position, useHandleConnections, useStore } from '@xyflow/svelte';
	import { Hr, Textarea } from 'flowbite-svelte';
	import FloatInput from './FloatInput.svelte';
	import { handleClass, saveState } from '$lib/util';
	import IntegerInput from './IntegerInput.svelte';
	import TextInput from './TextInput.svelte';
	import TextAreaInput from './TextAreaInput.svelte';

	interface $$Props extends NodeProps {}

	export let data: $$Props['data'] = { label: 'Node', message: '' };
	export let targetPosition: $$Props['targetPosition'] = undefined;
	export let sourcePosition: $$Props['sourcePosition'] = undefined;
	// this is a workaround for suppressing the warning about unused props
	$$restProps;

	export let id: $$Props['id'];

	// const connections = useHandleConnections({ nodeId: id, type: 'target' });
	// $: isConnectable = $connections.length === 0;
	// const { nodesDraggable, nodesConnectable, elementsSelectable } = useStore();
	// $: disabled = !($nodesDraggable || $nodesConnectable || $elementsSelectable);
	let textareaprops = {
		id: 'message',
		name: 'message',
		label: 'Your message',
		rows: 4,
		placeholder: 'Leave a comment...'
	};
</script>

<div>
	<Handle type="target" position={targetPosition ?? Position.Top} class={handleClass} />
	{data?.label}
	<Hr hrClass="h-px my-1 bg-gray-200 border-0 dark:bg-gray-700" />
	<div class="text-left text-[0.5rem]">
		<div>Properties:</div>
		<TextAreaInput class="mt-1" bind:value={data.message} onchange={() => {
				saveState();
			}}>Message</TextAreaInput>
		<!-- <TextInput class="mt-1">Message</TextInput>
		<Textarea
			class="!px-2 !py-0 !text-[0.5rem]"
			style="resize:none;scrollbar-width:thin;"
			rows="4"
			placeholder="Your user message"
		></Textarea> -->
		<!-- <FloatInput
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
		> -->
	</div>
	<!-- <Handle type="source" position={sourcePosition ?? Position.Bottom} class={handleClass} /> -->
</div>

<style>
	:global(.svelte-flow__node-alert) {
		padding: 10px;
		border-radius: 3px;
		width: 200px;
		font-size: 0.75rem;
		color: var(--xy-node-color-default);
		text-align: center;
		border: var(--xy-node-border-default);
		background-color: var(--xy-node-background-color-default);
	}
	:global(.svelte-flow__node-alert:hover) {
		box-shadow: var(--xy-node-boxshadow-hover-default);
	}
	:global(.selected) {
		border-color: #999;
		box-shadow: none !important;
	}
</style>
