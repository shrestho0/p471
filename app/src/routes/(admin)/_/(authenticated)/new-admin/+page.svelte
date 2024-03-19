<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import Alert from '@/components/ui/alert/alert.svelte';
	import { applyAction, enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	const fields = [
		{ name: 'email', type: 'email', placeholder: 'Email', label: 'Email', value: '', error: '' },
		{
			name: 'password',
			type: 'password',
			placeholder: 'Password',
			label: 'Password',
			value: '',
			error: ''
		},
		{
			name: 'passwordConfirm',
			type: 'password',
			placeholder: 'Confirm Password',
			label: 'Confirm Password',
			value: '',
			error: ''
		}
	];

	let errorMsg = '';

	function enhancedFormSubmission() {
		return async ({ result }: { result: ActionResult }) => {
			switch (result.type) {
				case 'success':
					// show user data on right\
					toast.success(result?.data?.message, {
						position: 'top-center'
					});
					setTimeout(() => {
						window.history.back();
					}, 1000);
					break;
				case 'failure':
					errorMsg = result?.data?.message;
					break;
			}

			applyAction(result);
			invalidateAll();

			formLoading = false;
		};
	}

	let formLoading = false;
</script>

<Card.Root class="w-full lg:w-[50%]">
	<form
		method="post"
		action=""
		use:enhance={enhancedFormSubmission}
		on:submit={() => {
			formLoading = true;
			errorMsg = '';
		}}
		on:reset={() => {
			errorMsg = '';
		}}
	>
		<Card.Header>
			<Card.Title>Create new admin</Card.Title>
			<Card.Description>Note that, admins can manage other admins</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid w-full items-center gap-4 py-3">
				{#each fields as field}
					<div class="flex flex-col space-y-1.5">
						<Label for={field.name}>{field.label}</Label>
						<Input
							type={field.type}
							name={field.name}
							bind:value={field.value}
							placeholder={field.placeholder}
							disabled={formLoading}
						/>
					</div>
				{/each}
			</div>
			{#if errorMsg}
				<Alert variant="destructive">{errorMsg}</Alert>
			{/if}
		</Card.Content>
		<Card.Footer class="flex justify-between">
			{#if formLoading}
				<Button variant="outline" type="button" disabled>Reset</Button>
				<Button type="button" disabled>Create new admin</Button>
			{:else}
				<Button variant="outline" type="reset">Reset</Button>
				<Button type="submit">Create new admin</Button>
			{/if}
		</Card.Footer>
	</form>
</Card.Root>
