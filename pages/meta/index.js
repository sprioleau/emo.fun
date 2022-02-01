import Head from "next/head";
import Link from "next/link";
import getMeta from "../utils/getMeta";

export default function MetaPage({ meta }) {
	return (
		<>
			<Head>
				<title>Web Meta</title>
				<meta name="description" content="An app for visualizing your metadata" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="app">
				<h1>Web Meta</h1>
				<Link href="/">
					<a>
						<button>Back to home</button>
					</a>
				</Link>
				<pre>{JSON.stringify(meta, null, 2)}</pre>
			</main>
		</>
	);
}

export const getServerSideProps = async (req, res) => {
	const meta = await getMeta(req.query.url);

	return {
		props: {
			meta,
		},
	};
};
