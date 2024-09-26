<script lang="ts">
	import IntegerInput from './IntegerInput.svelte';
	export let count;
	export let onchange = () => {};

	const filter: Function = (value: number) => {
		let tmp = value.toString().replaceAll(/[^-0-9.]*/g, '');
		let res = '';
		for (let i = 0, count = 0; i < tmp.length; i++) {
			if (tmp[i] === '.') {
				if (count >= 1) {
					continue;
				} else {
					res += tmp[i];
					count++;
				}
			} else {
				if (tmp[i] === '-' && i !== 0) {
					continue;
				}
				res += tmp[i];
			}
		}
		return res;
		// return parseFloat(res);
	};
	const add = (value: string) => {
		return (parseFloat(value) + 1.0).toString();
	};
	const sub = (value: string) => {
		return (parseFloat(value) - 1.0).toString();
	};
</script>

<IntegerInput {...$$restProps} bind:count {filter} {add} {sub} {onchange}><slot /></IntegerInput>
