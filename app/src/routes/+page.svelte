<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';

	function toastAction() {
		toast.dismiss();
		console.log('Toast action clicked');
	}

	function handleSomeClick() {
		// Dismiss all previous toasts
		// toast.dismiss();

		// Showing some toast
		toast('Button clicked :3 :3', {
			position: 'top-right',
			dismissable: true,
			duration: 5000,

			action: {
				label: 'Do Something',
				onClick: toastAction
			}
		});
	}
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<Button on:click={handleSomeClick}>Click me</Button>
