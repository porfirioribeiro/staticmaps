/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
	testDir: 'tests',
	webServer: {
		command: 'pnpm run build:demo && pnpm run preview --port 4173',
		url: 'http://localhost:4173',
		reuseExistingServer: !process.env.CI
	},
	use: { baseURL: 'http://localhost:4173' }
};

export default config;
