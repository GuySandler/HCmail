<script>
	import hackclublogo from '$lib/images/hackclub.svg';
	import { goto, preloadData } from '$app/navigation';
	import gear from '$lib/images/gear.svg';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

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

	function startButton() {
		if (persistentData.apiKey !== '') {
			preloadData('/mail');
			goto('/mail?apiKey='+persistentData.apiKey);
		} else {
			goto('/settings');
		}
	}
	$effect(() => {
		console.log(persistentData);
	});

</script>
<div id="body">
	<div id="content" style="display: flex; flex-direction: column; align-items: center;">
		<div id="title">
			<!-- maybe animate switching text -->
			<h1 style="font-size:xxx-large">A New Way To Track Your <span style="display:inline-block;color:#5bc0de;font-weight: bold;position:relative;">goodies<span id="covereffect"></span></span></h1>
		</div>
		<div id="features">
			<div class="feature">
				<h2 class="featuretitle"><span class="bubble"></span>Easy Interface</h2>
				<h2 class="featuredesc">No More Horizontal Scrolling</h2>
			</div>
			<div class="feature">
				<h2 class="featuretitle"><span class="bubble"></span>No Email Login</h2>
				<h2 class="featuredesc">Just One API Key Forever</h2>
			</div>
			<div class="feature">
				<h2 class="featuretitle"><span class="bubble"></span>Privacy</h2>
				<h2 class="featuredesc">All Personal Data Stored Locally</h2>
			</div>
		</div>
		<h1 style="margin-top:50px;">Coming Soon</h1>
		<div id="coming-soon">
			<div class="coming-feature">
				<h2 class="featuretitle"><span class="coming-bubble"></span>Where Is My Stuff</h2>
				<h2 class="featuredesc">Reminder To Ask About Late Stuff</h2>
			</div>
			<div class="coming-feature">
				<h2 class="featuretitle"><span class="coming-bubble"></span>AI Overview</h2>
				<h2 class="featuredesc">Summarize Mail</h2>
			</div>
			<div class="coming-feature">
				<h2 class="featuretitle"><span class="coming-bubble"></span>Mail Managment</h2>
				<h2 class="featuredesc">Delete and Star Mail</h2>
			</div>
			<div class="coming-feature">
				<h2 class="featuretitle"><span class="coming-bubble"></span>Mail Share</h2>
				<h2 class="featuredesc">Display Public URL Mail Here</h2>
			</div>
			<div class="coming-feature">
				<h2 class="featuretitle"><span class="coming-bubble"></span>Themes</h2>
				<h2 class="featuredesc">Make It Look Pretty</h2>
			</div>
			<div class="coming-feature">
				<h2 class="featuretitle"><span class="coming-bubble"></span>Forwarding</h2>
				<h2 class="featuredesc">Send Your HCMail To Your Real Mail</h2>
			</div>
			<div class="coming-feature">
				<h2 class="featuretitle"><span class="coming-bubble"></span>Filters and Search</h2>
				<h2 class="featuredesc">Find Stuff Easily</h2>
			</div>
		</div>
		<button id="start" onclick={startButton}>Get Started</button>
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
	#covereffect {
		position:absolute;
		background-color:rgba(79, 139, 213, .5);
		width:170px;
		height:65px;
		display:inline-block;
		top: 50%;
		left: 0;
		transform: translateY(-50%) rotate(-10deg);
		border-radius: 10px;
		z-index: 1;
	}
	#title {
		width: 100%;
		text-align: center;
		margin-top: 100px;
		/* border: 1px solid red */
	}
	#features {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 20px;
		margin-top: 100px;
		border: 1px solid black;
		width: 90%;
		padding: 20px;
		border-radius: 20px 10px 20px 10px;
		background-color: #ec3750;
	}
	.feature {
		background-color: #f0f0f0;
		padding: 20px;
		border-radius: 8px;
		text-align: center;
		/* border: 1px solid red; */
		background-color: #8492a6;
		color:white;
		transition: border 0.3s ease;
		border: 2px solid transparent;
	}
	.featuretitle {
		font-size: xx-large;
		margin-bottom: 10px;
		text-align: left;
		display: flex;
		align-items: center;
	}
	.bubble {
		width: 30px;
		height: 30px;
		background-color: #5bc0de;
		border-radius: 50%;
		display: inline-block;
		margin-right: 10px;
		flex-shrink: 0;
		transition: background-color 0.3s ease;
	}
	.feature:hover {
		border: 2px solid #5bc0de;
	}
	.feature:hover .bubble {
		background-color: #338eda;
	}
	#start {
		background-color: #ff8c37;
		color: white;
		padding: 10px 20px;
		border: none;
		border-radius: 8px;
		font-size: x-large;
		cursor: pointer;
		margin-top: 50px;
		transition: scale 0.2s ease-in-out;
	}
	#start:hover {
		scale: 1.05;
		background-color: #ff8c37;
		color: white;
		padding: 10px 20px;
		border: none;
		border-radius: 8px;
		font-size: x-large;
		cursor: pointer;
		margin-top: 50px;
		transition: scale 0.2s ease-in-out;
	}
	#start:hover {
		scale: 1.05;
	}
	#coming-soon {
		background-color: #8492a6;
		border: 1px solid black;
		padding: 20px;
		border-radius: 20px 10px 20px 10px;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 20px;
		margin-top: 20px;
		width: 90%;
	}
	.coming-feature {
		background-color: #a633d6;
		padding: 20px;
		border-radius: 8px;
		text-align: center;
		color: white;
		transition: border 0.3s ease;
		border: 2px solid transparent;
	}
	.coming-feature:hover {
		border: 2px solid #5bc0de;
	}
	.coming-bubble {
		width: 30px;
		height: 30px;
		background-color: #5bc0de;
		border-radius: 50%;
		display: inline-block;
		margin-right: 10px;
		flex-shrink: 0;
		transition: background-color 0.3s ease;
	}
</style>
