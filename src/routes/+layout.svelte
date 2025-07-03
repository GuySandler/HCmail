<script lang="ts">
	import '../app.css';
	import { navigating } from '$app/stores';
	import Header from '$lib/components/header.svelte';

	let { children } = $props();
</script>

<Header />

{#if $navigating}
	<div class="page-loading">
		<div class="spinner"></div>
		<p>Loading...</p>
	</div>
{:else}
	{@render children()}
{/if}

<style>
	.page-loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		font-family: 'Phantom Sans', sans-serif;
	}
	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #f3f3f3;
		border-top: 4px solid #ff8c37;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 20px;
	}
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
</style>
