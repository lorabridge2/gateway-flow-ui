<script>
	import '../app.css';
	import { theme, back, forth, showBack, showForth, cancel, save } from '$lib/util';
	import { Navbar, NavBrand, DarkMode, NavUl, NavLi, Button, ButtonGroup, Label, P } from 'flowbite-svelte';
	import {
		CaretLeftSolid,
		CaretRightSolid,
		CloseOutline,
		FloppyDiskAltOutline,
		FloppyDiskOutline
	} from 'flowbite-svelte-icons';
	// import logo from '$lib/assets/logo.webp';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let disableBack = false;
	showBack.subscribe((show) => {
		disableBack = !(show ?? true);
	});
	let disableForth = false;
	showForth.subscribe((show) => {
		disableForth = !(show ?? true);
	});

	const btnClass =
		'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-lg p-2.5 z-50';
	// const btnClass =
	// 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-lg p-2.5 fixed right-2 top-12  md:top-3 md:right-2 z-50';
	onMount(() => {
		theme.set(localStorage.getItem('color-theme') ?? 'light');
	});
	const keypress = (event) => {
		if (event.ctrlKey) {
			switch (event.key) {
				case 'z':
					backPressed();
					break;
				case 'y':
				case 'Z':
					forthPressed();
					break;
			}
		}
	};
	const backPressed = () => {
		back.update((val) => val + 1);
	};
	const forthPressed = () => {
		forth.update((val) => val + 1);
	};
	const cancelPressed = () => {
		cancel.update((val) => val + 1);
	};
	const savePressed = () => {
		save.update((val) => val + 1);
	};
</script>

<svelte:window on:keydown={keypress} />

<Navbar let:hidden let:toggle class="bg-gray-100">
	<NavBrand href="/">
		<span class="heading self-center whitespace-nowrap text-4xl font-semibold dark:text-white">
			Lo<span>Ra</span>Mation
		</span>
	</NavBrand>
	<!-- <NavUl class="ml-auto">
		<NavLi href="/">Search</NavLi>
		<NavLi href="/doc">Metrics</NavLi>
		<NavLi href="https://fh-crossd.github.io/">Docs</NavLi>
		<NavLi href="https://crossd.tech">Project & Blog</NavLi>
	</NavUl> -->
	<div class="absolute left-[calc(50%-60px)]">
		<Label class="mx-auto flex w-fit">Action History</Label>
		<ButtonGroup class="space-x-px"
			><Button
				class="bg-gray-400 disabled:hover:bg-gray-400 dark:bg-gray-500 dark:disabled:hover:bg-gray-500"
				disabled={disableBack}
				color="dark"
				on:click={backPressed}><CaretLeftSolid /></Button
			>
			<Button
				class="bg-gray-400 disabled:hover:bg-gray-400 dark:bg-gray-500 dark:disabled:hover:bg-gray-500"
				color="dark"
				disabled={disableForth}
				on:click={forthPressed}><CaretRightSolid /></Button
			>
			<Button color="red" disabled={disableForth} on:click={cancelPressed}><CloseOutline /></Button>
			<Button color="green" disabled={disableForth} on:click={savePressed}
				><FloppyDiskAltOutline /></Button
			>
			<!-- {#if !disableForth}
				<Button color="red"><CloseOutline /></Button>
				<Button color="green"><FloppyDiskAltOutline /></Button>
			{/if} -->
		</ButtonGroup>

		<!-- <Button
			class="bg-gray-400 disabled:hover:bg-gray-400 dark:bg-gray-500 dark:disabled:hover:bg-gray-500"
			disabled={disableBack}
			color="dark"
			on:click={backPressed}><CaretLeftSolid /></Button
		>
		<Button
			class="bg-gray-400 disabled:hover:bg-gray-400 dark:bg-gray-500 dark:disabled:hover:bg-gray-500"
			color="dark"
			disabled={disableForth}
			on:click={forthPressed}><CaretRightSolid /></Button
		>
		
		<Button color="red"><CloseOutline /></Button>
		<Button color="green"><FloppyDiskAltOutline /></Button> -->
		<!-- outline outline-gray-600 dark:outline-gray-300 dark:hover:outline-gray-500 -->
	</div>

	<div
		on:click={() => {
			theme.set(localStorage.getItem('color-theme'));
		}}
	>
		<DarkMode {btnClass} />
	</div>
</Navbar>

<slot />

<!-- #ef3b92 -->
<!-- #0fa -->
<!-- #ff124f -->

<!-- broken base color: #3a0824 -->
<style lang="scss">
	$basic-color: #4e254e;
	$basic-shadow: none;
	$color-shadow:
		0px 0px 2px #fe75fe,
		1px 1px #fe75fe,
		2px 2px 2px #fe75fe,
		-1px -1px 2px #fe75fe;
	$color-rgba: rgba(10, 9, 9, 0.8);

	:global(nav) {
		border-bottom-width: 2px;
		margin-bottom: 1em;
	}
	@font-face {
		font-family: KogniGear;
		src: url('/KogniGear.ttf');
	}
	@font-face {
		font-family: GlitchGoblin;
		src: url('/GlitchGoblin-2O87v.ttf');
	}
	@font-face {
		font-family: Saiba;
		src: url('/SAIBA-45.ttf');
	}
	@font-face {
		font-family: SaibaOutline;
		src: url('/SAIBA-45-Outline.ttf');
	}
	@font-face {
		font-family: neuropolx;
		src: url('/neuropol-x-free.rg-regular.otf');
	}
	@font-face {
		font-family: ubuntu;
		src: url('/ubuntu.regular.ttf');
	}
	@font-face{
		font-family: ubuntu-mono;
		src: url('/ubuntu.mono.ttf');
	}
	@font-face{
		font-family: ubuntu-mono-bold;
		src: url('/ubuntu.mono-bold.ttf');
	}
	@font-face {
		font-family: neuropolitical;
		src: url('/neuropolitical.rg-regular.otf');
	}
	@font-face {
		font-family: ethnocentric;
		src: url('/ethnocentric.rg-regular.otf');
	}
	@font-face {
		font-family: zekton;
		src: url('/zekton-free.rg-regular.otf');
	}
	@font-face {
		font-family: nulshock;
		src: url('/nulshock.rg-bold.otf');
	}
	@font-face {
		font-family: angerpoise;
		src: url('/angerpoise-lampshade.regular.otf');
	}
	@font-face {
		font-family: saved-by-zero;
		src: url('/saved-by-zero.regular.otf');
	}
	@font-face {
		font-family: relish-gargler;
		src: url('/relish-gargler.regular.otf');
	}
	
	.heading {
		font-family: 'KogniGear';
		color: #7a04eb;
		z-index: 100;
		text-shadow:
			0 0 7px #fff,
			0 0 10px #fff,
			0 0 21px #fff,
			0 0 42px #7a04eb,
			0 0 82px #7a04eb,
			0 0 92px #7a04eb,
			0 0 102px #7a04eb,
			0 0 151px #7a04eb;
		span {
			animation: neon-letter 2.5s infinite;
		}
	}
	:global(div) {
		font-family: 'KogniGear';
	}
	@keyframes neon-letter {
		from,
		10% {
			text-shadow: $color-shadow;
			color: $color-rgba;
		}
		10%,
		20% {
			text-shadow: $basic-shadow;
			color: $basic-color;
		}
		20%,
		22% {
			text-shadow: $color-shadow;
			color: $color-rgba;
		}
		22%,
		25% {
			text-shadow: $basic-shadow;
			color: $basic-color;
		}
		25%,
		32% {
			text-shadow: $color-shadow;
			color: $color-rgba;
		}
		32%,
		35% {
			text-shadow: $basic-shadow;
			color: $basic-color;
		}
		35%,
		40% {
			text-shadow: $color-shadow;
			color: rgba(10, 9, 9, 0.7);
		}
		40%,
		80% {
			color: $color-rgba;
		}
		80%,
		100% {
			text-shadow: $basic-shadow;
			color: $basic-color;
		}
	}
</style>
