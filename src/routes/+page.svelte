<script lang="ts">
	import { SvelteFlowProvider } from '@xyflow/svelte';
	import Flow from './Flow.svelte';
	import { Heading } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import Nodebar from './Nodebar.svelte';
	import Filebar from './Filebar.svelte';
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
