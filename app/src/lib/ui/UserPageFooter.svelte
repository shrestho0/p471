<script lang="ts">
	import type { SiteFooterType } from '@/types/customizations';
	import Logo from './Logo.svelte';
	import Separator from '@/components/ui/separator/separator.svelte';

	export let footerData: SiteFooterType = {
		text: '(c) 2024 User Page Footer',
		social_json: [
			{ title: 'Facebook', href: '#', fa_icon: 'facebook' },
			{ title: 'Twitter', href: '#', fa_icon: 'twitter' }
		],
		id: ''
	};
</script>

<footer class=" text-gray-700">
	<div class=" flex flex-col items-center justify-between border p-3 md:flex-row">
		<div class="left">
			<p class="text-gray-800">{footerData.text}</p>
		</div>
		<nav>
			<ul class="flex items-center justify-center gap-2">
				{#if footerData?.social_json?.length > 0}
					{#each footerData.social_json as item}
						<li>
							<a href={item.href} class="text-gray-700 hover:text-gray-700/70">
								{#if item.fa_icon}
									<i class=" fa-brands fa-{item.fa_icon}"></i>
								{:else}
									<span>{item.title}</span>
								{/if}
							</a>
						</li>
					{/each}
				{/if}
			</ul>
		</nav>
		<div class="w-auto">
			<div class="flex items-center justify-center gap-1.5">
				Powered By <Logo className="text-gray-800" />
			</div>
		</div>
	</div>
</footer>
