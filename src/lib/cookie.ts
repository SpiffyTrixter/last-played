export function cookieExists(name: string) {
	return document.cookie.includes(name);
}

export function getCookie(name: string) {
	const cookie = document.cookie
		.split(';')
		.find((cookie) => cookie.includes(name))
		?.split('=')[1];

	if (!cookie) {
		return null;
	}

	return cookie;
}

export function setCookie(name: string, value: string, expiresInSeconds: number) {
	document.cookie = `${name}=${value}; expires=${new Date(
		Date.now() + expiresInSeconds * 1000
	).toUTCString()}; path=/`;
}

export function removeCookie(name: string) {
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function removeAllCookies() {
	document.cookie.split(';').forEach((cookie) => {
		document.cookie = cookie
			.replace(/^ +/, '')
			.replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
	});
}
