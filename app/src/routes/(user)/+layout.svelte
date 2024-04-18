<script lang="ts">
	import LightSwitch from '@/ui/LightSwitch.svelte';
	import Logo from '@/ui/Logo.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import PageHeaderBlock from '@/ui/PageHeaderBlock.svelte';
	import PageContentBlock from '@/ui/PageContentBlock.svelte';
	import { page } from '$app/stores';
	import Separator from '@/components/ui/separator/separator.svelte';
	import SidePanel from '@/ui/SidePanel.svelte';
	import { customizationPages, userPanelPages } from '@/utils/authenticated-links';
	import { toTitleCase } from '@/utils/common';
	import { AlertTriangle } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import type { ActionResult } from '@sveltejs/kit';
	import Button from '@/components/ui/button/button.svelte';
	import PreDebug from '@/dev/PreDebug.svelte';
	import EmailNotVerified from '@/ui/EmailNotVerified.svelte';
	import UnverifiedFunctionalityUse from '@/ui/UnverifiedFunctionalityUse.svelte';
	export let data: {
		user: {
			name: string;
			email: string;
			verified?: boolean;
		};
	};

	function sanitizeTitle(title: string) {
		// - to space
		title = title.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
		// / to none
		title = title.replace(/\//g, '');
		// _ to none
		title = title.replace(/_/g, '');

		title = title.trim();
		// Capitalize first letter
		return toTitleCase(title);
	}
</script>

<svelte:head>
	<title
		>{sanitizeTitle($page.url.pathname?.split('/')[1])}
		{$page.url.pathname?.split('/')[1] ? ' | mCMS' : 'mCMS'}</title
	>
</svelte:head>

<div class="h-screen w-full">
	<div class="flex h-screen w-full overflow-x-hidden overflow-y-hidden">
		<aside class="hidden h-full w-[30%] max-w-[300px] border-r border-gray-200 bg-white md:block">
			<div class="flex h-16 items-center justify-center gap-3 border-b border-gray-200">
				<Logo className="text-black" />
			</div>

			<SidePanel pages={userPanelPages} {customizationPages} />
		</aside>
		<aside class=" w-full overflow-x-hidden bg-gray-50">
			<PageHeaderBlock
				user={data?.user}
				title={sanitizeTitle($page.url.pathname)}
				pages={userPanelPages}
				{customizationPages}
			/>

			<PageContentBlock>
				{#if data.user.verified}
					<slot />
				{:else if $page.url.pathname.includes('dashboard')}
					<EmailNotVerified />
					<slot />
				{:else}
					<EmailNotVerified />
					<UnverifiedFunctionalityUse />
				{/if}
			</PageContentBlock>
		</aside>
	</div>
</div>
