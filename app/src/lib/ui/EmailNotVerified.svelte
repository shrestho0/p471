<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '@/components/ui/button';
	import type { ActionResult } from '@sveltejs/kit';

	import { AlertTriangle, CircleDashed } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	let btnLoading = false;
	function enhancedResendVerification() {
		return async ({ result }: { result: ActionResult }) => {
			switch (result.type) {
				case 'failure':
					toast.error(result?.data?.message, {
						position: 'top-center'
					});
					break;
				case 'success':
					toast.success(result?.data?.message, {
						position: 'top-center'
					});
					break;
			}

			btnLoading = false;
		};
	}
</script>

<div class="card m-4 flex items-center justify-center gap-4 rounded border-2 border-black p-3">
	<AlertTriangle />
	Email Not Verified.
	<form
		method="post"
		action="/update-info/?/verifyEmail"
		use:enhance={enhancedResendVerification}
		on:submit={() => {
			btnLoading = true;
		}}
	>
		{#if btnLoading}
			<Button type="button" disabled class="">
				<CircleDashed class=" mr-2 h-4 w-4 animate-spin" />
				Resending verification...</Button
			>
		{:else}
			<Button type="submit">Resend verification</Button>
		{/if}
	</form>
</div>
