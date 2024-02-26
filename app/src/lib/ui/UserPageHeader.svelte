<script lang="ts">
	import type { SiteHeaderType } from '@/types/customizations';

	export let headerData: SiteHeaderType = {
		site_title: "User's Site Title",
		logo_url: '',
		nav_json: [
			{ title: 'Home', href: '/' },
			{ title: 'About', href: '/about' }
		]
	};
</script>

<header
	class="flex flex-col items-center justify-center gap-3 bg-black p-4 text-gray-100 dark:bg-black dark:text-gray-100"
>
	{#if headerData.logo_url}
		<img src={headerData.logo_url} alt={headerData.site_title} />
	{:else}
		<div class="text-2xl font-bold">{headerData.site_title}</div>
	{/if}
	{#if headerData?.nav_json?.length > 0}
		<nav class="nav">
			<ul class="flex items-center gap-3">
				{#each headerData.nav_json as item}
					<li>
						<a href={item.href}>{item.title}</a>
					</li>
				{/each}
			</ul>
		</nav>
	{/if}
</header>
