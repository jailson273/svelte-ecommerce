<script lang="ts">
	interface Props {
		children: any;
		onclose: () => void;
	}
	const { children, onclose }: Props = $props();
</script>

<span
	class="flex h-8 w-fit items-center justify-center gap-2 border border-neutral-100 px-2 text-[10px] font-medium text-neutral-900"
>
	<div class="flex items-center gap-2">
		{@render children()}
	</div>

	<button class="cursor-pointer" onclick={onclose}>
		<img src="/icons/close.svg" width="16px" height="16px" alt="Close" />
	</button>
</span>
