import { useEffect, useState } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
	const [url, setUrl] = useState("");
	const router = useRouter();

	const handleChange = (e) => setUrl(e.target.value);

	const handleSubmit = (e) => {
		e.preventDefault();
		router.push(`/meta?url=${url}`);
	};

	return (
		<>
			<Head>
				<title>Web Meta</title>
				<meta name="description" content="An app for visualizing your metadata" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="app">
				<h1>Web Meta</h1>
				<form onSubmit={handleSubmit}>
					<label>
						URL:
						<input type="url" name="url" value={url} onChange={handleChange} placeholder="Enter a website URL" />
					</label>
					<button type="submit">Submit</button>
				</form>
			</main>
		</>
	);
}
