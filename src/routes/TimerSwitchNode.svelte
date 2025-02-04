<!-- <script lang="ts">
  import { type NodeProps, Handle, Position } from '@xyflow/svelte';

  import type { TimerSwitchNode } from './types';

  type $$Props = NodeProps<TimerSwitchNode>;

  export let positionAbsoluteX: $$Props['positionAbsoluteX'];
  export let positionAbsoluteY: $$Props['positionAbsoluteY'];
  $$restProps;

  $: label = `position x:${Math.round(positionAbsoluteX)} y:${Math.round(positionAbsoluteY)}`;
</script>

<div class="svelte-flow__node svelte-flow__node-default draggable connectable selectable nopan selected bg-white">
    <Handle type="source" position={Position.Bottom} />
  <div class="inner">{label || 'no node connected'}</div>
  <Handle type="target" position={Position.Top} />
</div> -->

<script lang="ts">
	import { handleClass, saveState } from '$lib/util';
	import { type NodeProps, Handle, Position, useHandleConnections, useStore } from '@xyflow/svelte';
	import {
		Button,
		ButtonGroup,
		FloatingLabelInput,
		Hr,
		Input,
		Label,
		P,
		Range
	} from 'flowbite-svelte';
	import {
		AngleDownOutline,
		AngleLeftOutline,
		AngleRightOutline,
		ArrowLeftOutline
	} from 'flowbite-svelte-icons';
	// import NumberInput from './IntegerInput.svelte';
	//   import { Position } from '@xyflow/system';

	//   import { Handle } from '$lib/components/Handle';
	//   import type { NodeProps } from '$lib/types';

	interface $$Props extends NodeProps {}

	export let data: $$Props['data'] = { label: 'Node', start: null, stop: null };
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
	// 		console.log(data.start);
	// 		console.log(data.stop);
	// 		saveState();
	// 	}
	// 	initalisation = false;
	// }
</script>

<div>
	<!-- <Handle type="target" position={targetPosition ?? Position.Top} {isConnectable} class={handleClass}/> -->
	{data?.label}
	<Hr hrClass="h-px my-1 bg-gray-200 border-0 dark:bg-gray-700" />
	<div class="text-left text-[0.5rem]">
		<div>Properties:</div>
		<!-- lb_timerswitch_hour_min lb_timerswitch_hour_max lb_timerswitch_minute_min lb_timerswitch_minute_max -->
		<div class="flex space-x-3">
			<div>
				<Label class="mb-1 text-[0.5rem]">Start Time</Label>
				<Input
					{disabled}
					type="time"
					min="00:00"
					max="23:59"
					id="visitors"
					placeholder=""
					bind:value={data.start}
					required
					class="h-5 w-14 !py-0 text-[8px] flex"
					on:change={() => {
						saveState();
					}}
				/>
			</div>
			<div>
				<Label class="mb-1 text-[0.5rem]">Stop Time</Label>
				<Input
					{disabled}
					type="time"
					min="00:00"
					max="23:59"
					id="visitors"
					placeholder=""
					bind:value={data.stop}
					required
					class="h-5 w-14 !py-0 text-[8px] flex"
					on:change={() => {
						saveState();
					}}
				/>
			</div>
		</div>
		<!-- <div class="text-[0.25rem]"> -->
		<!-- <div class="pt-8"> -->
		<!-- <NumberInput min={5} max={10}>Test</NumberInput>  -->
		<!-- <NumberInput/> 
         <NumberInput/>
         <NumberInput/> -->
		<!-- <div class="flex">
		<Label class="text-[0.5rem] text-nowrap mr-2">Min Hour</Label>
		<ButtonGroup class="h-1 w-full">
			<Button
				class="z-10 h-3 w-1 !border-[#D1D5DB] px-2 py-0 text-[0.25rem] dark:!border-[#4B5563]"
				color="alternative"
				on:click={sub}><AngleLeftOutline size="xs" /></Button
			>
			<Input
				class="h-3 w-8 py-0 text-[0.75rem] focus:!border-[#D1D5DB] focus:!ring-0 focus:dark:!border-[#4B5563]"
				floatClass="text-[0.75rem]"
				type="text"
				placeholder=""
				bind:value={count}
			/>
			<Button
				class="z-10 ml-[-1px] h-3 w-1 !border-[#D1D5DB] px-2 py-0 text-[0.25rem] dark:!border-[#4B5563]"
				color="alternative"
				on:click={add}><AngleRightOutline size="xs" /></Button
			>
		</ButtonGroup>
        </div> -->
		<!-- </div> -->
		<!-- <FloatingLabelInput id="floating_standard" name="floating_standard" type="number" label="Floating standard" style="outlined" classInput="text-[0.5rem] p-0" size="small" classLabel="text-[0.5rem]" classDiv="p-0">
    lb_timerswitch_hour_min
  </FloatingLabelInput>  -->
	</div>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- <div on:mousedown={(e)=>{e.stopPropagation();}} >
    <Range size="sm" min="0" max="10" bind:value={minmaxValue}/>
</div> -->
	<!-- </div> -->

	<Handle type="source" position={sourcePosition ?? Position.Bottom} class={handleClass}/>
</div>

<!-- <style>
	:global(.svelte-flow__node-timer) {
		padding: 10px;
		border-radius: 3px;
		width: 150px;
		font-size: 12px;
		color: #f8f8f8;
		text-align: center;
		border: 1px solid #3c3c3c;
		background-color: #1e1e1e;
	}
</style> -->
<style>
	:global(.svelte-flow__node-timer) {
		padding: 10px;
		border-radius: 3px;
		width: 150px;
		font-size: 0.75rem;
		color: var(--xy-node-color-default);
		text-align: center;
		border: var(--xy-node-border-default);
		background-color: var(--xy-node-background-color-default);
	}
	:global(.svelte-flow__node-timer:hover) {
		/* box-shadow:  0 1px 4px 1px rgba(255, 255, 255, 0.08) ; */
		box-shadow: var(--xy-node-boxshadow-hover-default);
	}
	:global(.selected) {
		/* box-shadow: 0 0 0.5px #999; */
		border-color: #999;
		box-shadow: none !important;
	}
</style>
