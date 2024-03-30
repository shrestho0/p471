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

	function enhancedResendVerification() {
		return async ({ result }: { result: ActionResult }) => {
			switch (result.type) {
				case 'failure':
					toast.error(result?.data?.message, {
						position: 'top-center'
					});
					break;
				case 'success':
					toast.success(result?.data?.message, {
						position: 'top-center'
					});
					break;
			}
		};
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

			{#if !data?.user?.verified}
				<div class="card m-4 flex items-center justify-center bg-indigo-400 p-3">
					<AlertTriangle />
					Email Not Verified.
					<form
						method="post"
						action="/update-info/?/verifyEmail"
						use:enhance={enhancedResendVerification}
					>
						<button type="submit"> Resend verification </button>
					</form>
				</div>
			{/if}

			<PageContentBlock>
				<slot />
			</PageContentBlock>
		</aside>
	</div>
</div>
