<script lang="ts">
	import { Hash, ListStartIcon, LucideAlarmSmoke } from 'lucide-svelte';
	import SingleCardElement from './SingleCardElement.svelte';
	export let statData: {
		totalPages: number;
		todaysPages: number;
		bannedPages: number;
	};
</script>

<div class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
	<SingleCardElement title="Total Pages" value={statData?.totalPages} lucideIcon={Hash} />
	<SingleCardElement title="Todays Pages" value={statData?.todaysPages} lucideIcon={Hash} />
	<SingleCardElement
		title="Banned Pages"
		value={statData?.bannedPages}
		lucideIcon={Hash}
		bg_red={statData?.bannedPages > 0}
	/>
</div>
