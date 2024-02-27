<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { applyAction, enhance } from '$app/forms';
	import { invalidate, invalidateAll } from '$app/navigation';
	import type { ActionResult } from '@sveltejs/kit';
	import { X } from 'lucide-svelte';

	import UserPanelItemWrapper from '@/ui/UserPanelItemWrapper.svelte';
	import type { SingleNavItem, SiteHeaderType } from '@/types/customizations';
	import type { User } from '@/types/users';
	import { toast } from 'svelte-sonner';

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
			await applyAction(result);
			invalidateAll();
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
		const endpoint = `/api/search/?t=page&q=${searchObj.q}`;
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

	export let data: { siteHeader: SiteHeaderType; user: User };
	const siteHeader = data?.siteHeader as SiteHeaderType;
</script>

<UserPanelItemWrapper title="Site Logo">
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

<UserPanelItemWrapper title="Site Logo">
	<div class="sec flex flex-col gap-3 py-3">
		<div class="user-logo">
			<form
				action="?/removeLogo"
				class="flex items-center gap-2 text-black dark:text-black"
				method="post"
				use:enhance={enhancedLogoRemoval}
			>
				[[LOGO IMAGE]]
				<Button type="submit" class="bg-black text-white">Remove</Button>
			</form>
		</div>

		<form
			action="?/changeLogo"
			class="grid w-full max-w-sm items-center gap-1.5"
			method="post"
			use:enhance={enhancedLogoChange}
		>
			<Label for="picture" class="text-black dark:text-black">Upload new logo</Label>
			<Input id="picture" type="file" />
			<Button type="submit" class="bg-black text-white">Change Logo</Button>
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
