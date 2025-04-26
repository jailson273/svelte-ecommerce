<script lang="ts">
	const {
		type = 'radio',
		checked,
		name,
		group = 'sizes',
		onchange
	}: {
		type?: 'radio' | 'checkbox';
		checked: boolean;
		name: string;
		group: string;
		onchange: (target: { value: string; isChecked: boolean }) => void;
	} = $props();
</script>

<label class="cursor-pointer  border border-neutral-200" title={name}>
	<input
		{checked}
		{type}
		name={group}
		value={name}
		class="peer sr-only"
		onchange={(e) => {
			onchange({ value: name, isChecked: e.currentTarget.checked });
		}}
	/>
	<div
		class="h-10 w-10  p-1 peer-checked:ring-2 peer-checked:ring-black"
	>
		<div
			class="neutral-900 flex h-full w-full items-center justify-center  text-xs font-medium"
		>
			{name}
		</div>
	</div>
</label>
