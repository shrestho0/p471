<script lang="ts">
	export let title: string = '';
</script>

<div class=" my-3 rounded-lg bg-white px-8 py-4 shadow-md">
	<h2 class=" font-semibold">{title}</h2>
	<slot />
</div>
