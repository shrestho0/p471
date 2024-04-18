<script>
	import Hero from '@/ui/Hero.svelte';
	import Faqs from './Faqs.svelte';
	import NavbarHomePage from '@/ui/NavbarHomePage.svelte';
	import Features from './Features.svelte';
	import Contribute from './Contribute.svelte';
</script>

<svelte:head>
	<title>mCMS</title>
</svelte:head>

<NavbarHomePage />
<Hero />
<Features />
<Faqs />
<Contribute />

<div class="mb-8 px-4 text-center">
	&copy; Copyright {new Date().getFullYear()}. All Rights Reserved. Developed by Group 1 for CSE471
	Lab Project
</div>
<!-- 
<div id="debug" class="mb-32">
	<div>Temp site urls for testing</div>
	<ul>
		Links:
		<li>
			- <a href="/login">User Login</a>
		</li>
		<li>
			- <a href="/register">User Register</a>
		</li>
		<li>
			- <a href="/_/login">Admin Login</a>
		</li>
		<li>
			- <a href="/a/b">Concept: User's page</a>
		</li>
	</ul>
</div> -->
