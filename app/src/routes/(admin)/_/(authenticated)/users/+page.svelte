<script lang="ts">
	import { Alert } from '@/components/ui/alert';
	import Button from '@/components/ui/button/button.svelte';
	import Input from '@/components/ui/input/input.svelte';
	import Label from '@/components/ui/label/label.svelte';
	import PreDebug from '@/dev/PreDebug.svelte';
	import UserPanelItemWrapper from '@/ui/UserPanelItemWrapper.svelte';
	import * as Table from '$lib/components/ui/table';
	import type { SinglePage } from '@/types/pages-and-stuff';
	import { ArrowRight } from 'lucide-svelte';

	export let data: {
		now: Date;
		total: number;
		totalPages: number;
		page: number;
		items: SinglePage[];
	};
</script>

<UserPanelItemWrapper>
	<div>
		<h1>Filter & Search</h1>
		<form class="mt-3 flex w-full flex-col justify-center gap-3">
			<div class="grid w-full grid-cols-3 gap-3">
				<div class="grid w-full max-w-sm items-center gap-1.5">
					<Label for="status">Status</Label>
					<select
						class="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
						name="status"
					>
						<option value="">All</option>
						<option value="published">Published</option>
						<option value="banned">Banned</option>
						<option value="draft">Draft</option>
					</select>
				</div>
				<!-- order by -->
				<div class="grid w-full max-w-sm items-center gap-1.5">
					<Label for="sort">Sort By</Label>
					<select
						class="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
						name="sort"
					>
						<option value="-created">Created (DESC)</option>
						<option value="created">Created (ASC)</option>
						<option value="-updated">Updated (DESC)</option>
						<option value="updated">Updated (ASC)</option>
					</select>
				</div>
				<div class="grid w-full max-w-sm items-center gap-1.5">
					<Label for="limit">Limit</Label>
					<select
						class="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
						name="limit"
					>
						<option value={5}>5</option>
						<option value={10}>10</option>
						<option value={25}>25</option>
						<option value={50}>50</option>
					</select>
				</div>
			</div>
			<Input name="q" type="text" placeholder="Search for page, with titles or slugs or contents" />
			<Input
				name="qu"
				type="text"
				placeholder="Search for page, with user's name or email or username"
			/>
			<div class="grid grid-cols-4 gap-3">
				<Button
					variant="outline"
					class="w-full"
					type="reset"
					on:click={() => {
						// remove all query params from url
					}}>Reset</Button
				>
				<Button class="col-span-3 w-full" type="submit">Filter Pages</Button>
			</div>
		</form>
	</div>
</UserPanelItemWrapper>

<UserPanelItemWrapper>
	<!-- Data Table -->

	<Table.Root>
		<!-- <Table.Caption>A list of your recent invoices.</Table.Caption> -->
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[200px]">Name</Table.Head>
				<Table.Head class="w-[100px]">Username</Table.Head>
				<Table.Head>Total Pages</Table.Head>
				<Table.Head>Created At</Table.Head>
				<Table.Head class="text-right">Actions</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#if data?.items?.length > 0}
				{#each data?.items as item}
					<Table.Row>
						<Table.Cell class="font-medium">{item.title}</Table.Cell>
						<Table.Cell>{item.slug}</Table.Cell>
						<Table.Cell>{item.status}</Table.Cell>
						<Table.Cell>{item?.updated} [DATE]</Table.Cell>
						<Table.Cell class="flex justify-end gap-2 ">
							<Button variant="outline" size="sm">View Pages</Button>
							<Button variant="default" size="sm">Update</Button>
							<Button variant="outline" class=" bg-indigo-400 text-white " size="sm">Delete</Button>
						</Table.Cell>
					</Table.Row>
				{/each}
			{:else}
				<td colspan="4" class="w-full py-4 text-center">
					<p>No Data Found!</p>
				</td>
			{/if}
		</Table.Body>
	</Table.Root>
</UserPanelItemWrapper>

<PreDebug {data} />
<div>
	Dev
	<li><a href="/pages/published-page">Published Page</a></li>
	<li><a href="/pages/banned-page">Banned Page</a></li>
	<li><a href="/pages/draft-page">Saved as Draft Page</a></li>
</div>
