<script lang="ts">
	import { enhance } from '$app/forms';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import type { ActionResult } from '@sveltejs/kit';
	import * as Alert from '@/components/ui/alert';
	import { ErrorMessages, SuccessMessages } from '@/utils/messages';
	import { toast } from 'svelte-sonner';
	import { AlertTriangle, CircleDotDashed } from 'lucide-svelte';
	import { Button } from '@/components/ui/button';
	import UserPanelItemWrapper from '@/ui/UserPanelItemWrapper.svelte';
	import { page } from '$app/stores';
	import { toTitleCase } from '@/utils/common';

	const fields = [
		{
			name: 'username',
			placeholder: $page?.data?.user?.username,
			label: 'Username',
			type: 'username',
			value: '',
			error: ''
		},
		{
			name: 'name',
			placeholder: $page?.data?.user?.name,
			label: 'John Doe',
			type: 'text',
			value: '',
			error: ''
		}
	];

	let errorMessage = '';
	let isLoading = false;
	let isLoadingEmail = false;
	function enhancedSubmission() {
		return async ({ result }: { result: ActionResult }) => {
			switch (result.type) {
				case 'failure': {
					errorMessage = result?.data?.message;
					const fe = result?.data?.fieldErrors;
					if (result?.data?.fieldErrors) {
						if (fe.name) {
							fields[1].error = fe.name;
						}
						if (fe.username) {
							fields[0].error = fe.username;
						}
					}
					break;
				}
				case 'success': {
					errorMessage = '';
					toast.success(result?.data?.message, {
						duration: 3000,
						position: 'top-right'
					});
					document.location.reload();
					break;
				}
			}
			isLoading = false;
			console.log(result);
		};
	}

	function enhancedRequestEmail() {
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

			isLoadingEmail = false;
		};
	}
</script>

<UserPanelItemWrapper>
	<div class="flex max-w-lg flex-col space-y-6 lg:p-8">
		<h2 class="text-xl font-semibold">Update Info</h2>
		<div class="flex flex-col gap-8">
			<div class="">
				<form
					method="post"
					action="?/updateInfo"
					use:enhance={enhancedSubmission}
					on:submit={() => {
						isLoading = true;
					}}
				>
					<div class="grid gap-2">
						{#each fields as field}
							<div class="grid gap-1 py-2">
								<Label class="label py-1 font-normal" for={field.name}
									>{toTitleCase(field.name)}</Label
								>
								<Input
									name={field.name}
									id={field.name}
									bind:value={field.value}
									placeholder={field.placeholder}
									type={field.type}
									disabled={isLoading}
									autocomplete="off"
									autocorrect="off"
									spellcheck="false"
								/>
							</div>
							{#if field.error}
								<p class="py-0.5 pl-2 text-red-500">
									{field.error}
								</p>
							{/if}
						{/each}

						{#if errorMessage}
							<Alert.Root variant="destructive">
								<!-- <Alert.Title>Error</Alert.Title> -->
								<Alert.Description class="flex items-center justify-center gap-4 ">
									<AlertTriangle class="h-4 w-4" />
									{errorMessage}
								</Alert.Description>
							</Alert.Root>
						{/if}
						<Button type="submit">
							{#if isLoading}
								<CircleDotDashed color="white" class="mr-2 h-4 w-4 animate-spin" />
								Requesting update...
							{:else}
								Update Info
							{/if}
						</Button>
					</div>
				</form>
			</div>
		</div>
	</div>
</UserPanelItemWrapper>

<UserPanelItemWrapper>
	<div class="flex max-w-lg flex-col space-y-6 lg:p-8">
		<h2 class="text-xl font-semibold">Request Email Change</h2>
		<p>We will send an email to your new email from where you can change email</p>
		<form
			method="post"
			action="?/changeEmail"
			use:enhance={enhancedRequestEmail}
			on:submit={() => {
				isLoadingEmail = true;
			}}
			class="flex flex-col gap-2"
		>
			<Input
				name="newEmail"
				placeholder={$page?.data?.user?.email}
				type="email"
				disabled={isLoadingEmail}
			/>
			<Button type="submit">
				{#if isLoadingEmail}
					<CircleDotDashed color="white" class="mr-2 h-4 w-4 animate-spin" />
					Sending email...
				{:else}
					Send email change verification
				{/if}
			</Button>
		</form>
	</div>
</UserPanelItemWrapper>
