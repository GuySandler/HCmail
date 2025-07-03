<div id="header">
	<div style="display: flex; align-items: center; justify-content: space-between;">
		<button onclick={gotoHome} style="display: flex; align-items: center;background-color:#338eda; padding: 5px; border-radius: 8px;">
			<img src={hackclublogo} alt="Hack Club Logo" style="height: 30px; width: auto; vertical-align: middle;display: inline-block;margin-right: 10px;margin-left: 5px;" id="home">
			<h1 style="font-size:x-large;display: inline-block;margin-right: 10px;">Hack Club Mail</h1>
		</button>
		<button onclick={gotoMail} style="display: flex; align-items: center; padding: 5px; border-radius: 8px;" id="mail">
			<h1 style="font-size:x-large;display: inline-block;margin-right: 10px;margin-left:10px;">Your Mail</h1>
		</button>
		<button onclick={gotoSettings} style="display: flex; align-items: center;background-color:#ff8c37; padding: 5px; border-radius: 8px;" id="settings">
			<img src={gear} alt="Hack Club Logo" style="height: 30px; width: auto; vertical-align: middle;display: inline-block;margin-right: 10px;margin-left: 5px;">
			<h1 style="font-size:x-large;display: inline-block;margin-right: 10px;">Settings</h1>
		</button>
	</div>
</div>
<script>
	import hackclublogo from '$lib/images/hackclub.svg';
	import gear from '$lib/images/gear.svg';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let persistentData = $state({
		apiKey: '',
		isSetup: false
	});

	onMount(() => {
		if (browser) {
			const stored = localStorage.getItem('hcmail-data');
			if (stored) {
				persistentData = JSON.parse(stored);
			}
		}
	});

	function gotoSettings() {
		goto('/settings');
	}
	function gotoHome() {
		goto('/');
	}
	function gotoMail() {
		goto('/mail?apiKey='+persistentData.apiKey);
	}
</script>
<style>
	#header {
		color: white;
		border: 1px solid red;
		padding: 10px;
		width: 100%;
		margin-bottom: 20px;
		background-color: #ec3750;
		border-radius: 0 0 8px 8px;
	}
	button {
		cursor: pointer;
		transition: scale 0.2s ease-in-out;
	}
	button:hover {
		scale: 1.05;
	}
</style>