<script>
	import '../app.css';
	import {
		theme,
		back,
		forth,
		showBack,
		showForth,
		cancel,
		save,
		activeTab,
		db,
		messageStore
	} from '$lib/util';
	import {
		Navbar,
		NavBrand,
		DarkMode,
		NavUl,
		NavLi,
		Button,
		ButtonGroup,
		Label,
		P,
		Drawer,
		CloseButton,
		Hr,
		Dropdown,
		Toggle,
		Span,
		Indicator,
		Card,
		Progressbar,
		Popover
	} from 'flowbite-svelte';
	import {
		CaretLeftSolid,
		CaretRightSolid,
		CloseOutline,
		CogSolid,
		EnvelopeSolid,
		FloppyDiskAltOutline,
		FloppyDiskOutline,
		InfoCircleSolid
	} from 'flowbite-svelte-icons';
	// import logo from '$lib/assets/logo.webp';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { sineIn } from 'svelte/easing';
	import MessageItem from './MessageItem.svelte';
	import { source } from 'sveltekit-sse';
	import { DateTime } from 'luxon';
	import ProgressInfo from './ProgressInfo.svelte';
	// let messages = [];
	// messageStore.set(messages);

	let disableBack = false;
	showBack.subscribe((show) => {
		disableBack = !(show ?? true);
	});
	let disableForth = false;
	showForth.subscribe((show) => {
		disableForth = !(show ?? true);
	});

	const btnClass =
		'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-lg z-50 p-2.5';
	// const btnClass =
	// 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-lg p-2.5 fixed right-2 top-12  md:top-3 md:right-2 z-50';
	onMount(() => {
		if ('color-theme' in localStorage) {
			// explicit preference - overrides author's choice
			localStorage.getItem('color-theme') === 'dark'
				? window.document.documentElement.classList.add('dark')
				: window.document.documentElement.classList.remove('dark');
		} else {
			// browser preference - does not overrides
			if (window.matchMedia('(prefers-color-scheme: dark)').matches)
				window.document.documentElement.classList.add('dark');
		}
		theme.set(localStorage.getItem('color-theme') ?? 'light');
		futureFont = localStorage.getItem('futuristic-font');
		animatedHeading = localStorage.getItem('animated-heading');
	});
	onMount(async () => {
		const response = await fetch('/events', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		// messages = await response.json();
		messageStore.set(await response.json());
		console.log(get(messageStore));
		const value = source('/events/sse').select('message');
		value.subscribe((message) => {
			console.log('update message');
			// not triggered on same message
			// Update the reactive variable
			if (message) {
				console.log(message);
				let msg = JSON.parse(message);
				// messages.push(msg);
				messageStore.set([msg, ...get(messageStore)]);
				if (hidden6) {
					msgIndicatorShown = true;
				}
				console.log(get(messageStore));
				// if (!(dev['lb_id'] in devices)) {
				// 	// deviceStore.set(devices);
				// 	devices[dev['lb_id']] = dev;
				// }
				// console.log(messages);
			}
		});
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

	const clearAll = () => {
		fetch('events/delete/all', {
			method: 'POST',
			body: JSON.stringify({}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		messageStore.set([]);
	};

	async function deploy() {
		console.log('deploy called');
		let doc = await get(db).get(get(activeTab));
		console.log('after get db');
		fetch('flow/deploy', {
			method: 'POST',
			body: JSON.stringify({ payload: doc }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	async function disable() {
		console.log('disable called');
		let doc = await get(db).get(get(activeTab));
		console.log('after get db');
		fetch('flow/disable', {
			method: 'POST',
			body: JSON.stringify({ payload: doc }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	let hidden6 = true;
	let transitionParamsRight = {
		x: 320,
		duration: 200,
		easing: sineIn
	};

	let checked;

	function toggleMode() {
		document.documentElement.classList.toggle('dark');
		localStorage.setItem(
			'color-theme',
			localStorage.getItem('color-theme') == 'light' ? 'dark' : 'light'
		);
		theme.set(localStorage.getItem('color-theme'));
	}

	function toggleFont() {
		if (localStorage.getItem('futuristic-font')) {
			localStorage.removeItem('futuristic-font');
			futureFont = null;
		} else {
			localStorage.setItem('futuristic-font', 'ubuntu');
			futureFont = 'ubuntu';
		}
	}
	let futureFont = null;

	function toggleAnimation() {
		if (localStorage.getItem('animated-heading')) {
			localStorage.removeItem('animated-heading');
			animatedHeading = null;
		} else {
			localStorage.setItem('animated-heading', 'inanimate');
			animatedHeading = 'inanimate';
		}
	}
	let animatedHeading = null;
	let msgIndicatorShown = false;
</script>

<svelte:window on:keydown={keypress} />
<main class={!futureFont ? 'future-font' : 'normal-font'}>
	<Navbar let:hidden let:toggle class="bg-gray-100" fluid={true}>
		<NavBrand href="/">
			<span class="heading self-center whitespace-nowrap text-4xl font-semibold dark:text-white">
				Lo<span class={!animatedHeading ? 'anim' : ''}>Ra</span>Mation
			</span>
		</NavBrand>
		<!-- <NavUl class="ml-auto">
		<NavLi href="/">Search</NavLi>
		<NavLi href="/doc">Metrics</NavLi>
		<NavLi href="https://fh-crossd.github.io/">Docs</NavLi>
		<NavLi href="https://crossd.tech">Project & Blog</NavLi>
	</NavUl> -->
		<!-- <div class="absolute left-[calc(50%-60px)]"> -->
		<div>
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
				<Button color="red" disabled={disableForth} on:click={cancelPressed}
					><CloseOutline /></Button
				>
				<Button color="green" disabled={disableForth} on:click={savePressed}
					><FloppyDiskAltOutline /></Button
				>
			</ButtonGroup>
		</div>
		<div>
			<Label class="mx-auto flex w-fit">Bridge Control</Label>
			<ButtonGroup class="space-x-px">
				<Button on:click={deploy} color="purple">Deploy changes</Button>
				<Button on:click={disable} color="red">Disable Flow</Button>
			</ButtonGroup>
		</div>

		<ProgressInfo/>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="flex">
			<div
				class="my-auto w-fit"
				on:click={() => {
					theme.set(localStorage.getItem('color-theme'));
				}}
			>
				<Button outline color="dark"><CogSolid /></Button>
				<Dropdown class="w-56 space-y-1 p-3">
					<li>
						<Toggle
							color="purple"
							class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
							checked={!Boolean(localStorage.getItem('futuristic-font'))}
							on:click={toggleFont}>Futuristic Font</Toggle
						>
					</li>
					<li>
						<Toggle
							color="purple"
							class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
							checked={!Boolean(localStorage.getItem('animated-heading'))}
							on:click={toggleAnimation}>Animated Heading</Toggle
						>
					</li>
					<li class="my-auto">
						<!-- <DarkMode {btnClass} /> -->
						<Toggle
							on:click={toggleMode}
							color="purple"
							checked={localStorage.getItem('color-theme') === 'dark'}
							class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">Dark Mode</Toggle
						>
					</li>
				</Dropdown>
				<!-- <DarkMode {btnClass} /> -->
				<!-- <Button class="!min-h-full">Status</Button> -->
				<!-- <div class="!min-h-[8rem] inline-block ml-2 w-36 !p-0 !m-0 mr-[-0.5rem] sm:mr-[-1rem] dark:hover:bg-gray-700 hover:bg-gray-200 bg-gray-100 dark:bg-gray-800">Status</div>
	</div> -->
			</div>
			<Button
				class="relative ml-2 inline-block h-14"
				color="dark"
				outline
				on:click={() => {
					hidden6 = !hidden6;
					msgIndicatorShown = false;
				}}
				>Status
				<Indicator
					hidden={!msgIndicatorShown}
					color="none"
					border
					size="lg"
					placement="top-right"
					class="bg-slate-600 text-xs font-bold ring-2 ring-purple-700 dark:bg-slate-300 dark:ring-purple-500"
				/>
			</Button>
		</div>
	</Navbar>

	<Drawer
		activateClickOutside={false}
		width="w-2/5"
		placement="right"
		transitionType="fly"
		transitionParams={transitionParamsRight}
		bind:hidden={hidden6}
		backdrop={true}
		id="sidebar6"
	>
		<div class="flex items-center">
			<h5
				id="drawer-label"
				class="mb-4 inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400"
			>
				<EnvelopeSolid class="me-2.5 h-5 w-5" />Status Messages
			</h5>
			<Button class="ml-auto" outline color="red" on:click={clearAll}>Clear all</Button>
			<CloseButton on:click={() => (hidden6 = true)} class="mb-4 dark:text-white" />
		</div>
		<Hr hrClass="my-5" class="!my-0" />
		<div class="space-y-2">
			{#each $messageStore as msg}
				<MessageItem name={msg.msg} id={msg.id} type={msg.type} timestamp={msg.timestamp} />
			{:else}
				<P>There are currently no messages.</P>
			{/each}

			<!-- <MessageItem name="test2" id="12" type="user"/> -->
		</div>
	</Drawer>

	<slot />
</main>

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
	@font-face {
		font-family: ubuntu-mono;
		src: url('/ubuntu.mono.ttf');
	}
	@font-face {
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
		span.anim {
			animation: neon-letter 2.5s infinite;
		}
	}
	:global(.future-font) {
		// font-family: 'nulshock';
		// font-family: 'ubuntu';
		font-family: 'KogniGear';
	}
	:global(.normal-font) {
		font-family: 'ubuntu';
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
