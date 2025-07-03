import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const ALLOWED_ENDPOINTS = {
	mail: 'https://mail.hackclub.com/api/public/v1/mail',
	letter: 'https://mail.hackclub.com/api/public/v1/letters/', // ID, for letters
	hs: 'https://mail.hackclub.com/api/public/v1/lsv/hs/', // shipment if hs_
	msr: 'https://mail.hackclub.com/api/public/v1/lsv/msr/' // shipment if marketing_service_request
};

export const GET: RequestHandler = async ({ url }) => {
	const apiKey = url.searchParams.get('apiKey');
	const endpoint = url.searchParams.get('endpoint') || 'mail';
	const path = url.searchParams.get('path') || '';
	
	if (!apiKey) {
		throw error(400, 'API key is required');
	}

	if (!ALLOWED_ENDPOINTS[endpoint]) {
		throw error(400, `Invalid endpoint: ${endpoint}`);
	}

	try {
		// Build the target URL with optional path
		const baseUrl = ALLOWED_ENDPOINTS[endpoint];
		const fullUrl = path ? `${baseUrl}${path}` : baseUrl;
		const targetUrl = new URL(fullUrl);

		url.searchParams.forEach((value, key) => {
			if (key !== 'apiKey' && key !== 'endpoint' && key !== 'path') {
				targetUrl.searchParams.set(key, value);
			}
		});

		console.log('Fetching from:', targetUrl.toString());
		const response = await fetch(targetUrl.toString(), {
			headers: {
				'Authorization': `Bearer ${apiKey}`
			}
		});
		
		if (!response.ok) {
			throw error(response.status, `Failed to fetch ${endpoint}: ${response.statusText}`);
		}
		
		const data = await response.json();
		return json(data);
	} catch (err) {
		console.error(`Error fetching ${endpoint}:`, err);
		if (err instanceof Error) {
			throw error(500, err.message);
		}
		throw error(500, 'Failed to fetch data');
	}
};