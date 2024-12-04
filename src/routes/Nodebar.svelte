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
					class="input-node node border-2"
					on:dragstart={(event) => onDragStart(event, 'binarysensor')}
					draggable={true}
				>
					<P>Sensor</P>
				</div>
				<!-- <div
					class="input-node node border-2"
					on:dragstart={(event) => onDragStart(event, 'numericsensor')}
					draggable={true}
				>
					<P>Numeric sensor</P>
				</div> -->
				<!-- <div
					class="input-node node border-2"
					on:dragstart={(event) => onDragStart(event, 'input')}
					draggable={true}
				>
					<P>Binary sensorBinary sensorBinary sensorBinary sensorBinary sensorBinary sensor</P>
				</div> -->
			</SidebarDropdownWrapper>
			<SidebarDropdownWrapper label="Function" isOpen>
				<div
					class="default-node node border-2"
					on:dragstart={(event) => onDragStart(event, 'logicand')}
					draggable={true}
				>
					<P>Logic and</P>
				</div>
				<div
					class="default-node node border-2"
					on:dragstart={(event) => onDragStart(event, 'logicor')}
					draggable={true}
				>
					<P>Logic or</P>
				</div>
				<div
					class="default-node node border-2"
					on:dragstart={(event) => onDragStart(event, 'timer')}
					draggable={true}
				>
					<P>Timer switch</P>
				</div>
				<div
					class="default-node node relative border-2 !pr-7"
					on:dragstart={(event) => onDragStart(event, 'hysteresis')}
					draggable={true}
				>
					<Tooltip
						class="max-h-40 w-56 overflow-auto bg-white text-black dark:bg-gray-700 dark:text-white text-sm font-[Consolas]"
						trigger="click"
						triggeredBy="#nodebar-hysteresis"
						>Hysteresis refers to a delay or lag in a system's response to changes, meaning the
						current state depends not only on the immediate conditions but also on what happened in
						the past. For example, in a thermostat, even after reaching the set temperature, the
						system might take a bit of time before turning off or on again to avoid constantly
						switching between states.
					</Tooltip>
					<P>Hysteresis</P>
					<InfoCircleOutline
						id="nodebar-hysteresis"
						class="absolute right-0 top-0 text-black dark:text-white"
					/>
				</div>
				<div
					class="default-node node border-2"
					on:dragstart={(event) => onDragStart(event, 'countdown')}
					draggable={true}
				>
					<P>Countdown switch</P>
				</div>
				<div
					class="default-node node border-2"
					on:dragstart={(event) => onDragStart(event, 'alert')}
					draggable={true}
				>
					<P>Notification</P>
				</div>
				<div
					class="default-node node border-2"
					on:dragstart={(event) => onDragStart(event, 'valuefilter')}
					draggable={true}
				>
					<P>Value filter</P>
				</div>
			</SidebarDropdownWrapper>
			<SidebarDropdownWrapper label="Output" isOpen>
				<div
					class="output-node node border-2"
					on:dragstart={(event) => onDragStart(event, 'binarydevice')}
					draggable={true}
				>
					<P>Output device</P>
				</div>
			</SidebarDropdownWrapper>
			<!-- <SidebarDropdownWrapper label="Function" isOpen>
				<div
					class="default-node node border-2"
					on:dragstart={(event) => onDragStart(event, 'default')}
					draggable={true}
				>
					<P>Logic and</P>
				</div>
				<div
					class="default-node node border-2"
					on:dragstart={(event) => onDragStart(event, 'default')}
					draggable={true}
				>
					<P>Logic or</P>
				</div>
				<div
					class="default-node node border-2"
					on:dragstart={(event) => onDragStart(event, 'default')}
					draggable={true}
				>
					<P>Timer switch</P>
				</div>
				<div
					class="default-node node border-2"
					on:dragstart={(event) => onDragStart(event, 'default')}
					draggable={true}
				>
					<P>Hysteresis</P>
				</div>
				<div
					class="default-node node border-2"
					on:dragstart={(event) => onDragStart(event, 'default')}
					draggable={true}
				>
					<P>Countdown switch</P>
				</div>
				<div
					class="default-node node border-2"
					on:dragstart={(event) => onDragStart(event, 'default')}
					draggable={true}
				>
					<P>Alert</P>
				</div>
			</SidebarDropdownWrapper>
            <SidebarDropdownWrapper label="Function" isOpen>
				<div
					class="default-node node border-2"
					on:dragstart={(event) => onDragStart(event, 'default')}
					draggable={true}
				>
					<P>Logic and</P>
				</div>
				<div
					class="default-node node border-2"
					on:dragstart={(event) => onDragStart(event, 'default')}
					draggable={true}
				>
					<P>Logic or</P>
				</div>
				<div
					class="default-node node border-2"
					on:dragstart={(event) => onDragStart(event, 'default')}
					draggable={true}
				>
					<P>Timer switch</P>
				</div>
				<div
					class="default-node node border-2"
					on:dragstart={(event) => onDragStart(event, 'default')}
					draggable={true}
				>
					<P>Hysteresis</P>
				</div>
				<div
					class="default-node node border-2"
					on:dragstart={(event) => onDragStart(event, 'default')}
					draggable={true}
				>
					<P>Countdown switch</P>
				</div>
				<div
					class="default-node node border-2"
					on:dragstart={(event) => onDragStart(event, 'default')}
					draggable={true}
				>
					<P>Alert</P>
				</div>
			</SidebarDropdownWrapper> -->
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
</style>
