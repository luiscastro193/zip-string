"use strict";
import {zip} from './zip-string.js';

const originalString = document.querySelector("textarea");
const [result, difference, differenceAsUrl] = document.querySelectorAll("span");
let lastId = 0;

function differenceText(original, compressed) {
	let sizeDifference = original.length - compressed.length;
	return `${sizeDifference} (${Math.round(sizeDifference / original.length * 100)}%)`;
}

async function updateResults() {
	const id = lastId = (lastId + 1) % Number.MAX_SAFE_INTEGER;
	
	if (originalString.value) {
		let compressed = await zip(originalString.value);
		if (id == lastId) {
			result.textContent = compressed;
			difference.textContent = differenceText(originalString.value, compressed);
			differenceAsUrl.textContent = differenceText(encodeURIComponent(originalString.value), compressed);
		}
	}
	else {
		result.textContent = '';
		difference.textContent = '';
		differenceAsUrl.textContent = '';
	}
}

originalString.oninput = updateResults;
updateResults();
