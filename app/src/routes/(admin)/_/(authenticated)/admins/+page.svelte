<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import Input from '@/components/ui/input/input.svelte';
	import Label from '@/components/ui/label/label.svelte';
	import PreDebug from '@/dev/PreDebug.svelte';
	import { page } from '$app/stores';
	import UserPanelItemWrapper from '@/ui/UserPanelItemWrapper.svelte';
	import * as Table from '$lib/components/ui/table';
	import {
		ChevronLeft,
		ChevronRight,
		ExternalLink,
		CircleDotDashed,
		PlusSquare
	} from 'lucide-svelte';
	import type { Admin, User } from '@/types/users';
	import { beautiulDateTime } from '@/utils/common';

	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { applyAction, enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { ErrorMessages } from '@/utils/messages';

	export let data: {
		totalItems: number;
		items: User[];
		admin: Admin;
	};

	// selected user
	let selectedUser: User;
	let viewModalOpen = false;
	let deleteModalOpen = false;
	let deletingUser = false;
	let updatingUser = false;
	let updateModalOpen = false;
	let updatedMessage = '';
	let showChangePasswordField = false;

	const userUpdateErrors = {
		username: '',
		email: '',
		name: '',
		password: ''
	};

	function enhancedUserDelete() {
		return async ({ result }: { result: ActionResult }) => {
			// Do SOmething

			switch (result.type) {
				case 'success':
					toast.success(result?.data?.message, {
						duration: 3000,
						position: 'top-right',
						class: 'mt-4'
					});

					await applyAction(result);
					invalidateAll();
					break;
				case 'failure':
					toast.error(result?.data?.message || ErrorMessages.DEFAULT_ERROR, {
						duration: 3000,
						position: 'top-right',
						class: 'mt-4'
					});
					break;
				default:
					break;
			}

			deletingUser = false;
			deleteModalOpen = false;

			//@ts-ignore
			selectedUser = null;
		};
	}
	function enhancedUserUpdate() {
		return async ({ result }: { result: ActionResult }) => {
			// Do SOmething

			switch (result.type) {
				case 'success':
					// toast.success(result?.data?.message, {
					// 	duration: 3000,
					// 	position: 'top-right',
					// 	class: 'mt-4'
					// });
					updatedMessage = result?.data?.message;
					// updateModalOpen = false;

					// selectedUser = result?.data?.updatedUser;

					invalidateAll();
					break;
				case 'failure':
					updatedMessage = result?.data?.message || ErrorMessages.DEFAULT_ERROR;
					// toast.error(result?.data?.message || ErrorMessages.DEFAULT_ERROR, {
					// 	duration: 3000,
					// 	position: 'top-right',
					// 	class: 'mt-4'
					// });
					break;
				default:
					break;
			}
			await applyAction(result);
			updatingUser = false;
		};
	}
</script>

<a
	href="/_/new-admin"
	class="flex w-full items-center gap-3 rounded bg-indigo-500 p-4 text-3xl text-gray-100 hover:bg-cyan-400"
>
	Create new admin
	<PlusSquare />
</a>

<UserPanelItemWrapper>
	<!-- Data Table -->

	<Table.Root>
		<!-- <Table.Caption>A list of your recent invoices.</Table.Caption> -->
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[200px]">ID</Table.Head>
				<Table.Head class="">Email</Table.Head>
				<Table.Head class="w-[100px]">Created</Table.Head>
				<Table.Head class="w-[100px]">Updated</Table.Head>
				<Table.Head class="text-right">Actions</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#if data?.items?.length > 0}
				{#each data?.items as item}
					{#if item.id != data?.admin?.id}
						<Table.Row>
							<Table.Cell class="font-medium">{item.id}</Table.Cell>
							<Table.Cell>{item.email}</Table.Cell>
							<Table.Cell>{beautiulDateTime(item.created)}</Table.Cell>
							<Table.Cell>{beautiulDateTime(item.updated)}</Table.Cell>
							<Table.Cell class="flex justify-end gap-2 ">
								<Button
									variant="outline"
									size="sm"
									on:click={() => {
										selectedUser = item;
										viewModalOpen = true;
									}}>Show Details</Button
								>
								<Button
									variant="default"
									on:click={() => {
										selectedUser = item;
										updateModalOpen = true;
									}}
									size="sm">Modify</Button
								>
								<Button
									variant="outline"
									class=" bg-indigo-400 text-white "
									size="sm"
									on:click={() => {
										selectedUser = item;
										deleteModalOpen = true;
									}}>Delete</Button
								>
								<Button
									class="flex items-center justify-center gap-1"
									variant="outline"
									size="sm"
									href={'/_/pages/?qu=' + item.id}
									>Pages
									<ExternalLink class="h-4 w-4 " />
								</Button>
							</Table.Cell>
						</Table.Row>
					{/if}
				{/each}
			{:else}
				<td colspan="4" class="w-full py-4 text-center">
					<p>No Data Found!</p>
				</td>
			{/if}
		</Table.Body>
	</Table.Root>
</UserPanelItemWrapper>

<AlertDialog.Root bind:open={viewModalOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Details of {selectedUser.id}</AlertDialog.Title>
			<AlertDialog.Description class="font-md">
				<table class="w-full text-black">
					<tr>
						<td class="w-1/4">ID</td>
						<td>{selectedUser.id}</td>
					</tr>

					<tr>
						<td class="w-1/4">Email</td>
						<td>{selectedUser.email}</td>
					</tr>

					<tr>
						<td class="w-1/4">Created</td>
						<td>{beautiulDateTime(selectedUser.created)}</td>
					</tr>
					<tr>
						<td class="w-1/4">Updated</td>
						<td>{beautiulDateTime(selectedUser.updated)}</td>
					</tr>
				</table>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Close</AlertDialog.Cancel>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={deleteModalOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure to delete user #{selectedUser.id}</AlertDialog.Title>
			<AlertDialog.Description class="font-md">
				<table class="w-full text-black">
					<tr>
						<td class="w-1/4">ID</td>
						<td>{selectedUser.id}</td>
					</tr>

					<tr>
						<td class="w-1/4">Email</td>
						<td>{selectedUser.email}</td>
					</tr>

					<tr>
						<td class="w-1/4">Created</td>
						<td>{beautiulDateTime(selectedUser.created)}</td>
					</tr>
					<tr>
						<td class="w-1/4">Updated</td>
						<td>{beautiulDateTime(selectedUser.updated)}</td>
					</tr>
				</table>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Close</AlertDialog.Cancel>
			<!-- <AlertDialog.Action> -->
			<form action="?/deleteUser" method="post" use:enhance={enhancedUserDelete}>
				<input type="hidden" name="adminId" value={selectedUser.id} />
				<Button
					type="submit"
					on:click={() => {
						deletingUser = true;
					}}
				>
					{#if deletingUser}
						<CircleDotDashed class="mr-2 h-4 w-4 animate-spin stroke-white dark:stroke-stone-950" />
						<span>Deleting...</span>
					{:else}
						Delete
					{/if}
				</Button>
			</form>
			<!-- </AlertDialog.Action> -->
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={updateModalOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Modify user #{selectedUser.id}</AlertDialog.Title>
			<AlertDialog.Description class="font-md">
				<!-- user data form -->
				<form
					action="?/updateUser"
					class="flex flex-col gap-3 text-black"
					method="post"
					use:enhance={enhancedUserUpdate}
				>
					<input type="hidden" name="adminId" value={selectedUser.id} />
					<input type="hidden" name="oldEmail" value={selectedUser.email} />

					<div class="flex flex-col gap-2">
						<Label for="emailX">Email</Label>
						<Input type="email" name="emailX" placeholder={selectedUser.email} />
					</div>

					{#if showChangePasswordField}
						<div class="flex flex-col gap-2">
							<Label for="passwordX">New Password</Label>
							<Input
								disabled={!showChangePasswordField}
								type="password"
								name="passwordX"
								minlength={8}
								placeholder="**********"
							/>
						</div>
					{/if}
					<Button
						type="button"
						on:click={() => {
							showChangePasswordField = !showChangePasswordField;
						}}>{showChangePasswordField ? 'Close Password Field' : 'Change Password'}</Button
					>

					{#if updatedMessage}
						<p class="text-md rounded-lg border border-black p-2 text-black">{updatedMessage}</p>
					{/if}

					<Button
						type="submit"
						on:click={() => {
							updatedMessage = '';
							updatingUser = true;
						}}
					>
						{#if updatingUser}
							<CircleDotDashed
								class="mr-2 h-4 w-4 animate-spin stroke-white dark:stroke-stone-950"
							/>
							<span>Updating...</span>
						{:else}
							Update
						{/if}
					</Button>
				</form>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Close</AlertDialog.Cancel>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
