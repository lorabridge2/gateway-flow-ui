<script>
	import { activeTab, db } from '$lib/util';
	import { Card, Label, P, Popover, Progressbar, Span } from 'flowbite-svelte';
	import { BanOutline } from 'flowbite-svelte-icons';
	import { DateTime } from 'luxon';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { source } from 'sveltekit-sse';
	let status;
	let mapping = { issued: 0, ack: 2, txack: 1 };
	let getSum = (tasks) => {
		console.log(tasks);
		if (Object.keys(tasks ?? {}).length == 0) {
			return 0;
		}
		return Object.values(tasks).reduce((sum, x) => {
			// console.log(sum);
			// sum = typeof sum == 'string' ? mapping[sum] : sum;
			// console.log(sum);
			// console.log(x);
			// console.log(mapping[x]);
			// console.log((sum += mapping[x]));
			return (sum += mapping[x]);
		}, 0);
	};
	let getPercentage = () => {
		// console.log(status);
		// console.log(Object.keys(status?.tasks??{}).length);
		// console.log(Object.keys(status?.tasks??{}));
		// if (status?.tasks) {
		// 	// console.log(getSum(status?.tasks));
		// 	console.log(getSum(status?.tasks));
		// 	console.log(
		// 		Math.round((getSum(status?.tasks) / Object.keys(status?.tasks).length) * 2 * 100)
		// 	);
		// }
		return Object.keys(status?.tasks ?? {}).length > 0
			? Math.round((getSum(status?.tasks) / (Object.keys(status?.tasks).length * 2)) * 100)
			: 0;
	};
	let connection;
	onMount(async () => {
		// db.subscribe(()=>{

		// })
		activeTab.subscribe(async (id) => {
			if (connection) {
				await connection.close();
			}
			if (id) {
				console.log(id);
				const response = await fetch('/flow/status', {
					method: 'POST',
					body: JSON.stringify({ flowId: id }),
					headers: {
						'Content-Type': 'application/json'
					}
				});
				status = await response.json();
				console.log(status);

				connection = source(`/flow/status/sse/${id}`);
				const value = connection.select('message');

				// , {
				// 	options: { body: JSON.stringify({ flowId: id }) }
				// }
				value.subscribe((message) => {
					console.log('update message status');
					// not triggered on same message
					// Update the reactive variable
					if (message) {
						console.log(message);
						status = JSON.parse(message);
					}
				});
				// let doc = await get(db).get(id);
				// console.log(doc);
			}
		});

		// const value = source('/flow/status/sse').select('message');
		// value.subscribe((message) => {
		// 	console.log('update message status');
		// 	// not triggered on same message
		// 	// Update the reactive variable
		// 	if (message) {
		// 		console.log(message);
		// 		status = JSON.parse(message);
		// 	}
		// });
	});
</script>

<Card id="deploy_status" class="!p-2">
	<div class="text-xs font-normal">
		<Label class="inline">Deployment Status:</Label>
		<Span class="ml-5">{status?.status[status?.status.length - 1]?.value ?? 'not deployed'}</Span>
	</div>
	<Progressbar
		progress={getPercentage()}
		size="h-1.5"
		color={getPercentage() == 100 ? 'green' : 'yellow'}
	/>
</Card>
<Popover triggeredBy="#deploy_status" placement="bottom" class="!overflow-hidden">
	{#each status?.status as item}
		<P class="text-xs"
			><div class="mr-5 inline-block font-normal">
				{DateTime.fromSeconds(parseFloat(item.score)).toRFC2822()}
			</div>
			{item.value}</P
		>
	{:else}
		<P class="text-xs"><BanOutline size="sm" class="inline-block mr-2" />No tasks yet</P>
	{/each}
	<!-- <P class="text-xs"
		><div class="mr-5 inline-block font-normal">
			{DateTime.fromSeconds(parseFloat('1.7382365218596296e+9')).toRFC2822()}
		</div>
		Sending flow commands</P
	>
	<P class="text-xs"
		><div class="mr-5 inline-block font-normal">
			{DateTime.fromSeconds(parseFloat('1.7382365218596296e+9')).toRFC2822()}
		</div>
		Checking transmitted flow</P
	>
	<P class="text-xs"
		><div class="mr-5 inline-block font-normal">
			{DateTime.fromSeconds(parseFloat('1.7382365218596296e+9')).toRFC2822()}
		</div>
		Checking transmitted flow: success</P
	>
	<P class="text-xs"
		><div class="mr-5 inline-block font-normal">
			{DateTime.fromSeconds(parseFloat('1.7382365218596296e+9')).toRFC2822()}
		</div>
		Deployment complete</P
	> -->
</Popover>
