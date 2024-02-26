<script lang="ts">
	import LightSwitch from '@/ui/LightSwitch.svelte';
	import Logo from '@/ui/Logo.svelte';
	import { Input } from '@/components/ui/input';
	import { Textarea } from '@/components/ui/textarea';
	import { ModeWatcher } from 'mode-watcher';
	import PageHeaderBlock from '@/ui/PageHeaderBlock.svelte';
	import PageContentBlock from '@/ui/PageContentBlock.svelte';
	import { page } from '$app/stores';
	import Separator from '@/components/ui/separator/separator.svelte';
	import SidePanel from '@/ui/SidePanel.svelte';
	import { customizationPages, userPanelPages } from '@/utils/authenticated-links';
	import UserPanelItemWrapper from '@/ui/UserPanelItemWrapper.svelte';
	export let data: {
		user: {
			name: string;
			email: string;
			username: string;
		};
	} & EditPageLoadData;
	import { Button } from '@/components/ui/button';
	import Alert from '@/components/ui/alert/alert.svelte';
	import { slide } from 'svelte/transition';
	import { AlertTriangle, CircleDashed, ExternalLink, Minus } from 'lucide-svelte';
	import { copyToClipboard, toTitleCase } from '@/utils/common';
	import { applyAction } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import type { EditPageLoadData, NewOrEditPageData } from '@/types/load-data';
	import { Description } from '@/components/ui/alert';
	import { InternalApiEndpoints } from '@/utils/app-links';

	let pageData: NewOrEditPageData = {
		pageId: '',
		status: 'draft',

		title: {
			value: '',
			error: ''
		},
		slug: {
			value: '',
			error: ''
		},
		content: {
			value: '',
			error: ''
		}
	};

	// $: {
	// 	// Check for errors and set the error message

	// }

	let availableMacros = [
		{ name: 'Name', value: data?.user?.name, macro: '{{name}}' },
		{ name: 'Username', value: data?.user?.username, macro: '{{username}}' },
		{ name: 'Email', value: data?.user?.email, macro: '{{email}}' }
	];

	$: buttonsDisabled = !pageData.title.value || !pageData.slug.value || !pageData.content.value;

	let loadingButtonType: 'draft' | 'published' | '' = '';

	/**
	 * On save to draft or publish, validate till complete and edit/pageId on success
	 */

	function getSanitizeData() {
		return {
			id: pageData.pageId,
			title: pageData.title.value,
			slug: pageData.slug.value,
			content: pageData.content.value
		};
	}

	async function handleSubmissionClick(status: 'draft' | 'published') {
		const data = getSanitizeData();
		const res = await fetch(InternalApiEndpoints.EDIT_PAGE + `?pageId=${pageData.pageId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				...data,
				status
			})
		});
		const resJson: {
			success: boolean;
			redirect_to: string;
			message: string;
			errors?: {
				title: string;
				slug: string;
				content: string;
			};
		} = await res.json();

		if (resJson?.success) {
			toast.success(resJson?.message, {
				position: 'top-center',
				class: 'my-16'
			});
			// Redirect to the page
			window.location.href = resJson?.redirect_to;
		} else {
			// Show the error
			toast.error(resJson?.message, {
				position: 'top-center',
				class: 'mt-8'
			});
			pageData.title.error = resJson?.errors?.title as string;
			pageData.slug.error = resJson?.errors?.slug as string;
			pageData.content.error = resJson?.errors?.content as string;
		}
	}

	onMount(() => {
		if (data?.pageExists && data?.page) {
			pageData.pageId = data.page.id;
			pageData.title.value = data.page.title;
			pageData.slug.value = data.page.slug;
			pageData.content.value = data.page.content;
			pageData.status = data.page.status;
		}
	});
</script>

<svelte:head>
	<title>{data?.page?.id ? `Edit: #${data?.page?.id}` : 'Invalid Page'} | mCMS</title>
</svelte:head>
<div class="h-screen w-full">
	<div class="flex h-screen w-full overflow-y-hidden">
		<aside class="hidden h-full w-[30%] max-w-[300px] border-r border-gray-200 bg-white md:block">
			<div class="flex h-16 items-center justify-center gap-3 border-b border-gray-200">
				<Logo className="text-black" />
			</div>

			<SidePanel pages={userPanelPages} {customizationPages} />
		</aside>
		<aside class="  w-full bg-gray-50">
			<PageHeaderBlock
				user={data?.user}
				title={data?.page?.id ? `Status: <strong>${toTitleCase(data?.page?.status)}</strong>` : ''}
				pageStatus={data?.page?.status}
				pages={userPanelPages}
				{customizationPages}
			>
				<div class="flex w-auto flex-1 justify-end gap-2">
					{#if pageData.status == 'banned'}
						<!-- Simply No Actions -->
					{:else}
						<Button variant="ghost" href={'/' + data?.user?.username + '/' + data?.page?.slug}>
							<ExternalLink />
						</Button>

						<Button
							variant="outline"
							on:click={async () => await handleSubmissionClick('draft')}
							disabled={buttonsDisabled}
						>
							{#if loadingButtonType == 'draft'}
								<CircleDashed class="mx-2 h-5 w-5 animate-spin" />
							{/if}
							{data?.page?.status == 'draft' ? 'Update Draft' : 'Draft'}</Button
						>
						<Button
							disabled={buttonsDisabled}
							on:click={async () => await handleSubmissionClick('published')}
						>
							{#if loadingButtonType == 'published'}
								<CircleDashed class="mx-2 h-5 w-5 animate-spin" />
							{/if}

							{data?.page?.status == 'published' ? 'Update' : 'Publish'}</Button
						>
					{/if}
				</div>
			</PageHeaderBlock>

			<!-- <UserPanelItemWrapper> -->
			<!-- Page Title Input-->
			<PageContentBlock>
				{#if data.pageExists}
					<div class=" m-2 rounded-lg bg-white px-8 py-4 shadow-md md:m-4">
						<form method="post" on:submit|preventDefault class="mt-3">
							<label for="title" class="text-md block font-normal text-gray-700"> Title </label>
							<div class="mt-1">
								<Input
									type="text"
									bind:value={pageData.title.value}
									name="title"
									id="title"
									required={true}
									disabled={Boolean(pageData.title.error) || pageData.status === 'banned'}
									placeholder="Enter the title of the page"
								/>

								{#if pageData.title.error}
									<div transition:slide class="error p-2 text-sm text-red-500/90">
										{pageData.title.error}
									</div>
								{/if}
							</div>
						</form>
						<!-- Page Slug Input-->
						<div class="mt-4">
							<label for="slug" class="text-md block font-normal text-gray-700"> Slug </label>
							<div class="mt-1">
								<Input
									required={true}
									type="text"
									name="slug"
									id="slug"
									disabled={Boolean(pageData.slug.error) || pageData.status === 'banned'}
									bind:value={pageData.slug.value}
									placeholder="Enter the slug of the page"
								/>
								{#if pageData.slug.error}
									<div transition:slide class="error p-2 text-sm text-red-500/90">
										{pageData.slug.error}
									</div>
								{/if}
							</div>
						</div>
						<!-- Page Content Input-->
						<div class="mt-4">
							<label for="content" class="text-md block font-normal text-gray-700"> Content </label>
							<div class="mt-1">
								<Textarea
									name="content"
									id="content"
									rows={15}
									required={true}
									disabled={Boolean(pageData.content.error) || pageData.status === 'banned'}
									bind:value={pageData.content.value}
									placeholder="Enter the content of the page"
								></Textarea>
								{#if pageData.content.error}
									<div transition:slide class="error p-2 text-sm text-red-500/90">
										{pageData.content.error}
									</div>
								{/if}
							</div>
						</div>
						<!-- Available macros -->
						<div class="mt-4">
							<label for="macros" class="text-md block font-normal text-gray-700">
								Available Macros:
							</label>
							<div class="mt-1 text-sm text-gray-700">
								<div class="">
									{#each availableMacros as macroObj}
										<div class="m-1 flex gap-2">
											<Button
												title="Copy to clipboard"
												on:click={() => {
													copyToClipboard(macroObj.macro);
												}}
												variant="outline"
												size="sm"
											>
												{macroObj.macro}
												<Minus />
												{macroObj.name} ({macroObj.value})
											</Button>
										</div>
									{/each}
								</div>
							</div>
						</div>
						<!-- </UserPanelItemWrapper> -->
					</div>
				{:else}
					<Alert>
						<p>Page not found</p>
					</Alert>
				{/if}
			</PageContentBlock>
		</aside>
	</div>
</div>
