export const AccessToken = {
	exists() {
		return sessionStorage.getItem('access_token') !== null;
	},
	get() {
		const token = sessionStorage.getItem('access_token');

		if (!token) {
			throw new Error('No access token found');
		}

		return token;
	},
	set(value: string) {
		sessionStorage.setItem('access_token', value);
	},
	remove() {
		sessionStorage.removeItem('access_token');
	}
};

export const RefreshToken = {
	exists() {
		return sessionStorage.getItem('refresh_token') !== null;
	},
	get() {
		const token = sessionStorage.getItem('refresh_token');

		if (!token) {
			throw new Error('No refresh token found');
		}

		return token;
	},
	set(value: string) {
		sessionStorage.setItem('refresh_token', value);
	},
	remove() {
		sessionStorage.removeItem('refresh_token');
	}
};
