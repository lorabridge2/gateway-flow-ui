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
	// let local_start = null;
	// $: {
	// 	let utc = new Date(null, null, null, ...local_start.split(':'));
	// 	data.start = `${utc.getUTCHours}:${utc.getUTCMinutes}`;
	// 	console.log(data.start);
	// }
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
				<!-- `bind:value={get, set}` must not have surrounding parentheses https://svelte.dev/e/bind_invalid_parens -->
				<!-- following comment is needed! Otherwise adds parentheses -->
				<!-- prettier-ignore -->
				<Input
					{disabled}
					type="time"
					min="00:00"
					max="23:59"
					id="visitors"
					placeholder=""
					bind:value={() => {
						if (!data.start){
							return undefined;
						}
						let local = new Date(Date.UTC(null, null, null, ...data.start.split(':')));
						return `${local.getHours()}:${local.getMinutes()}`;
					},
					(v) => {
						if(v){
						let utc = new Date(null, null, null, ...v.split(':'));
						console.log(`${utc.getUTCHours()}:${utc.getUTCMinutes()}`);
						data.start = `${utc.getUTCHours()}:${utc.getUTCMinutes()}`;}
					}}
					required
					class="flex h-5 w-14 !py-0 text-[8px]"
					on:change={() => {
						saveState();
					}}
				/>
			</div>
			<div>
				<Label class="mb-1 text-[0.5rem]">Stop Time</Label>
				<!-- `bind:value={get, set}` must not have surrounding parentheses https://svelte.dev/e/bind_invalid_parens -->
				<!-- following comment is needed! Otherwise adds parentheses -->
				<!-- prettier-ignore -->
				<Input
					{disabled}
					type="time"
					min="00:00"
					max="23:59"
					id="visitors"
					placeholder=""
					bind:value={() => {
						if (!data.stop){
							return undefined;
						}
						let local = new Date(Date.UTC(null, null, null, ...data.stop.split(':')));
						return `${local.getHours()}:${local.getMinutes()}`;
					},
					(v) => {
						if(v){
						let utc = new Date(null, null, null, ...v.split(':'));
						console.log(`${utc.getUTCHours()}:${utc.getUTCMinutes()}`);
						data.stop = `${utc.getUTCHours()}:${utc.getUTCMinutes()}`;}
					}}
					required
					class="flex h-5 w-14 !py-0 text-[8px]"
					on:change={() => {
						saveState();
					}}
				/>
			</div>
		</div>
	</div>

	<Handle type="source" position={sourcePosition ?? Position.Bottom} class={handleClass} />
</div>

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
