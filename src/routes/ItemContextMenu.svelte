<!-- 
Github @dukenmarga, July 2022
Context Menu is small menu that displayed when user right-click the mouse on browser.
Think of it as a way to show Refresh option on Microsoft Windows when right-click on desktop.
Known bug:
    - If the browser loads the content for the first time, showMenu set to false.
    Hence, we cannot get menu.h and menu.y dimension, since context menu has not been available at DOM.
    The first right click will not shown properly when right-click occurs around the edge (bottom part
    and right part) of the browser.

Inspired from: Context Menu https://svelte.dev/repl/3a33725c3adb4f57b46b597f9dade0c1?version=3.25.0
-->
<script lang="ts" context="module">
	import { tick } from 'svelte';
	import { writable } from 'svelte/store';
	import { FileCopyOutline, PenOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import { closeMenues, duplicateItem } from '$lib/util';
</script>

<script>
	import { renameItem, delItem } from '$lib/util';

	// pos is cursor position when right click occur
	let pos = { x: 0, y: 0 };
	// menu is dimension (height and width) of context menu
	let menu = { h: 0, y: 0 };
	// browser/window dimension (height and width)
	let browser = { h: 0, y: 0 };
	// showMenu is state of context-menu visibility
	let showMenu = false;
	// to display some text
	let content;
	export let id;
	closeMenues.subscribe(() => {
		showMenu = false;
	});

	function rightClickContextMenu(e) {
		closeMenues.update((val) => (val += 1));
		tick();
		showMenu = true;
		browser = {
			w: window.innerWidth,
			h: window.innerHeight
		};
		pos = {
			x: e.clientX,
			y: e.clientY
		};
		// If bottom part of context menu will be displayed
		// after right-click, then change the position of the
		// context menu. This position is controlled by `top` and `left`
		// at inline style.
		// Instead of context menu is displayed from top left of cursor position
		// when right-click occur, it will be displayed from bottom left.
		if (browser.h - pos.y < menu.h) pos.y = pos.y - menu.h;
		if (browser.w - pos.x < menu.w) pos.x = pos.x - menu.w;
	}
	function onPageClick(e) {
		// To make context menu disappear when
		// mouse is clicked outside context menu
		// showMenu = false;
		closeMenues.update((val) => (val += 1));
	}
	function getContextMenuDimension(node) {
		// This function will get context menu dimension
		// when navigation is shown => showMenu = true
		let height = node.offsetHeight;
		let width = node.offsetWidth;
		menu = {
			h: height,
			w: width
		};
	}
	function addItem() {
		content.textContent = 'Add and item...';
	}
	function print() {
		content.textContent = 'Printed...';
	}
	function zoom() {
		content.textContent = 'Zooom...';
	}
	function remove() {
		content.textContent = 'Removed...';
	}
	function setting() {
		content.textContent = 'Settings...';
	}
	let menuItems = [
		{
			name: 'duplicate',
			onClick: () => {console.log(id + " context menu");duplicateItem.set(id);},
			displayText: 'Duplicate',
			class: FileCopyOutline
		},
		{
			name: 'renameItem',
			onClick: () => renameItem.set(id),
			displayText: 'Rename',
			class: PenOutline //'fa-solid fa-plus'
		},
		{
			name: 'trash',
			onClick: () => delItem.set(id),
			displayText: 'Delete',
			class: TrashBinOutline //'fa-solid fa-trash-can'
		},
	];
</script>

{#if showMenu}
	<nav
		use:getContextMenuDimension
		style="position: absolute; top:{pos.y}px; left:{pos.x}px; border-bottom-width:0px; height:-2px"
	>
		<div class="navbar border border-black bg-white dark:border-white dark:bg-gray-700" id="navbar">
			<ul>
				{#each menuItems as item}
					{#if item.name == 'hr'}
						<hr />
					{:else}
						<li>
							<button class="!bg-white dark:!bg-gray-700" on:click={item.onClick}
								><span class="flex text-black dark:text-white"
									><svelte:component this={item.class} class="mr-2"
									></svelte:component>{item.displayText}</span
								></button
							>
						</li>
					{/if}
				{/each}
			</ul>
		</div>
	</nav>
{/if}

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div on:contextmenu|preventDefault={rightClickContextMenu}>
	<slot></slot>
</div>
<svelte:window on:click={onPageClick} />

<style>
	* {
		padding: 0;
		margin: 0;
	}
	.navbar {
		display: inline-flex;
		/* border: 0px #999 solid; */
		width: 170px;
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
