<!-- cach later -->
<script lang="ts">
	import hackclublogo from '$lib/images/hackclub.svg';
	import { goto } from '$app/navigation';
	import gear from '$lib/images/gear.svg';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { PageDzata } from './$types';

	let persistentData = $state({
		apiKey: '',
		isSetup: false
	});

	let mailData = $state([]);
	let tags = [];
	let types = [];

	let RetrievedMail = $state({});

	let isLoading = $state(true);
	let error = $state('');

	onMount(() => {
		if (browser) {
			const stored = localStorage.getItem('hcmail-data');
			if (stored) {
				persistentData = JSON.parse(stored);
			}

			const urlParams = new URLSearchParams(window.location.search);
			const apiKeyFromUrl = urlParams.get('apiKey');
			
			if (apiKeyFromUrl) {
				persistentData.apiKey = apiKeyFromUrl;
				localStorage.setItem('hcmail-data', JSON.stringify(persistentData));
			}

			if (persistentData.apiKey) {
				fetchMail();
			} else {
				isLoading = false;
				error = 'Missing API key';
			}
		}
	});

	async function fetchMail() {
		if (!persistentData.apiKey) {
			error = 'Missing API key';
			return;
		}

		isLoading = true;
		error = '';
		
		try {
			const response = await fetch(`/api/mail?apiKey=${encodeURIComponent(persistentData.apiKey)}`);
			
			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
			}
			
			const data = await response.json();
			console.log('Fetched mail data:', data.mail);
			mailData = data.mail;
			for (const mail of mailData) {
				if (mail.tags && Array.isArray(mail.tags)) {
					for (const tag of mail.tags) {
						if (!tags.includes(tag)) {
							tags.push(tag);
						}
					}
				}
				if (mail.type && !types.includes(mail.type)) {
					if (mail.type === 'marketing_shipment_request') {
						mail.type = 'shipment';
					}
					else if (mail.type === 'legacy_shipment_viewer_record') {
						mail.type = 'shipment_hs';
					}
					types.push(mail.type);
				}
				// TODO: Format date settings
				if (mail.created_at) {
					mail.created_at = new Date(mail.created_at).toLocaleDateString('en-US', {
						year: 'numeric',
						month: '2-digit',
						day: '2-digit'
					});
				}
			}
			console.log('Fetched tags:', tags);
			console.log('Fetched types:', types);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to fetch mail';
			console.error('Error fetching mail:', err);
		} finally {
			isLoading = false;
		}
	}

	function handleCopy(text) {
		navigator.clipboard.writeText(text)
			.then(() => {
				console.log('Text copied to clipboard:', text);
			})
			.catch(err => {
				console.error('Failed to copy text:', err);
				alert('Failed to copy text');
			});
	}

	let daysAgo = $state(0);
	let showBlurBar = $state(false);
	let blurBarOpacity = $state(0);

	function handleScroll(event) {
		const scrollTop = event.target.scrollTop;
		showBlurBar = scrollTop > 0;
		blurBarOpacity = Math.min(scrollTop / 50, 1);
	}
	// when cheching for mail, if letter /letters/:id, else check subtype, if "hs_third_party_physical_shipment" /lsv/hs/:id, if "marketing_shipment_request" /lsv/msr/:id
	async function handleMailClick(mail) {
		let data;
		console.log('Clicked mail:', mail.type + ' - ' + mail.subtype);
		if (mail.type === 'shipment_hs') {
			console.log('Handling shipment mail:', mail);
			const response = await fetch(`/api/mail?apiKey=${encodeURIComponent(persistentData.apiKey)}&endpoint=hs&path=${mail.id}`);
			data = await response.json();
			RetrievedMail = data.legacy_shipment_viewer_record;

		} else if (mail.type === 'shipment' && mail.subtype === 'marketing_shipment_request') {
			console.log('Handling marketing shipment request mail:', mail);
			const response = await fetch(`/api/mail?apiKey=${encodeURIComponent(persistentData.apiKey)}&endpoint=msr&path=${mail.id}`);
			data = await response.json();
			RetrievedMail = data.legacy_shipment_viewer_record;

		} else {
			console.log('Handling letter mail:', mail.id);
			const response = await fetch(`/api/mail?apiKey=${encodeURIComponent(persistentData.apiKey)}&endpoint=letter&path=${mail.id}`);
			data = await response.json();
			RetrievedMail = data.letter;
		}
		if (RetrievedMail.created_at) {
			RetrievedMail.created_at = new Date(RetrievedMail.created_at).toLocaleDateString('en-US', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit'
			});
		}
		daysAgo = Math.floor((new Date() - new Date(RetrievedMail.created_at)) / (1000 * 60 * 60 * 24));
		console.log('Retrieved mail data:', RetrievedMail);
	}


</script>
<div id="body">
	<div id="content" style="display: flex; flex-direction: column; align-items: center;">
		{#if isLoading}
			<div class="loading">
				<h2>Loading your mail...</h2>
				<div class="spinner"></div>
			</div>
		{:else if error}
			<div class="error">
				<h2>{error}</h2>
				{#if error === 'Missing API key'}
					<p>Please set up your API key first.</p>
					<button onclick={() => goto('/settings')}>Go to Settings</button>
				{:else}
					<p>{error}</p>
					<button onclick={fetchMail}>Retry</button>
				{/if}
			</div>
		{:else if mailData && mailData.length > 0}
			<div class="mail-container">
				<div class="mail-list" onscroll={handleScroll}>
					<!-- {#if showBlurBar}
						<div id="blurbartop" style="opacity: {blurBarOpacity}"></div>
					{/if} scrapped feature-->
					{#each mailData as mail}
						<button onclick={() => handleMailClick(mail)} class="mail">
							<div class="mail-item title">{mail.title || 'No Subject'}</div>
							<div class="mail-item type">type: {mail.type}</div>
							<div class="mail-item date">date: {mail.created_at}</div>
							<div class="mail-item status">status: {mail.status}</div>
						</button>
					{/each}
				</div>
				<!-- <div id="blurbarbottom"></div> -->
				<!-- add draggable vertical line, advanced mode to show more data -->
				{#if RetrievedMail && Object.keys(RetrievedMail).length > 0}
					<div class="retrieved-mail">
						<div class="mail-header">
							<p id="mailtitle">{RetrievedMail.title || 'No Subject'}</p>
							<button id="closemail" onclick={() => RetrievedMail = {}}>X</button>
						</div>
						<!-- <p><strong>ID:</strong> {RetrievedMail.id}</p> advanced mode -->
						<!-- <p><strong>Type:</strong> {RetrievedMail.type}</p> advanced mode -->
						<div>
							<p id="maildate">{RetrievedMail.created_at}</p>
							<p id="maildaysago">({daysAgo} days ago)</p>
						</div>
						<div>
							<p class="mailcontenttext" style="font-weight: bold;">Status: </p>
							<p class="mailcontenttext">{RetrievedMail.status}</p>
						</div>
						{#if RetrievedMail.tracking_number}
							<div>
								<p class="mailcontenttext" style="font-weight: bold;">Tracking Number: </p>
								<div class="mailcontent">{RetrievedMail.tracking_number}</div>
							</div>
						{/if}
						{#if RetrievedMail.tracking_link}
							<button id="trackingLink" onclick={() => window.open(RetrievedMail.tracking_link, '_blank')}>Tracking Link</button>
						{/if}
						<button onclick={() => handleCopy(RetrievedMail.public_url)}>Copy Public URL</button>
					</div>
				{/if}
			</div>
		{:else}
			<div class="no-mail">
				<h2>No mail found</h2>
				<button onclick={() => window.location.reload()}>Refresh</button>
			</div>
		{/if}
	</div>
</div>
<style>
	#body {
		background-color: #f0f0f0;
		font-family: 'Phantom Sans';
		border-radius: 8px;
	}
	h1 {
		font-size: x-large;
	}
	button {
		cursor: pointer;
		transition: scale 0.2s ease-in-out;
		background-color: #ff8c37;
		color: white;
		padding: 10px 20px;
		border: none;
		border-radius: 8px;
		font-size: large;
	}
	button:hover {
		scale: 1.05;
	}
	#content {
		padding: 20px;
		background-color: white;
		border-radius: 8px;
	}
	.loading {
		text-align: center;
		padding: 40px;
	}
	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #f3f3f3;
		border-top: 4px solid #ff8c37;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 20px auto;
	}
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
	.error {
		text-align: center;
		padding: 40px;
		color: #d32f2f;
	}
	.mail-container {
		display: flex;
		width: 100%;
		height: 87vh;
		gap: 20px;
		position: relative;
	}
	.mail-list {
		flex: 1;
		overflow-y: auto;
		padding-right: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.mail {
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 20px;
		margin-bottom: 15px;
		background-color: #fafafa;
		border: 1px black solid;
		display: grid;
		grid-template-columns: 2fr 1fr 1fr 1fr;
		gap: 15px;
		align-items: center;
		cursor: pointer;
		transition: background-color 0.3s ease, border-color 0.3s ease, scale 0.2s ease;
		width: 85%;
	}
	.mail:hover {
		background-color: #8492a6;
		border-color: #ff8c37;
		scale: 1.02;
		border-radius: 8px;
	}
	.mail-item {
		margin: 0;
		font-size: medium;
		color: #333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.mail-item{
		font-size: small;
		color: #666;
	}
	.title {
		font-weight: bold;
		font-size: large;
		color: black;
	}
	
	.no-mail {
		text-align: center;
		padding: 40px;
		color: #666;
	}
	.retrieved-mail {
		flex: 1;
		background-color: #f9f9f9;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 20px;
		overflow-y: auto;
	}
	#closemail {
		background-color: #ff8c37;
		color: white;
		border: none;
		cursor: pointer;
		padding: 5px 10px;
		border-radius: 4px;
		font-size: medium;
		width:40px;
		height:40px;
	}
	#mailtitle {
		font-size: x-large;
		font-weight: bold;
		margin: 0;
		flex: 1;
	}
	.mail-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	#maildate {
		font-size: medium;
		color: #666;
		margin: 0;
		margin-bottom: 15px;
		display: inline-block;
	}
	#maildaysago {
		font-size: medium;
		color: #666;
		margin-left: 10px;
		display: inline-block;
	}
	.mailcontenttext {
		font-size: large;
		color: black;
		margin: 0;
		margin-bottom: 5px;
		display: inline-block;
	}
	.mailcontent {
		font-size: large;
		color: black;
		margin: 0;
		margin-bottom: 15px;
		display: inline-block;
	}
	#blurbartop {
		width: 85%;
		height: 40px;
		position: fixed;
		top: 100px;
		left: 50%;
		transform: translateX(-50%);
		backdrop-filter: blur(2px);
		z-index: 10;
		transition: opacity 0.1s ease;
		/* border: 2px solid red; */
	}
	#blurbarbottom {
		width: 100%;
		height: 40px;
		position: fixed;
		bottom: 0;
		left: 0;
		backdrop-filter: blur(2px);
		z-index: 10;
	}

</style>
