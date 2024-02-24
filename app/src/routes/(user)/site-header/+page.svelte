<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	import Button from '@/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { applyAction, enhance } from '$app/forms';
	import { invalidate, invalidateAll } from '$app/navigation';
	import type { ActionResult } from '@sveltejs/kit';
	import { X } from 'lucide-svelte';

	import UserPanelItemWrapper from '@/ui/UserPanelItemWrapper.svelte';
	import type { SingleNavItem } from '@/types/customizations';

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

	let navLinks: SingleNavItem[] = [
		{ title: 'A', href: '/a' },
		{ title: 'B', href: '/a' }
	];

	$: nav_json_internal = JSON.stringify(navLinks);
</script>

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
