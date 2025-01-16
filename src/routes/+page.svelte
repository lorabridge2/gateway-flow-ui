<script lang="ts">
	import { SvelteFlowProvider } from '@xyflow/svelte';
	import Flow from './Flow.svelte';
	import { Heading } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import Nodebar from './Nodebar.svelte';
	import Filebar from './Filebar.svelte';
	import { source } from 'sveltekit-sse';
	import { deviceStore } from '$lib/util';

	let devices: any;
	onMount(async () => {
		console.log('sakdjasdkl');
		const response = await fetch('/devices', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		devices = await response.json();
		console.log(devices);
		deviceStore.set(devices);
		const value = source('/devices/sse').select('message');
		value.subscribe((message: string) => {
			// Update the reactive variable
			if (message) {
				console.log(message);
				let dev = JSON.parse(message);
				if (!(dev['lb_id'] in devices)) {
					devices[dev['lb_id']] = dev;
					deviceStore.set(devices);
				}
				console.log(devices);
			}
		});
	});
</script>

<div class="flex">
	<div class="mr-2 max-h-[90vh] w-fit overflow-hidden overflow-y-auto pr-2" dir="rtl">
		<div dir="ltr">
			<Nodebar></Nodebar>
		</div>
	</div>
	<div class="flex-auto">
		<SvelteFlowProvider>
			<Flow />
		</SvelteFlowProvider>
	</div>
	<div class="max-h-[90vh] w-[15.5rem] overflow-hidden"><Filebar /></div>
</div>
