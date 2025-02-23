"use strict";
const decoder = new TextDecoder("utf-8", {fatal: true});

function toBase64url(base64) {
	return base64.replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function toBase64(base64url) {
	return base64url.replaceAll('-', '+').replaceAll('_', '/');
}

function toString(buffer) {
	buffer = new Uint8Array(buffer);
	if (buffer.toBase64)
		return buffer.toBase64({alphabet: "base64url", omitPadding: true});
	else
		return toBase64url(btoa(String.fromCodePoint(...buffer)));
}

function toBuffer(string) {
	if (Uint8Array.fromBase64)
		return Uint8Array.fromBase64(string, {alphabet: "base64url"});
	else
		return Uint8Array.from(atob(toBase64(string)), c => c.codePointAt(0));
}

export async function zip(string) {
	let stream = new Blob([string]).stream().pipeThrough(new CompressionStream("deflate"));
	return toString(await new Response(stream).arrayBuffer());
}

export async function unzip(string) {
	let stream = new Blob([toBuffer(string)]).stream().pipeThrough(new DecompressionStream("deflate"));
	return decoder.decode(await new Response(stream).arrayBuffer());
}
