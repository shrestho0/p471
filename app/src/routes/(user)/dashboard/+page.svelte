<script lang="ts">
	import PreDebug from '@/dev/PreDebug.svelte';
	import type { User } from '@/types/users';
	import DashboardHero from '@/ui/DashboardHero.svelte';
	import Logout from '@/ui/Logout.svelte';
	import UserDashboardCards from '@/ui/UserDashboardCards.svelte';
	import { ListStartIcon } from 'lucide-svelte';
	export let data: {
		user: User;
		totalPages: number;
		todaysPages: number;
		bannedPages: number;
	};
</script>

<div class="flex flex-col gap-4">
	<DashboardHero user={data?.user} />
	<UserDashboardCards statData={data} />
</div>
<!-- <PreDebug {data} /> -->
