<script lang="ts">
	import { Button } from '@/components/ui/button';
	import LightSwitch from '@/ui/LightSwitch.svelte';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import Separator from '@/components/ui/separator/separator.svelte';
	import { onMount } from 'svelte';
	import * as Avatar from '@/components/ui/avatar';
	import { md5 } from '@/utils/common';

	import { page } from '$app/stores';

	export let user: {
		email: string;
		name?: string;
		collectionName?: string;
		username?: string;
	};
	export let title = '';

	let regularUser = false;

	onMount(() => {
		if (user?.name || user?.collectionName) {
			regularUser = true;
		}
		console.log(user);
	});
</script>

<div class="header h-16 border-b border-gray-200 bg-white">
	<div class="flex h-full items-center justify-between px-8">
		<h1 class="dark: text-2xl font-semibold text-black">{title}</h1>
		<slot />
		<div class="flex h-full items-center justify-between gap-3 px-8">
			<LightSwitch />
			<Separator class="mx-1 hidden h-6 md:block" orientation="vertical" />
			<div
				class="greet flex flex-col items-center justify-center
			 p-1 text-sm text-black"
			>
				<div class="">
					{regularUser ? 'Welcome, ' + user?.name : 'Welcome, admin'}!
				</div>
			</div>
			<div class="items center flex space-x-4">
				<!-- Welcome, {data?.admin?.name}! -->
				<!-- <DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button
							builders={[builder]}
							variant="outline"
							class="hover: border-none   bg-transparent px-0 text-base hover:bg-transparent md:mr-2"
						>
							<Avatar.Root>
 								<Avatar.Image src={'https://gravatar.com/avatar/' + md5(user?.email)} alt="@" />
								<Avatar.Fallback
									>{$page.data?.user_username?.slice(0, 2)?.toUpperCase()}</Avatar.Fallback
								>
							</Avatar.Root>
						</Button>
					</DropdownMenu.Trigger>

					<DropdownMenu.Content class=" w-56  border-none bg-white shadow hover:bg-white">
						<DropdownMenu.Label class="text-black">Welcome {user?.name}</DropdownMenu.Label> 
						<DropdownMenu.Item class="m-0 bg-white p-0">
							<a href="/_/change-password" class="p-3 text-black">Change Password</a>
						</DropdownMenu.Item>
						<DropdownMenu.Item class="m-0 bg-white p-0">
							<Logout formClasses="w-full" btnClasses="w-full" />
						</DropdownMenu.Item> 
					</DropdownMenu.Content>
				</DropdownMenu.Root> -->

				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button
							builders={[builder]}
							variant="outline"
							class="hover: border-none   bg-transparent px-0 text-base hover:bg-transparent md:mr-2"
						>
							<Avatar.Root>
								<Avatar.Image src={'https://gravatar.com/avatar/' + md5(user?.email)} alt="@" />
								<Avatar.Fallback>{user?.email?.slice(0, 2)}</Avatar.Fallback>
							</Avatar.Root>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-56">
						<DropdownMenu.Label>{user?.email}</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							{#if regularUser}
								<DropdownMenu.Item>
									<a href={'/' + user.username}> Profile Page </a>
								</DropdownMenu.Item>
							{/if}

							<DropdownMenu.Item
								class={$page.url.pathname?.includes('dashboard')
									? 'bg-blue-600 hover:bg-blue-600 focus:bg-blue-600 '
									: ''}
							>
								<a href="/{regularUser ? '' : '_/'}dashboard"> Dashboard</a>
							</DropdownMenu.Item>
							<DropdownMenu.Item
								class={$page.url.pathname?.includes('change-password') ? 'bg-blue-600' : ''}
							>
								<a href="/{regularUser ? '' : '_/'}change-password"> Change Password </a>
							</DropdownMenu.Item>
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>
							<form action="/logout" method="post">
								<button class="w-full p-2" type="submit">Logout</button>
							</form>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	</div>
</div>
