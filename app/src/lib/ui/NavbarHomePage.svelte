<script lang="ts">
	import { AppLinks } from '@/utils/app-links';
	import Logo from '@/ui/Logo.svelte';
	import Button from '@/components/ui/button/button.svelte';
	import LightSwitch from '@/ui/LightSwitch.svelte';
	import { toast } from 'svelte-sonner';
	import { browser } from '$app/environment';
	import { fly, slide } from 'svelte/transition';
	import { page } from '$app/stores';

	let open = true;
	function toggleMobileMenu() {
		open = !open;
	}

	export let showMenuItems = true;

	export const menuitems = [
		{
			title: 'About',
			id: 'top'
		},
		{
			title: 'Features',
			id: 'features'
		},
		{
			title: 'FAQs',
			id: 'faqs'
		},
		{
			title: 'Contribute',
			id: 'contribute'
		},
	] as Array<{ title: string; id: string }>;

	let innerWidth: number;
	let scrollY: number;
	let onMobile = false;
	let navbareKajHobe = false;

	$: open = innerWidth > 768;
	$: onMobile = innerWidth <= 768;

	$: navbareKajHobe = scrollY > 100;

	let selectedIdx = -1; // -1

	function scrollToPosTop(top: number = 0) {
		if (!browser) return;
		window.scrollTo({
			top: top,
			behavior: 'smooth'
		});

		return;
	}

	function handleAnchorClick(event: any) {
		event.preventDefault();

		const link = event.currentTarget;

		const anchorId = new URL(link.href).hash.replace('#', '');

		const anchor = document.getElementById(anchorId);

		if (anchor) {
			// Find id from the list
			menuitems.forEach((el, idx) => {
				// if(el.id) ==
				if (el.id == anchorId) {
					selectedIdx = idx;
				}
				return;
			});

			scrollToPosTop(anchor.offsetTop);
			return;
		}

		const end = link?.href?.split('/')?.pop();
		if (end == '') {
			selectedIdx = -1;
			scrollToPosTop(0);
			return;
		}

		toast.warning('page with id is not implemented');
	}
</script>

<!-- svelte window size -->
<svelte:window bind:innerWidth bind:scrollY />

<div
	id="top"
	class="fixed z-50 mx-auto flex w-full max-w-screen-xl flex-col {onMobile && navbareKajHobe
		? 'bg-gray-50 dark:bg-stone-950'
		: onMobile && open
			? 'bg-gray-50 dark:bg-stone-950'
			: ''} px-4 md:flex-row md:items-center md:justify-between md:bg-transparent md:px-6 md:pt-2 lg:px-8"
>
	<div class="flex flex-row items-center justify-between p-4">
		<!-- Take Old Classes Back for dark mode -->
		<a
			on:click={handleAnchorClick}
			href={AppLinks.HOME}
			class="focus:shadow-outline flex items-center gap-3 rounded-lg text-lg font-semibold tracking-widest text-gray-900 focus:outline-none"
		>
			<Logo mode="dark" />
		</a>
		<div class="flex items-center justify-center gap-2">
			<LightSwitch className="flex md:hidden" />
			<button
				class="relative h-10 w-10 text-gray-500 focus:outline-none md:hidden"
				on:click={toggleMobileMenu}
			>
				<span class="sr-only">Open main menu</span>
				<div
					class="absolute left-1/2 top-1/2 block w-5 -translate-x-1/2 -translate-y-1/2 transform"
				>
					<span
						aria-hidden="true"
						class=" {open
							? 'rotate-45'
							: '-translate-y-1.5'}  absolute block h-0.5 w-5 transform bg-current transition duration-200 ease-in-out"
					>
					</span>
					<span
						aria-hidden="true"
						class="{open
							? 'opacity-0'
							: ''} absolute block h-0.5 w-5 transform bg-current transition duration-200 ease-in-out"
					>
					</span>
					<span
						aria-hidden="true"
						class="{open
							? '-rotate-45'
							: 'translate-y-1.5'} absolute block h-0.5 w-5 transform bg-current transition duration-200 ease-in-out"
					>
					</span>
				</div>
			</button>
		</div>
	</div>

	{#if open}
		<nav
			class="{!showMenuItems
				? 'hidden'
				: ''} flex w-full flex-grow flex-col gap-2 pb-4 transition-all ease-out md:mt-0 md:flex-row md:items-center md:justify-center md:pb-0 {!onMobile &&
			scrollY > 100
				? 'rounded-xl border border-gray-900 bg-gray-50/80 md:mx-16 lg:mx-32 xl:mx-48 dark:border-gray-100 dark:bg-stone-950/80  '
				: ''}"
			in:fly
			out:fly
		>
			<div
				class="flex flex-grow flex-col gap-2 text-center md:mx-auto md:flex md:flex-row md:items-center md:justify-center {!onMobile &&
				scrollY > 100
					? 'p-3'
					: ''}"
			>
				<!-- svelte-ignore a11y-interactive-supports-focus -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					role="button"
					on:click={() => {
						if (onMobile) toggleMobileMenu();
					}}
					class="relative"
				>
					{#each menuitems as items, idx (items.title)}
						<a
							href={'#' + items.id}
							on:click={handleAnchorClick}
							class="rounded-md px-3 py-1.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
							{selectedIdx != undefined && selectedIdx == idx ? 'underline' : ''}
							">{items.title}</a
						>
					{/each}
				</div>
			</div>
		</nav>

		<div
			in:fly
			out:fly
			class=" my-4 flex flex-col gap-4 transition-all ease-out md:mt-0 md:flex-row"
		>
			<!-- Hide On Mobile -->
			<div class="">
				<LightSwitch className="hidden md:flex" />
			</div>
			<!-- <Link href="/login" style="outline">Login</Link> -->
			<!-- <Link href="/register">Register</Link> -->
			{#if $page?.data.user}
				<Button data-sveltekit-reload href={AppLinks.USER_DASHBOARD} variant="outline"
					>Dashboard</Button
				>
			{:else if $page?.data.admin}
				<Button href={AppLinks.ADMIN_DASHBOARD} variant="outline">Dashboard</Button>
			{:else}
				<Button href="/login" variant="default">Login</Button>
				<Button href="/register" variant="outline">Register</Button>
			{/if}
		</div>
	{/if}
</div>
