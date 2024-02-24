<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Button } from '@/components/ui/button';
	import Input from '@/components/ui/input/input.svelte';
	import type { SingleSocialItem } from '@/types/customizations';

	import UserPanelItemWrapper from '@/ui/UserPanelItemWrapper.svelte';
	import type { ActionResult } from '@sveltejs/kit';
	import { X } from 'lucide-svelte';

	function enhancedFooterTextChange() {
		return async ({ result }: { result: ActionResult }) => {
			// Do Something
			await applyAction(result);
			invalidateAll();
		};
	}

	function enhancedsocialLinksChange() {
		return async ({ result }: { result: ActionResult }) => {
			// Do Something
			await applyAction(result);
			invalidateAll();
		};
	}

	let socialLinks: SingleSocialItem[] = [
		{ title: 'A', href: '/a', fa_icon: 'fa-facebook' },
		{ title: 'B', href: '/a', fa_icon: 'fa-twitter' }
	];

	$: nav_json_internal = JSON.stringify(socialLinks);
</script>

<UserPanelItemWrapper title="Footer Text">
	<div class="sec flex flex-col gap-3 py-3">
		<form
			action="?/changeFooterText"
			class="grid w-full max-w-sm items-center gap-1.5"
			method="post"
		>
			<Input id="footerText" type="text" />
			<Button type="submit" class="bg-black text-white">Change Footer Text</Button>
		</form>
	</div>
</UserPanelItemWrapper>

<UserPanelItemWrapper title="Social Links">
	<div class="sec flex flex-col gap-3 py-3">
		{#each socialLinks as link, idx}
			<span class="text-sm text-black dark:text-black">
				Link #{idx + 1}
			</span>
			<div class="flex flex-col items-center gap-2 md:flex-row">
				<Input type="text" maxlength={20} bind:value={link.title} />
				<Input type="text" bind:value={link.title} />
				<Input type="text" bind:value={link.fa_icon} />

				<button
					on:click={() => {
						socialLinks = socialLinks.filter((_, i) => i !== idx);
					}}
					class="text-bl h-6 w-6 rounded-md bg-stone-500 text-white"
				>
					<X class="" />
				</button>
			</div>
		{/each}
	</div>

	<div class=" flex gap-4">
		<!-- We'll send the ready json-->

		<Button
			variant="outline"
			class=" "
			on:click={() => {
				console.log('Add Link');
				socialLinks = [...socialLinks, { title: 'Link Title', href: '/', fa_icon: 'facebook' }];
			}}
			>{socialLinks?.length > 0 ? 'Add another link' : 'Add link'}
		</Button>
		<form action="?/changeSocialLinks" use:enhance={enhancedsocialLinksChange} method="post">
			<input type="hidden" name="social_json" bind:value={nav_json_internal} />
			<Button class="bg-black text-white">Save/Update Links</Button>
		</form>
	</div>
</UserPanelItemWrapper>
