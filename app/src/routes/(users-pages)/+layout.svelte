<script lang="ts">
	import PreDebug from '@/dev/PreDebug.svelte';
	import type { SiteDataTypes } from '@/types/customizations';
	import { onDestroy, onMount } from 'svelte';
	import { ModeWatcher, mode, setMode } from 'mode-watcher';
	import { page } from '$app/stores';

	let loading = true;
	export let tempMode: string;
	import * as Alert from '$lib/components/ui/alert';
	import { AlertTriangle, X } from 'lucide-svelte';
	import { Button } from '@/components/ui/button';
	import '$lib/ui/app.pcss';

	// we'll keep dark and light css same

	let hideNotice = false;

	onMount(() => {
		console.log('mounted');
		loading = false;
	});
</script>

<svelte:head>
	<!-- <title>{data?.header?.site_title ? data.header.site_title + '| mCMS' : 'mCMS'}</title> -->
	<link
		rel="stylesheet"
		href="/api/site-style?u={$page.url.pathname?.split('/')[1]}&v={Math.random()}"
	/>
</svelte:head>

<!-- {#if loading}
	<div class="flex h-[80%] items-center justify-center bg-white dark:bg-white">
		<div class="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
	</div> -->
<!-- 
{#if !hideNotice}
	{#if $page?.data.user}
		<div
			class="absolute flex items-center justify-center gap-3 bg-black p-4 text-gray-100 dark:bg-black"
		>
			<span>You are logged in as {$page.data?.user?.name}</span>
			<Button
				class="cursor-pointer"
				on:click={() => {
					console.log('clicked');
					hideNotice = true;
				}}
			>
				<X color="red" class="   " />
			</Button>
		</div>
	{:else if $page?.data.admin}
		<div class="flex items-center justify-center gap-3 bg-black p-4 text-gray-100 dark:bg-black">
			<span>You are logged in as {$page.data?.admin?.email}</span>
			<Button
				class="cursor-pointer"
				on:click={() => {
					console.log('clicked');
					hideNotice = true;
				}}
			>
				<X color="red" class="   " />
			</Button>
		</div>
	{/if}
{/if} -->
<!-- {/if} -->
{#if $page.data?.pageContent?.status == 'banned'}
	<div class="absolute top-0 w-full bg-red-200 text-center">
		<div class="flex w-full items-center justify-center gap-3">
			<AlertTriangle />
			<p>This page has been banned</p>
		</div>
	</div>
{:else if $page.data?.pageContent?.status == 'draft'}
	<div class="absolute top-0 w-full bg-cyan-200 text-center">
		<div class="flex w-full items-center justify-center gap-3">
			<AlertTriangle />
			<p>This page is in draft</p>
		</div>
	</div>
{/if}

<slot />
