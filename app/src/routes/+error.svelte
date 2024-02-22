<script lang="ts">
	import { page } from '$app/stores';
	import PreDebug from '@/dev/PreDebug.svelte';
</script>

<div class="bg-gray-50">
	Error Page
	<PreDebug data={$page} />
</div>
