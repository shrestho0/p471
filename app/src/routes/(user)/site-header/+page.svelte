<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { applyAction, enhance } from '$app/forms';
	import { invalidate, invalidateAll } from '$app/navigation';
	import type { ActionResult } from '@sveltejs/kit';
	import { CircleDashed, X } from 'lucide-svelte';

	import UserPanelItemWrapper from '@/ui/UserPanelItemWrapper.svelte';
	import type { SingleNavItem, SiteHeaderType } from '@/types/customizations';
	import type { User } from '@/types/users';
	import { toast } from 'svelte-sonner';
	import { getFileUrl } from '@/utils/common';
	import PreDebug from '@/dev/PreDebug.svelte';

	function enhancedLogoRemoval() {
		return async ({ result }: { result: ActionResult }) => {
			// Do Something
			await applyAction(result);
			invalidateAll();
		};
	}

	function enhancedLogoChange() {
		return async ({ result }: { result: ActionResult }) => {
			// Do Something

			switch (result.type) {
				case 'success':
					toast.success(result?.data?.message, {
						duration: 3000,
						position: 'top-right',
						class: 'mt-8'
					});
					invalidateAll();
					logoUrl = result?.data?.logo
						? getFileUrl(siteHeader?.collectionId, siteHeader.id, result.data.logo)
						: '';
					break;
				case 'failure':
					toast.error(result?.data?.message, {
						duration: 3000,
						position: 'top-right',
						class: 'mt-8'
					});
					break;
				default:
					break;
			}

			loadingStuff.changeLogo = false;
			await applyAction(result);
		};
	}

	function enhancedNavLinksChange() {
		return async ({ result }: { result: ActionResult }) => {
			// Do Something
			await applyAction(result);
			invalidateAll();
		};
	}

	function enhanceSubmission() {
		return async ({ result }: { result: ActionResult }) => {
			// Do Something
			switch (result.type) {
				case 'success':
					toast.success(result?.data?.message, {
						duration: 3000,
						position: 'top-right',
						class: 'mt-8'
					});
					break;
				case 'failure':
					toast.error(result?.data?.message, {
						duration: 3000,
						position: 'top-right',
						class: 'mt-8'
					});
					break;
				default:
					break;
			}
			await applyAction(result);
			invalidateAll();
		};
	}

	let navLinks: SingleNavItem[] = [
		{ title: 'A', href: '/a' },
		{ title: 'B', href: '/a' }
	];

	$: nav_json_internal = JSON.stringify(navLinks);

	const searchObj = {
		q: '',
		results: [],
		status: 'idle',
		message: ''
	} as {
		q: string;
		results: SingleNavItem[];
		status: 'idle' | 'loading' | 'success' | 'error';
		message?: string;
	};

	async function searchPages() {
		searchObj.status = 'loading';
		const endpoint = `/api/pages/search/?t=page&q=${searchObj.q}`;
		const res = await fetch(endpoint);
		const data = await res.json();
		if (data?.success === true) {
			searchObj.status = 'success';
			searchObj.results = data?.results;
		} else if (data?.success === false) {
			searchObj.status = 'error';
			searchObj.message = data?.message;
		}
	}

	/**
	 * User Searches for links
	 */

	const loadingStuff = {
		changeTitle: false,
		changeLogo: false,
		removeLogo: false
	};

	export let data: { siteHeader: SiteHeaderType; user: User };
	const siteHeader = data?.siteHeader as SiteHeaderType;

	let logoUrl = siteHeader.logo
		? getFileUrl(siteHeader?.collectionId, siteHeader.id, siteHeader.logo)
		: '';
</script>

<UserPanelItemWrapper title="Site Title">
	<div class="sec flex flex-col gap-3 py-3">
		<div class="user-logo">
			<form
				action="?/changeTitle"
				class="flex items-center gap-2 text-black dark:text-black"
				method="post"
				use:enhance={enhanceSubmission}
			>
				<input type="hidden" name="siteHeaderId" value={siteHeader.id} />
				<Input name="site_title" type="text" bind:value={siteHeader.site_title} />
				<Button type="submit" class="bg-black text-white">Update Title</Button>
			</form>
		</div>
	</div>
</UserPanelItemWrapper>

<!-- <PreDebug data={siteHeader} /> -->

<UserPanelItemWrapper title="Site Logo">
	<div class="sec flex flex-col gap-3 py-3">
		<div class="user-logo">
			<form
				action="?/removeLogo"
				class="flex items-center gap-2 text-black dark:text-black"
				method="post"
				use:enhance={enhancedLogoChange}
			>
				<input type="hidden" name="siteHeaderId" value={siteHeader.id} />
				{#key logoUrl}
					{#if logoUrl}
						<div class="flex flex-col gap-2 py-3">
							<!-- [[LOGO IMAGE]] -->
							<img src={logoUrl} alt="Site Logo" class="w-20 border bg-gray-200 p-2" />

							<Button
								type="submit"
								on:click={() => {
									loadingStuff.removeLogo = true;
								}}
								variant="outline"
							>
								{#if loadingStuff.removeLogo}
									<CircleDashed class=" mr-2 h-4 w-4 animate-spin" />
									Removing Logo
								{:else}
									Remove
								{/if}
							</Button>
						</div>
					{:else}
						<p class="py-2 text-black dark:text-black">No logo uploaded</p>
					{/if}
				{/key}
			</form>
		</div>

		<form
			action="?/changeLogo"
			class="grid w-full max-w-sm items-center gap-1.5"
			method="post"
			use:enhance={enhancedLogoChange}
			enctype="multipart/form-data"
		>
			<input type="hidden" name="siteHeaderId" value={siteHeader.id} />

			<Label for="picture" class="text-black dark:text-black">Upload new logo</Label>

			<Input required name="logo" id="picture" type="file" accept="image/*" />
			<Button
				on:click={() => {
					loadingStuff.changeLogo = true;
				}}
				type="submit"
				class="bg-black text-white"
			>
				{#if loadingStuff.changeLogo}
					<CircleDashed class=" mr-2 h-4 w-4 animate-spin" />
					Changing Logo
				{:else}
					Change Logo
				{/if}
			</Button>
		</form>
	</div>
</UserPanelItemWrapper>

<UserPanelItemWrapper title="Navbar Links">
	<div class="sec flex flex-col gap-3 py-3">
		<div class="w-full">
			<h2>Search for pages and add links:</h2>
			<form class="flex gap-3" on:submit|preventDefault>
				<Input bind:value={searchObj.q} type="text" placeholder="Search for pages" minlength={1} />
				<Button
					type="submit"
					on:click={searchPages}
					disabled={searchObj.q?.trim()?.length < 1}
					class="bg-black text-white">Search</Button
				>
			</form>

			{#if searchObj.status === 'loading'}
				<!-- Loading Spinner-->
				<div class="flex w-full items-center justify-center p-4">
					<div class="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-black"></div>
				</div>
			{:else if searchObj.status === 'success'}
				{#if searchObj.results.length < 1}
					<p class="text-black dark:text-black">No results found</p>
				{:else}
					<table class="table table-fixed items-center gap-2">
						<tr>
							<th>Page Title</th>
							<th colspan="2">Actions</th>
						</tr>
						{#each searchObj.results as result}
							<tr class="m-3 py-3">
								<td>
									<span class="text-sm text-black dark:text-black">{result.title}</span>
								</td>
								<td>
									<Button variant="outline" class="" href={result.href} target="_blank"
										>Preview</Button
									>
								</td>
								<td>
									<Button
										on:click={() => {
											navLinks = [...navLinks, result];
										}}
										class="bg-black text-white">Add</Button
									>
								</td>
							</tr>
						{/each}
					</table>
				{/if}
			{:else if searchObj.status === 'error'}
				<p class="text-red-500">Error fetching pages</p>
			{/if}
		</div>
		{#each navLinks as link, idx}
			<span class="text-sm text-black dark:text-black">
				Link #{idx + 1}
			</span>
			<div class="flex flex-col items-center gap-2 md:flex-row">
				<Input type="text" maxlength={20} bind:value={link.title} />
				<Input type="text" bind:value={link.title} />
				<button
					on:click={() => {
						navLinks = navLinks.filter((_, i) => i !== idx);
					}}
					class="text-bl h-6 w-6 rounded-md bg-stone-500 text-white"
				>
					<X class="" />
				</button>
			</div>
		{/each}
	</div>
	<div class=" flex gap-4">
		<Button
			variant="outline"
			class=" "
			on:click={() => {
				console.log('Add Link');
				navLinks = [...navLinks, { title: 'Link Title', href: '/' }];
			}}>{navLinks?.length > 0 ? 'Add another link' : 'Add link'}</Button
		>
		<!-- We'll send the ready json-->
		<form action="?/changeNavLinks" method="post" use:enhance={enhancedNavLinksChange}>
			<input type="hidden" name="nav_json" bind:value={nav_json_internal} />
			<Button class="bg-black text-white">Save/Update Links</Button>
		</form>
	</div>
</UserPanelItemWrapper>
