<script lang="ts">
	import { Badge, Heading, P, TabItem, Tabs } from 'flowbite-svelte';

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
<aside class="bg-white dark:bg-gray-800">
	<!-- <P class="label">You can drag these nodes to the pane below.</P> -->

	<div class="nodes-container">
		
		<!-- <div
			class="input-node node"
			on:dragstart={(event) => onDragStart(event, 'input')}
			draggable={true}
		>
			Hybrid device (type?)
		</div> -->
		<!-- <div class="nodes-container border-r-4 border-gray-500"> -->
			<Badge color="green" class="ml-2 text-base">Input</Badge>
		<div
			class="input-node node"
			on:dragstart={(event) => onDragStart(event, 'input')}
			draggable={true}
		>
			<P>Binary sensor</P>
		</div>
		<div
			class="input-node node"
			on:dragstart={(event) => onDragStart(event, 'input')}
			draggable={true}
		>
			<P>Numeric sensor</P>
		<!-- </div> -->
		</div>
		<div class="border-r-4 rounded-full border-gray-500 w-0 h-5/6"></div>
		<Badge color="yellow" class="ml-2 text-base">Function</Badge>
		<div
			class="default-node node"
			on:dragstart={(event) => onDragStart(event, 'default')}
			draggable={true}
		>
			<P>Logic and</P>
		</div>
		<div
			class="default-node node"
			on:dragstart={(event) => onDragStart(event, 'default')}
			draggable={true}
		>
			<P>Logic or</P>
		</div>
		<div
			class="default-node node"
			on:dragstart={(event) => onDragStart(event, 'default')}
			draggable={true}
		>
			<P>Timer switch</P>
		</div>
		<div
			class="default-node node"
			on:dragstart={(event) => onDragStart(event, 'default')}
			draggable={true}
		>
			<P>Hysteresis</P>
		</div>
		<div
			class="default-node node"
			on:dragstart={(event) => onDragStart(event, 'default')}
			draggable={true}
		>
			<P>Countdown switch</P>
		</div>
		<div
			class="default-node node"
			on:dragstart={(event) => onDragStart(event, 'default')}
			draggable={true}
		>
			<P>Alert</P>
		</div>
		<div class="border-r-4 rounded-full border-gray-500 w-0 h-5/6"></div>

		<!-- </div> -->
			<Badge color="red" class="ml-2 text-base">Output</Badge>
			<div
				class="output-node node"
				on:dragstart={(event) => onDragStart(event, 'output')}
				draggable={true}
			>
				<P>Binary device</P>
			</div>
		<!-- <div
      class="default-node node"
      on:dragstart={(event) => onDragStart(event, 'default')}
      draggable={true}
    >
      Default Node
    </div>
    <div
      class="output-node node"
      on:dragstart={(event) => onDragStart(event, 'output')}
      draggable={true}
    >
      Output Node
    </div> -->
	</div>
</aside>

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
		border: 1px solid #111;
		padding: 0.5rem 1rem;
		font-weight: 700;
		border-radius: 3px;
		cursor: grab;
		width: fit-content;
	}
</style>
