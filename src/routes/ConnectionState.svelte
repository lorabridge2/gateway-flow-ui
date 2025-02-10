<script lang="ts">
	import { SSEEvents } from '$lib/util';
	import { Span } from 'flowbite-svelte';
	import { CirclePlusOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import { source } from 'sveltekit-sse';
	let diff: number;
	let last_seen;
	$: diff = (new Date() - new Date(last_seen * 1000)) / 1000 / 60;
	function check() {
		setTimeout(() => {
			let tmp = last_seen;
			last_seen += 1;
			last_seen = tmp;
			console.log('check');
			check();
		}, 1000 * 60);
	}
	onMount(async () => {
		const response = await fetch('/connection', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		last_seen = (await response.json()).last_seen;

		console.log(diff);
		let connection = source(`/sse`);
		const value = connection.select(SSEEvents.CONNECTION);
		value.subscribe((message) => {
			if (message) {
				console.log('sse connection status received');
				last_seen = JSON.parse(message).last_seen;
			}
		});

		check();
		// 				// , {
		// 				// 	options: { body: JSON.stringify({ flowId: id }) }
		// 				// }
		// 				value.subscribe((message) => {
		// 					console.log('update message status');
		// 					// not triggered on same message
		// 					// Update the reactive variable
		// 					if (message) {
		// 						console.log(message);
		// 						status = JSON.parse(message);
		// 					}
		// 				});
	});
</script>

<div class="flex">
	{#if diff < 5}
		<svg class="mr-2 w-5 fill-lime-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"
			><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
				d="M96 0C78.3 0 64 14.3 64 32l0 96 64 0 0-96c0-17.7-14.3-32-32-32zM288 0c-17.7 0-32 14.3-32 32l0 96 64 0 0-96c0-17.7-14.3-32-32-32zM32 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l0 32c0 77.4 55 142 128 156.8l0 67.2c0 17.7 14.3 32 32 32s32-14.3 32-32l0-67.2c12.3-2.5 24.1-6.4 35.1-11.5c-2.1-10.8-3.1-21.9-3.1-33.3c0-80.3 53.8-148 127.3-169.2c.5-2.2 .7-4.5 .7-6.8c0-17.7-14.3-32-32-32L32 160zM576 368a144 144 0 1 0 -288 0 144 144 0 1 0 288 0zm-76.7-43.3c6.2 6.2 6.2 16.4 0 22.6l-72 72c-6.2 6.2-16.4 6.2-22.6 0l-40-40c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L416 385.4l60.7-60.7c6.2-6.2 16.4-6.2 22.6 0z"
			/></svg
		>
		<Span class="w-24 whitespace-normal break-words text-xs font-normal">Bridge connected</Span>
	{:else}
		<svg class="mr-2 w-5 fill-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"
			><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path
				d="M96 0C78.3 0 64 14.3 64 32l0 96 64 0 0-96c0-17.7-14.3-32-32-32zM288 0c-17.7 0-32 14.3-32 32l0 96 64 0 0-96c0-17.7-14.3-32-32-32zM32 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l0 32c0 77.4 55 142 128 156.8l0 67.2c0 17.7 14.3 32 32 32s32-14.3 32-32l0-67.2c12.3-2.5 24.1-6.4 35.1-11.5c-2.1-10.8-3.1-21.9-3.1-33.3c0-80.3 53.8-148 127.3-169.2c.5-2.2 .7-4.5 .7-6.8c0-17.7-14.3-32-32-32L32 160zM432 512a144 144 0 1 0 0-288 144 144 0 1 0 0 288zm59.3-180.7L454.6 368l36.7 36.7c6.2 6.2 6.2 16.4 0 22.6s-16.4 6.2-22.6 0L432 390.6l-36.7 36.7c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6L409.4 368l-36.7-36.7c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L432 345.4l36.7-36.7c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
			/></svg
		>
		<Span class="w-28 whitespace-normal break-words text-xs font-normal">Bridge disconnected</Span>
	{/if}
</div>
