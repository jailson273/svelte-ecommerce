<script lang="ts">
	interface Props {
		type?: 'checkbox' | 'radio';
		group?: string;
		label: string;
		value: string;
		checked?: boolean;
		onchange: (target: { value: string; isChecked: boolean }) => void;
	}
	const {
		type = 'checkbox',
		group = 'checkbox',
		label,
		checked,
		value,
		onchange
	}: Props = $props();
</script>

<label class="flex cursor-pointer items-center gap-2.5">
	<input
		{type}
		name={group}
		class="peer hidden"
		id={value}
		{value}
		{checked}
		onchange={(e) => {
			onchange({ value, isChecked: e.currentTarget.checked });
		}}
	/>
	<span
		class="flex h-4.5 w-4.5 cursor-pointer items-center justify-center rounded-sm border-2 border-neutral-100 peer-checked:border-neutral-900 peer-checked:bg-neutral-900"
	>
		{#if checked}
			<svg class="text-white" viewBox="0 0 24 24" fill="none">
				<path
					d="M5 13L9 17L19 7"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		{/if}
	</span>
	<span class="cursor-pointer text-sm text-neutral-600">{label}</span>
</label>
