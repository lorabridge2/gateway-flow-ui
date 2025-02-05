<script lang="ts">
	import { ButtonGroup, Label, Input, Textarea } from 'flowbite-svelte';
	export let value = '';
	export let maxlength:number = 64;
	export let filter: Function = undefined;
	export let placeholder = '';
	export let disabled = false;

	// if count is directly bound to the input field, every change will be passed to the parent component twice.
	// The value that was entered and the reactive block calling the filter method.
	// in this case the bound parent value in e.g. the Hysteresis will try to call saveState twice

	// let val = value;
	$: {
		console.log("TextInput");
		// count = parseInt(count.toString().replace(/[^0-9]*/, ''));
		if (filter) {
			value = filter(value) || '';
		} 
	}
</script>

<div {...$$restProps}>
	<div class="flex">
		<Label class="mr-2 w-40 break-words text-[0.5rem]"><slot /></Label>
			<Textarea
			class="!px-2 !py-0 !text-[0.5rem] h-16 w-32 !leading-[0.75rem]"
			style="resize:none;scrollbar-width:thin;"
			rows="4"
			placeholder="Your user message"
			bind:maxlength
			bind:value
		></Textarea>
			<!-- <Input
				let:props
				class="h-3 w-20 px-1 py-0 text-[0.5rem] focus:!border-[#D1D5DB] focus:!ring-0 focus:dark:!border-[#4B5563]"
			>
				<input type="text" {...props} bind:value {placeholder} on:change {disabled} />
			</Input> -->
	</div>
</div>
