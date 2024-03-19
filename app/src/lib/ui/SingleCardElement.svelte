<script lang="ts">
	import { ListStartIcon } from 'lucide-svelte';
	import type { SvelteComponent } from 'svelte';
	export let title: string;
	export let value: number;
	export let growth: string | undefined = undefined;
	export let bg_red: boolean = false;
	export let lucideIcon: ConstructorOfATypedSvelteComponent;
</script>

<div
	class="rounded-lg border {bg_red ? 'bg-red-200' : 'bg-card text-card-foreground'} shadow-sm"
	data-v0-t="card"
>
	<div class="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
		<h3 class="whitespace-nowrap text-sm font-medium tracking-tight">
			{title}
		</h3>
		{#if lucideIcon != undefined}
			<svelte:component this={lucideIcon} class="h-4 w-4 text-gray-500 dark:text-gray-400" />
		{/if}
	</div>
	<div class="p-6 pt-3">
		<div class="text-2xl font-bold">{value}</div>
		{#if growth != undefined}
			<p class="text-xs text-gray-500 dark:text-gray-400">{growth}</p>
		{/if}
	</div>
</div>
