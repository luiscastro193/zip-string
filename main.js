"use strict";
import {zip} from './zip-string.js';

const originalString = document.querySelector("textarea");
const [result, difference] = document.querySelectorAll("span");
let lastId = 0;

async function updateResults() {
	lastId = (lastId + 1) % Number.MAX_SAFE_INTEGER;
	const id = lastId;
	
	if (originalString.value) {
		let compressed = await zip(originalString.value);
		if (id == lastId) {
			result.textContent = compressed;
			difference.textContent = encodeURIComponent(originalString.value).length - compressed.length;
		}
	}
	else {
		result.textContent = '';
		difference.textContent = '';
	}
}

originalString.oninput = updateResults;
updateResults();
