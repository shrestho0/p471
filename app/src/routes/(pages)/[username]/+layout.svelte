<script lang="ts">
	import PreDebug from '@/dev/PreDebug.svelte';
	export let data;
</script>

<PreDebug {data} />
<slot />
