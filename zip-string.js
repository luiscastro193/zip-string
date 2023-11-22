"use strict";
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64url(base64) {
	return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function toBase64(base64url) {
	return base64url.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - base64url.length % 4) % 4);
}

function toString(buffer) {
	return toBase64url(btoa(String.fromCodePoint(...Array.from(new Uint8Array(buffer)))));
}

function toBuffer(string) {
	return Uint8Array.from(atob(toBase64(string)), c => c.codePointAt(0));
}

export async function zip(string) {
	let stream = new Blob([encoder.encode(string)]).stream().pipeThrough(new CompressionStream("deflate"));
	return toString(await new Response(stream).arrayBuffer());
}

export async function unzip(string) {
	let stream = new Blob([toBuffer(string)]).stream().pipeThrough(new DecompressionStream("deflate"));
	return decoder.decode(await new Response(stream).arrayBuffer());
}
