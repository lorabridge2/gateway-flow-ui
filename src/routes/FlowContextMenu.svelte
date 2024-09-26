<script lang="ts">
	import { useEdges, useNodes } from '@xyflow/svelte';
	import { TrashBinOutline } from 'flowbite-svelte-icons';
	export let onClick: () => void;
	export let id: string;
	export let top: number | undefined;
	export let left: number | undefined;
	export let right: number | undefined;
	export let bottom: number | undefined;

	const nodes = useNodes();
	const edges = useEdges();

	//   function duplicateNode() {
	//     const node = $nodes.find((node) => node.id === id);
	//     if (node) {
	//       $nodes.push({
	//         ...node,
	//         // You should use a better id than this in production
	//         id: `${id}-copy${Math.random()}`,
	//         position: {
	//           x: node.position.x,
	//           y: node.position.y + 50
	//         }
	//       });
	//     }
	//     $nodes = $nodes;
	//   }

	function deleteNode() {
		if (id.includes('edge__')) {
			$edges = $edges.filter((edge) => edge.id !== id);
		} else {
			$nodes = $nodes.filter((node) => node.id !== id);
			$edges = $edges.filter((edge) => edge.source !== id && edge.target !== id);
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- <div
	style="top: {top}px; left: {left}px; right: {right}px; bottom: {bottom}px;"
	class="context-menu"
	on:click={onClick}>
	<button on:click={deleteNode}>delete</button>
</div> -->

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<nav
	on:click={onClick}
	class="absolute z-10"
	style="top: {top}px; left: {left}px; right: {right}px; bottom: {bottom}px; border-bottom-width:0px; height:-2px"
>
	<div class="navbar border border-black bg-white dark:border-white dark:bg-gray-700" id="navbar">
		<ul>
			<li>
				<button class="!bg-white dark:!bg-gray-700" on:click={deleteNode}
					><span class="flex text-black dark:text-white"
						><TrashBinOutline class="mr-2" />Delete</span
					></button
				>
			</li>
		</ul>
	</div>
</nav>

<style>
	.context-menu {
		background: white;
		border-style: solid;
		box-shadow: 10px 19px 20px rgba(0, 0, 0, 10%);
	}

	.context-menu button {
		border: none;
		display: block;
		padding: 0.5em;
		text-align: left;
		width: 100%;
	}

	.context-menu button:hover {
		background: white;
	}

	* {
		padding: 0;
		margin: 0;
	}
	.navbar {
		display: inline-flex;
		/* border: 0px #999 solid; */
		width: 170px;
		/* background-color: #fff; */
		border-radius: 10px;
		overflow: hidden;
		flex-direction: column;
	}
	.navbar ul {
		margin: 6px;
	}
	ul li {
		display: block;
		list-style-type: none;
		width: 1fr;
	}
	ul li button {
		font-size: 1rem;
		color: #222;
		width: 100%;
		height: 30px;
		text-align: left;
		border: 0px;
		background-color: #fff;
	}
	ul li button:hover {
		color: #000;
		text-align: left;
		border-radius: 5px;
		background-color: #eee;
	}
	ul li button i {
		padding: 0px 15px 0px 10px;
	}
	ul li button i.fa-square {
		color: #fff;
	}
	ul li button:hover > i.fa-square {
		color: #eee;
	}
	ul li button:hover > i.warning {
		color: crimson;
	}
	:global(ul li button.info:hover) {
		color: navy;
	}
	hr {
		border: none;
		border-bottom: 1px solid #ccc;
		margin: 5px 0px;
	}
</style>
