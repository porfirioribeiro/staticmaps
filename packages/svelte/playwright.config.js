/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
	webServer: {
		command: 'pnpm run build:demo && pnpm run preview',
		port: 3000,
		reuseExistingServer: true
	}
};

export default config;
