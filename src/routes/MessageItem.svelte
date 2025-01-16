<script lang="ts">
	import { messageStore } from '$lib/util';
	import { Button, P } from 'flowbite-svelte';
	import {
		CogSolid,
		PenOutline,
		ServerSolid,
		TerminalSolid,
		TrashBinOutline,
		UserSolid
	} from 'flowbite-svelte-icons';
	import { DateTime } from 'luxon';
	import { get } from 'svelte/store';

	interface Props {
		name: string;
		id: string;
		status_color?: string;
		type: 'user' | 'system';
		timestamp: number;
	}
	let { name, id, status_color = 'bg-gray-500', type, timestamp }: Props = $props();
	// let label;
	// let inputVal: string = $state('');
	// let hidden = $state(true);
	let active = $state(false);
	function deleteMsg() {
		console.log(type);
		fetch('events/delete', {
			method: 'POST',
			body: JSON.stringify({ id: id, type: type }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		messageStore.set(get(messageStore).filter((elem) => elem.id !== id));
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="flex rounded border-2 {active
		? 'bg-gray-400 dark:bg-gray-500'
		: 'bg-gray-100 dark:bg-gray-800'}"
>
	<!-- onclick={() => (active = !active)} -->
	<!-- <span class="w-2 shrink-0 {status_color}"></span> -->
	<span class="w-2 shrink-0 bg-transparent"></span>
	<span class="flex w-full px-2 py-2">
		<span>
			<P class="py-auto break-all">
				{#if type === 'user'}
					<UserSolid class="mr-2 inline border-r-2 pr-1 text-amber-500" size="xl" />
				{:else if type === 'system'}
					<CogSolid class="mr-2 inline border-r-2 pr-1 text-red-500" size="xl" />
				{/if}

				{name}
			</P>
			<P color="text-gray-400"
				>Received: {DateTime.fromSeconds(parseFloat(timestamp)).toRFC2822()}</P
			>
		</span>
		<span class="py-auto ml-auto shrink-0">
			<!-- <Button class="ml-1 mr-0 h-6 w-6 border-0 px-0" outline 
						><PenOutline /></Button
					> -->
			<Button class="ml-[-0.25rem] h-6 w-6 border-0 px-0" color="red" outline onclick={deleteMsg}
				><TrashBinOutline /></Button
			>
		</span>
	</span>
</div>
