<script lang="ts">
	import { type NodeProps, Handle, Position, useStore } from '@xyflow/svelte';
	import { Hr, Input } from 'flowbite-svelte';
	import FloatInput from './FloatInput.svelte';
	import { deviceStore, handleClass, saveState } from '$lib/util';
	import IntegerInput from './IntegerInput.svelte';
	import TextInput from './TextInput.svelte';
	import Dropdown from './Dropdown.svelte';

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
	// let initalisation = true;
	// $: {
	// 	if (!initalisation) {
	// 		console.log(data.min);
	// 		console.log(data.max);
	// 		saveState();
	// 	}
	// 	initalisation = false;
	// }
	let devChoices;
	let devices;
	let attributes;

	deviceStore.subscribe((value) => {
		devices = value;
		let temp = [];
		for (const [key, val] of Object.entries(value)) {
			temp.push({ value: key, name: val['name'] + ' ' + val['ieee'] });
		}
		devChoices = temp;
	});
	$: {
		if (devices[data.device]?.['attributes']) {
			let attrs = [];
			for (let index = 0; index < devices[data.device]?.['attributes'].length; index++) {
				let val = devices[data.device]?.['attributes'][index];
				attrs.push({ value: val, name: val });
			}
			attributes = attrs;
			console.log(attributes);
		}
	}
	let selected: string;
</script>

<div>
	<!-- <Handle type="target" position={targetPosition ?? Position.Top} /> -->
	{data?.label}
	<Hr hrClass="h-px my-1 bg-gray-200 border-0 dark:bg-gray-700" />
	<div class="text-left text-[0.5rem]">
		<!-- <div>Device:</div> -->
		<Dropdown
			class="mt-1"
			compareMethod={devChoices}
			bind:value={data.device}
			onchange={() => {
				saveState();
			}}>Device</Dropdown
		>
		<!-- <div>Attribute:</div> -->
		<Dropdown
			class="mt-1"
			compareMethod={attributes}
			bind:value={data.attribute}
			onchange={() => {
				saveState();
			}}>Attribute</Dropdown
		>
		<!-- <TextInput
			class="mt-1"
			{disabled}
			bind:value={data.device}
			on:change={() => {
				saveState();
			}}>Device Name</TextInput
		> -->
		<!-- <TextInput
			class="mt-1"
			bind:value={data.attribute}
			{disabled}
			on:change={() => {
				saveState();
			}}>Attribute Name</TextInput
		> -->
		<!-- <TextInput class="mt-1" bind:value={data.bool_true} on:change={()=>{saveState();}}>True Value</TextInput>
		<TextInput class="mt-1" bind:value={data.bool_false} on:change={()=>{saveState();}}>False Value</TextInput> -->
	</div>
	<Handle type="source" position={sourcePosition ?? Position.Bottom} class={handleClass} />
</div>

<style>
	:global(.svelte-flow__node-binarysensor) {
		padding: 10px;
		border-radius: 3px;
		width: fit-content;
		min-width: 150px;
		font-size: 0.75rem;
		color: var(--xy-node-color-default);
		text-align: center;
		border: var(--xy-node-border-default);
		background-color: var(--xy-node-background-color-default);
	}
	:global(.svelte-flow__node-binarysensor:hover) {
		box-shadow: var(--xy-node-boxshadow-hover-default);
	}
	:global(.selected) {
		border-color: #999;
		box-shadow: none !important;
	}
</style>
