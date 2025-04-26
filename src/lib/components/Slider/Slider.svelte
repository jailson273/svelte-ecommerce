<script lang="ts">
	let {
		value,
		min = 0,
		max,
		onchange,
		width = 'inherit'
	}: {
		value: number;
		width?: string;
		min?: number;
		max: number;
		onchange: (value: number) => void;
	} = $props();

	let sliderLength = $state(0);

	function handleSliderChange(event: Event) {
		const input = event.target as HTMLInputElement;
		value = parseInt(input.value);
		onchange(value);
	}
</script>

<div class="w-full">
	<div
		class="relative flex items-center"
		style="width: {width};"
		bind:clientWidth={sliderLength}
	>
		<div
			class="absolute h-2 bg-black"
			style="width: {(value / max) * sliderLength}px;"
		></div>
		<input
			type="range"
			{min}
			{max}
			{value}
			step="1"
			oninput={handleSliderChange}
			class="
            h-2
            w-full
            cursor-pointer
            appearance-none

            bg-gray-200
            [&::-webkit-slider-thumb]:size-5
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-black
            [&::-webkit-slider-thumb]:shadow-lg
            "
		/>
		<div
			id="slider-value"
			style="left: {(value / max) *
				sliderLength}px; transform: translateX(-{40 + (value / max) * 26}%);"
			class="
            [&::before]
            overflow:
            hidden;
            pointer-events-none
            absolute
            top-8
            w-18
            -translate-y-1/2
            transform

            bg-neutral-900
            px-2
            py-1
            text-center
            text-xs font-semibold
            text-white
            "
		>
			$ {value.toFixed(2)}
		</div>
	</div>
</div>

<style>
	#slider-value::before {
		content: '';
		position: absolute;
		width: 14px;
		height: 14px;
		transform: rotate(45deg) translate(-50%);
		top: 2px;
		z-index: -1;
		left: 50%;
		background-color: #171717;
	}
</style>
