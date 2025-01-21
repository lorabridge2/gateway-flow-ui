<script lang="ts">
	import {
		Sidebar,
		SidebarDropdownWrapper,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper,
		Tooltip
	} from 'flowbite-svelte';
	import { Badge, Heading, P, TabItem, Tabs } from 'flowbite-svelte';
	import { InfoCircleOutline } from 'flowbite-svelte-icons';

	const onDragStart = (event: DragEvent, nodeType: string) => {
		if (!event.dataTransfer) {
			return null;
		}

		event.dataTransfer.setData('application/svelteflow', nodeType);
		event.dataTransfer.setData('application/svelteflow/name', event.currentTarget.innerText);
		event.dataTransfer.effectAllowed = 'move';
	};
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<Sidebar>
	<SidebarWrapper class="bg-gray-100">
		<SidebarGroup>
			<SidebarDropdownWrapper label="Input" isOpen>
				<div
					class="input-node node border-2 relative !pr-7"
					on:dragstart={(event) => onDragStart(event, 'binarysensor')}
					draggable={true}
				>
					<Tooltip
						class="!z-100 max-h-40 w-56 overflow-auto bg-white text-black dark:bg-gray-700 dark:text-white text-sm font-[Consolas]"
						defaultClass="!z-100 py-2 px-3 text-sm font-medium"
						trigger="click"
						triggeredBy="#nodebar-sensor"
						>Sensor node provides sensor data from Zigbee devices.
						<div class="absolute pointer-events-none block w-[10px] h-[10px] rotate-45 bg-inherit border-inherit" style="left: 98.5px; bottom: -5px;"></div>
					</Tooltip>
					<P>Sensor</P>
					<InfoCircleOutline
						id="nodebar-sensor"
						class="absolute right-0 top-0 text-black dark:text-white"
					/>
				</div>
				<div
					class="default-node node border-2 relative !pr-7"
					on:dragstart={(event) => onDragStart(event, 'timer')}
					draggable={true}
				>
					<Tooltip
						class="max-h-40 w-56 overflow-auto bg-white text-black dark:bg-gray-700 dark:text-white text-sm font-[Consolas]"
						trigger="click"
						triggeredBy="#nodebar-timer-switch"
						>Switches a device on (e.g. light bulb) inside the start/stop time period. Otherwise, a switch off message is sent.
						<div class="absolute pointer-events-none block w-[10px] h-[10px] rotate-45 bg-inherit border-inherit" style="left: 98.5px; bottom: -5px;"></div>
					</Tooltip>
					<P>Timer switch</P>
					<InfoCircleOutline
						id="nodebar-timer-switch"
						class="absolute right-0 top-0 text-black dark:text-white"
					/>
				</div>
			</SidebarDropdownWrapper>
			<SidebarDropdownWrapper label="Function" isOpen>
				<div
					class="default-node node border-2 relative !pr-7"
					on:dragstart={(event) => onDragStart(event, 'logicand')}
					draggable={true}
				>
				<Tooltip
						class="max-h-40 w-56 overflow-auto bg-white text-black dark:bg-gray-700 dark:text-white text-sm font-[Consolas]"
						trigger="click"
						triggeredBy="#nodebar-logic-and"
						>A logical AND is a Boolean operation that returns true only if both conditions are true.
					</Tooltip>
					<P>Logic and</P>
					<InfoCircleOutline
						id="nodebar-logic-and"
						class="absolute right-0 top-0 text-black dark:text-white"
					/>
				</div>
				<div
					class="default-node node border-2 relative !pr-7"
					on:dragstart={(event) => onDragStart(event, 'logicor')}
					draggable={true}
				>
					<Tooltip
						class="max-h-40 w-56 overflow-auto bg-white text-black dark:bg-gray-700 dark:text-white text-sm font-[Consolas]"
						trigger="click"
						triggeredBy="#nodebar-logic-or"
						>
						A logical OR is a Boolean operation that returns true if at least one condition is true.
					</Tooltip>
					<P>Logic or</P>
					<InfoCircleOutline
						id="nodebar-logic-or"
						class="absolute right-0 top-0 text-black dark:text-white"
					/>
				</div>
				<div
					class="default-node node border-2 relative !pr-7"
					on:dragstart={(event) => onDragStart(event, 'hysteresis')}
					draggable={true}
				>
					<Tooltip
						class="max-h-40 w-56 overflow-auto bg-white text-black dark:bg-gray-700 dark:text-white text-sm font-[Consolas]"
						trigger="click"
						triggeredBy="#nodebar-hysteresis"
						>Hysteresis can be applied to regulate temperature/humidity etc. The node takes a numeric sensor value (e.g. temperature) as input and produces a boolean output to control a device (e.g. a heater). 
						If a sensor value drops below min value treshold, a "switch on" message is sent towards a control device. Vice versa, a "switch off" message is sent after maximum threshold is reached.
					</Tooltip>
					<P>Hysteresis</P>
					<InfoCircleOutline
						id="nodebar-hysteresis"
						class="absolute right-0 top-0 text-black dark:text-white"
					/>
				</div>
				<div
					class="default-node node border-2 relative !pr-7"
					on:dragstart={(event) => onDragStart(event, 'countdown')}
					draggable={true}
				>
					<Tooltip
						class="max-h-40 w-56 overflow-auto bg-white text-black dark:bg-gray-700 dark:text-white text-sm font-[Consolas]"
						trigger="click"
						triggeredBy="#nodebar-countdown"
						>Switches a device on (e.g. light bulb) for a period of time based on a binary input (e.g. motion sensor).
					</Tooltip>
					<P>Countdown switch</P>
					<InfoCircleOutline
						id="nodebar-countdown"
						class="absolute right-0 top-0 text-black dark:text-white"
					/>
				</div>
				<div
					class="default-node node border-2 relative !pr-7"
					on:dragstart={(event) => onDragStart(event, 'valuefilter')}
					draggable={true}
				>
					<Tooltip
						class="max-h-40 w-56 overflow-auto bg-white text-black dark:bg-gray-700 dark:text-white text-sm font-[Consolas]"
						trigger="click"
						triggeredBy="#nodebar-value-filter"
						>This node passes data based on a selected comparison operation. Example: If temperature input value is greater than a set value, the input is forwarded to the output. 
					</Tooltip>
					<P>Value filter</P>
					<InfoCircleOutline
						id="nodebar-value-filter"
						class="absolute right-0 top-0 text-black dark:text-white"
					/>
				</div>
			</SidebarDropdownWrapper>
			<SidebarDropdownWrapper label="Output" isOpen>
				<div
					class="output-node node border-2 relative !pr-7"
					on:dragstart={(event) => onDragStart(event, 'binarydevice')}
					draggable={true}
				>
					<Tooltip
						class="max-h-40 w-56 overflow-auto bg-white text-black dark:bg-gray-700 dark:text-white text-sm font-[Consolas]"
						trigger="click"
						triggeredBy="#nodebar-output"
						>Output node is a control input to binary Zigbee devices such as light bulbs. 
					</Tooltip>
					<P>Output device</P>
					<InfoCircleOutline
						id="nodebar-output"
						class="absolute right-0 top-0 text-black dark:text-white"
					/>
				</div>
				<div
					class="default-node node border-2 relative !pr-7"
					on:dragstart={(event) => onDragStart(event, 'alert')}
					draggable={true}
				>
					<Tooltip
						class="max-h-40 w-56 overflow-auto bg-white text-black dark:bg-gray-700 dark:text-white text-sm font-[Consolas]"
						trigger="click"
						triggeredBy="#nodebar-notification"
						> A user can set simple string notifications, which are sent as soon as a notification node receives input data.
					</Tooltip>
					<P>Notification</P>
					<InfoCircleOutline
						id="nodebar-notification"
						class="absolute right-0 top-0 text-black dark:text-white"
					/>
				</div>
			</SidebarDropdownWrapper>
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>

<style>
	aside {
		width: 100%;
		/* background: #f4f4f4; */
		font-size: 12px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	/* .label {
		margin: 1rem 0;
		font-size: 0.9rem;
	} */

	.nodes-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.node {
		margin: 0.5rem;
		padding: 0.5rem;
		font-weight: 700;
		border-radius: 0.25rem;
		cursor: grab;
		width: fit-content;
	}

	:global(div[role=tooltip]) {
		z-index: 100;
		overflow-y:scroll;
	}
</style>
