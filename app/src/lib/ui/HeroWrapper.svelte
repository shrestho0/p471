<script>
	import Link from './Link.svelte';
</script>

<div class="relative isolate dark:bg-stone-950">
	<div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
		<svg
			class="animate-slide relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
			viewBox="0 0 1155 678"
		>
			<path
				fill="url(#9b2541ea-d39d-499b-bd42-aeea3e93f5ff)"
				fill-opacity=".3"
				d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
			>
			</path>
			<defs>
				<linearGradient
					id="9b2541ea-d39d-499b-bd42-aeea3e93f5ff"
					x1="1155.49"
					x2="-78.208"
					y1=".177"
					y2="474.645"
					gradientUnits="userSpaceOnUse"
				>
					<stop stop-color="#9089FC"></stop>
					<stop offset="1" stop-color="#FFD580"></stop>
				</linearGradient>
			</defs>
		</svg>
	</div>
	<slot />
	<div
		class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
	>
		<svg
			class="animate-slide relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
			viewBox="0 0 1155 678"
		>
			<path
				fill="url(#b9e4a85f-ccd5-4151-8e84-ab55c66e5aa1)"
				fill-opacity=".3"
				d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
			>
			</path>
			<defs>
				<linearGradient
					id="b9e4a85f-ccd5-4151-8e84-ab55c66e5aa1"
					x1="1155.49"
					x2="-78.208"
					y1=".177"
					y2="474.645"
					gradientUnits="userSpaceOnUse"
				>
					<stop stop-color="#9089FC">
						<animate
							attributeName="stop-color"
							values="#9089FC; #FF80B5; #9089FC"
							dur="5s"
							repeatCount="indefinite"
						></animate>
					</stop>
					<stop offset="1" stop-color="#ffb6c1">
						<animate
							attributeName="stop-color"
							values="#ffb6c1; #9089FC; #ffb6c1"
							dur="5s"
							repeatCount="indefinite"
						></animate>
					</stop>
				</linearGradient>
			</defs>
		</svg>
	</div>
</div>

<style>
	@keyframes slide {
		0% {
			left: calc(50% - 70rem);
			transform: rotate(0deg);
		}
		50% {
			left: calc(50% - 30rem);
			transform: rotate(-180deg);
		}
		100% {
			left: calc(50% - 70rem);
			transform: rotate(0deg);
		}
	}

	.animate-slide {
		animation: slide 25s infinite;
	}
</style>
