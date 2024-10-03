<script lang="ts">
	import { type NodeProps, Handle, Position } from '@xyflow/svelte';
	import { Hr, Input } from 'flowbite-svelte';
	import FloatInput from './FloatInput.svelte';
	import { handleClass, saveState } from '$lib/util';
	import IntegerInput from './IntegerInput.svelte';
	import TextInput from './TextInput.svelte';

	interface $$Props extends NodeProps {}

	export let data: $$Props['data'] = { label: 'Node', attribue: '' };
	export let targetPosition: $$Props['targetPosition'] = undefined;
	export let sourcePosition: $$Props['sourcePosition'] = undefined;
	// this is a workaround for suppressing the warning about unused props
	$$restProps;

	// $: {
	// 	console.log("reactive numersen");
	// 	if (initalisation<2) {
	// 		console.log("NumericSensor");
	// 		console.log(data.min);
	// 		console.log(data.max);
	// 		saveState();
	// 	}
	// 	initalisation ++;
	// }
</script>

<div>
	<!-- <Handle type="target" position={targetPosition ?? Position.Top} /> -->
	{data?.label}
	<Hr hrClass="h-px my-1 bg-gray-200 border-0 dark:bg-gray-700" />
	<div class="text-left text-[0.5rem]">
		<div>Properties:</div>
		<TextInput class="mt-1" bind:value={data.attribue} on:change={()=>{saveState();}}>Attribute Name</TextInput>
	</div>
	<Handle type="source" position={sourcePosition ?? Position.Bottom} class={handleClass}/>
</div>

<style>
	:global(.svelte-flow__node-numericsensor) {
		padding: 10px;
		border-radius: 3px;
		width: 200px;
		font-size: 0.75rem;
		color: var(--xy-node-color-default);
		text-align: center;
		border: var(--xy-node-border-default);
		background-color: var(--xy-node-background-color-default);
	}
	:global(.svelte-flow__node-numericsensor:hover) {
		box-shadow: var(--xy-node-boxshadow-hover-default);
	}
	:global(.selected) {
		border-color: #999;
		box-shadow: none !important;
	}
</style>
