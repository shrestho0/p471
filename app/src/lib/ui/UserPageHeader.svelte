<script lang="ts">
	import { page } from '$app/stores';
	import type { SiteHeaderType } from '@/types/customizations';
	import { getLogoUrl } from '@/utils/common';

	export let headerData: SiteHeaderType;
	let pageUrl = '';
	$: pageUrl = $page.url.pathname?.split('/')[1];
</script>

<header
	class="flex flex-col items-center justify-center gap-3 bg-black p-4 text-gray-100 dark:bg-black dark:text-gray-100"
>
	<a href="/${pageUrl}">
		{#if headerData.logo}
			<img
				style="max-height:200px; width:auto;"
				src={getLogoUrl(headerData.collectionId, headerData.id, headerData.logo)}
				alt={headerData.site_title}
			/>
		{:else}
			<div class="text-2xl font-bold">{headerData.site_title}</div>
		{/if}
	</a>
	{#if headerData?.nav_json?.length > 0}
		<nav class="nav">
			<ul class="flex items-center gap-3">
				{#each headerData.nav_json as item}
					<li>
						<a class="text-white hover:text-white/80" href={item.href}>{item.title}</a>
					</li>
				{/each}
			</ul>
		</nav>
	{/if}
</header>
