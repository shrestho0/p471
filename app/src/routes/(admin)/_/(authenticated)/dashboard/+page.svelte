<script lang="ts">
	import type { AdminDashboardAggData } from '@/types/load-data';
	import type { Admin } from '@/types/users';
	import AdminDashboardCards from '@/ui/AdminDashboardCards.svelte';
	import DashboardHero from '@/ui/DashboardHero.svelte';

	export let data: {
		user: undefined;
		admin: Admin;
	} & AdminDashboardAggData;
</script>

<div class="flex flex-col gap-6">
	<DashboardHero {data} />
	<AdminDashboardCards statData={data} />
</div>
