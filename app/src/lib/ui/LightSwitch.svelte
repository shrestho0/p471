<script lang="ts">
	import { Button } from '@/components/ui/button';

	import { Moon, Sun } from 'lucide-svelte';
	// import { Sun, Moon } from "radix-icons-svelte";

	import { toggleMode } from 'mode-watcher';
	import { fly } from 'svelte/transition';
	export let className = '';
</script>

<Button on:click={toggleMode} variant="outline" size="icon" class={className}  >
	<Sun 
		class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 "
	/>
	<Moon
		class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
	/>
	<span class="sr-only">Toggle theme</span>
</Button>
