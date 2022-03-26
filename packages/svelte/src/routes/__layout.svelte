<header>
	<h1>StaticMaps</h1>
</header>

<aside>
	sidebar

	<nav>
		<ul>
			<li>
				<a href="/">Home</a>
			</li>
			<li>
				<a href="/first">Server Side Only</a>
			</li>
		</ul>
	</nav>
</aside>

<main>
	<slot />
</main>

<style lang="scss">
	:global {
		body {
            min-height: 100vh;
			font-family: Arial, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
				Cantarell, Open Sans, Helvetica Neue, sans-serif;

			display: grid;
			grid-template:
				'h h' max-content
				's m' auto / max-content auto;
		}
	}
	header {
		grid-area: h;
		background: white;
		box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
		height: 48px;
		display: grid;
		align-items: center;
		padding: 0 8px;
		z-index: 1;
	}
	aside {
		grid-area: s;
		padding: 16px;
		box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
		z-index: 0;

		nav {
			ul {
				li {
					padding: 8px 0;
				}
			}
		}
	}
	main {
		grid-area: m;
		padding: 16px;
	}
</style>
