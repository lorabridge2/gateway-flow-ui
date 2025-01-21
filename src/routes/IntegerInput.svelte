<script lang="ts">
	import { Button, ButtonGroup, Label, Input } from 'flowbite-svelte';
	import { AngleLeftOutline, AngleRightOutline } from 'flowbite-svelte-icons';
	import { customRandom } from 'nanoid';
	export let sub = (value: any) => {
		return value > 0 ? value - 1 : value;
	};
	export let add = (value: any) => {
		return value + 1;
	};
	export let count = 0;
	export let min: number | undefined = undefined;
	export let max: number | undefined = undefined;
	export let disabled = false;
	export let filter: Function = (value: number) => {
		return parseInt(value.toString().replaceAll(/[^-0-9]*/g, ''));
	};
	// if count is directly bound to the input field, every change will be passed to the parent component twice.
	// The value that was entered and the reactive block calling the filter method.
	// in this case the bound parent value in e.g. the Hysteresis will try to call saveState twice
	// let val = count;
	export let onchange = () => {};
	$: {
		// count = parseInt(count.toString().replace(/[^0-9]*/, ''));
		let filtered = filter(count);
		count = isNaN(filtered ?? NaN) ? '' : filtered;
		if (min && count < min) {
			count = min;
		}
		if (max && count > max) {
			count = max;
		}
	}
</script>

<div {...$$restProps}>
	<div class="flex">
		<Label class="mr-2 min-w-12 text-[0.5rem]"><slot /></Label>
		<ButtonGroup class="h-1 w-full">
			<Button
				class="z-10 h-3 w-1 !border-[#D1D5DB] px-2 py-0 text-[0.25rem] dark:!border-[#4B5563]"
				color="alternative"
				on:click={() => {
					count = sub(count);
					onchange();
				}}
				{disabled}><AngleLeftOutline size="xs" /></Button
			>
			<!-- <Input
			class="h-3 w-8 py-0 text-[0.75rem] focus:!border-[#D1D5DB] focus:!ring-0 focus:dark:!border-[#4B5563]"
			floatClass="text-[0.75rem]"
			type="text"
			placeholder=""
			bind:value={count}
		/> -->

			<Input
				let:props
				class="h-3 w-8 px-1 py-0 text-[0.5rem] focus:!border-[#D1D5DB] focus:!ring-0 focus:dark:!border-[#4B5563]"
			>
				<!-- <div slot="left">#</div> -->
				<input type="text" {...props} bind:value={count} on:change={onchange} {disabled} />
			</Input>

			<Button
				class="z-10 ml-[-1px] h-3 w-1 !border-[#D1D5DB] px-2 py-0 text-[0.25rem] dark:!border-[#4B5563]"
				color="alternative"
				{disabled}
				on:click={() => {
					count = add(count);
					onchange();
				}}><AngleRightOutline size="xs" /></Button
			>
		</ButtonGroup>
	</div>
</div>
