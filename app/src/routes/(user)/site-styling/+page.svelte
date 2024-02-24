<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { Select } from '@/components/ui/select';
	import type { SiteStyle } from '@/types/customizations';
	import UserPanelItemWrapper from '@/ui/UserPanelItemWrapper.svelte';
	import type { ActionResult } from '@sveltejs/kit';
	import { onMount } from 'svelte';

	function enhancedSiteStyleChange() {
		return async ({ result }: { result: ActionResult }) => {
			// Do Something
			await applyAction(result);
			invalidateAll();
		};
	}

	function enhancedFontChange() {
		return async ({ result }: { result: ActionResult }) => {
			// Do Something
			await applyAction(result);
			invalidateAll();
		};
	}

	let allowedTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a'];

	let siteStyles: SiteStyle = {
		fontFamily: 'Roboto',
		fontLoadUrl: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap',
		styleJson: {
			h1: {
				color: 'black',
				'font-size': '2rem'
			}
		}
	};

	let fontAndLinks = [
		{ fontName: 'A', fontLoadUrl: '' },
		{ fontName: 'Roboto', fontLoadUrl: 'https://...' }
	];

	onMount(() => {
		// populate tag styles if not present
		allowedTags.forEach((tag) => {
			if (!siteStyles.styleJson[tag]) {
				siteStyles.styleJson[tag] = {
					color: 'black',
					'font-size': ''
				};
			}
		});
	});
</script>

<UserPanelItemWrapper title="Font">
	<div class="sec flex flex-col gap-3 py-3">
		<form
			action="?/changeSiteStyle"
			class="grid w-full max-w-sm items-center gap-1.5"
			method="post"
			use:enhance={enhancedFontChange}
		>
			<select class="rounded bg-gray-200 p-2" bind:value={siteStyles.fontFamily}>
				{#each fontAndLinks as { fontName, fontLoadUrl }}
					<option value={fontName}>{fontName}</option>
				{/each}
			</select>

			<Button type="submit" class="bg-black text-white">Save Font</Button>
		</form>
	</div>
</UserPanelItemWrapper>

<UserPanelItemWrapper title="Colors and Font Sizes">
	<div class="sec flex flex-col gap-3 py-3">
		<form
			action="?/changeSiteStyle"
			class="grid w-full max-w-sm items-center gap-1.5"
			method="post"
			use:enhance={enhancedSiteStyleChange}
		>
			{#each Object.keys(siteStyles.styleJson) as tag}
				<div class="flex items-center justify-center gap-1">
					<Label for={tag} class="w-10 font-bold text-black dark:text-black">{tag}</Label>
					<Input id={tag} type="color" bind:value={siteStyles.styleJson[tag]['color']} />
					<Input id={tag} type="text" bind:value={siteStyles.styleJson[tag]['font-size']} />
				</div>
			{/each}

			<Button type="submit" class="bg-black text-white">Save Colors</Button>
		</form>
	</div>
</UserPanelItemWrapper>
