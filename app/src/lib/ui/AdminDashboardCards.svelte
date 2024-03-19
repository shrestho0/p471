<script lang="ts">
	import { Hash, ListStartIcon, LucideAlarmSmoke } from 'lucide-svelte';
	import SingleCardElement from './SingleCardElement.svelte';
	import type { AdminDashboardAggData } from '@/types/load-data';
	export let statData: AdminDashboardAggData;
</script>

<div class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
	<SingleCardElement
		title="Todays New Page"
		value={statData?.todaysPages}
		lucideIcon={Hash}
		growth={'Total pages:' + statData?.totalPages}
	/>
	<SingleCardElement
		title="Todays New Users"
		value={statData?.todaysUsers}
		lucideIcon={Hash}
		growth={'Total Users:' + statData?.totalUsers}
	/>
	<SingleCardElement title="Total Banned Pages" value={statData?.bannedPages} lucideIcon={Hash} />
</div>
