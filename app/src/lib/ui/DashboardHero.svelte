<script lang="ts">
	import type { Admin, User } from '@/types/users';

	export let data: {
		user?: User;
		admin?: Admin;
	};
</script>

<header class="rounded bg-gray-200">
	<div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
		<div class="sm:flex sm:items-center sm:justify-between">
			<div class="text-center sm:text-left">
				<h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">
					Welcome Back, {data?.user?.name ?? data?.admin?.email}!
				</h1>

				{#if data?.user}
					<p class="mt-1.5 text-sm text-gray-500">Let's write to another new page! 🎉</p>
				{:else if data?.admin}
					<p class="mt-1.5 text-sm text-gray-500">Manage users and their pages from here! 🎉</p>
				{/if}
			</div>
			{#if data?.user}
				<div class="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
					<a
						href={'/' + data?.user?.username}
						target="_blank"
						class="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-5 py-3 text-gray-500 transition hover:text-gray-700 focus:outline-none focus:ring"
						type="button"
					>
						<span class="text-sm font-medium"> View Profle Page </span>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
							/>
						</svg>
					</a>

					<a
						href="/new-page"
						class="block rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
						type="button"
					>
						Create Web Page
					</a>
				</div>
			{/if}
		</div>
	</div>
</header>
