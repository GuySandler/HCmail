<script>
	import hackclublogo from '$lib/images/hackclub.svg';
	import { goto } from '$app/navigation';
	import gear from '$lib/images/gear.svg';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	import Header from '$lib/components/header.svelte';

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

	$effect(() => {
		if (browser) {
			localStorage.setItem('hcmail-data', JSON.stringify(persistentData));
		}
	});

	$effect(() => {
		console.log(persistentData);
	});
</script>
<div id="body">
	<Header />
	<div id="content" style="display: flex; flex-direction: column; align-items: center;">
		<div id="settingscontainer">
			<div class="setting">
				<div id="settingtitle">
					<h1>API Key</h1>
				</div>
				<div id="settingcontent">
					<input id="apikey" type="text" placeholder="Enter your API Key here" bind:value={persistentData.apiKey} />
				</div>
			</div>
			<!-- animated check on success? -->
			<button id="update">Update</button>
		</div>
	</div>
</div>
<style>
	#body {
		background-color: #f0f0f0;
		font-family: 'Phantom Sans';

		border-radius: 8px;
		/* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
	}
	h1 {
		font-size:x-large;
	}
	button {
		cursor: pointer;
		transition: scale 0.2s ease-in-out;
	}
	button:hover {
		scale: 1.05;
	}
	#content {
		padding: 20px;
		background-color: white;
		border-radius: 8px;
		/* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
		/* border: 1px solid black; */
	}
	#settingscontainer {
		display: flex;
		flex-direction: column;
		align-items: center;
		border: 1px solid black;
		width: 75%;
		padding:20px;
		background-color: #ec3750;
		border-radius: 20px 10px 20px 10px;
	}
	.setting {
		display: flex;
		flex-direction: column;
		align-items: left;
		width: 100%;
		margin-bottom: 20px;
		border: 1px solid blue;
		padding: 10px;
		background-color: white;
		border-radius: 10px;
	}
	input {
		width: 100%;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
		font-size: 16px;
		background-color: #8492a6;
		color:white;
	}
	#update {
		background-color: #ff8c37;
		color: white;
		padding: 10px 20px;
		border: none;
		border-radius: 8px;
		font-size: x-large;
		cursor: pointer;
		margin-top: 10px;
		transition: scale 0.2s ease-in-out;
	}
	#update:hover {
		scale: 1.05;
	}
</style>
