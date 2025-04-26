<script lang="ts">
	const {
		type = 'radio',
		checked,
		name,
		hex,
		group = 'colors',
		onchange
	}: {
		type?: 'checkbox' | 'radio';
		checked: boolean;
		name: string;
		hex: string;
		group: string;
		onchange: (target: {
			value: string;
			isChecked: boolean;
			hex: string;
		}) => void;
	} = $props();
</script>

<label class="cursor-pointer" title={name}>
	<input
		{checked}
		{type}
		name={group}
		value={name}
		class="peer sr-only"
		onchange={(e) => {
			onchange({ value: name, isChecked: e.currentTarget.checked, hex });
		}}
	/>
	<div
		class="size-7 rounded-full border border-neutral-300 p-0.5 peer-checked:ring-2 peer-checked:ring-black"
	>
		<div
			class="h-full w-full rounded-full border border-neutral-200"
			style="background-color: {hex}"
		></div>
	</div>
</label>
