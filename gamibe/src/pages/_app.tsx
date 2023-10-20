// src/pages/_app.tsx
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { withTRPC } from "@trpc/next";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
import type { AppRouter } from "../server/router";
import "../styles/globals.css";
import { useEffect } from "react";
import { trpc } from "../utils/trpc";
import { Provider } from "jotai";
import store, { useStore } from "../store/index";
import { useRouter } from "next/router";

import Header from "../components/layout/Header";

const MyApp: AppType = ({
	Component,
	pageProps: { session, ...pageProps },
}) => {
	const { data: currentSession, isLoading }: any = trpc.useQuery([
		"auth.getSession",
	]);
	const [, setGlobalStore] = useStore("auth");
	const router = useRouter();

	useEffect((): any => {
		if (isLoading) return;
		console.log(currentSession);
		if (!currentSession) {
			router.push("/login");
			return;
		}
		setGlobalStore({ user: currentSession.user });
	}, [currentSession]);

	return (
		<SessionProvider session={session}>
			<Provider scope={store.globalScope}>
				<Header />
				<main className="container mx-auto flex flex-col items-center justify-center p-4">
					<Component {...pageProps} />
				</main>
			</Provider>
		</SessionProvider>
	);
};

const getBaseUrl = () => {
	if (typeof window !== "undefined") return ""; // browser should use relative url
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
	return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
	config() {
		/**
		 * If you want to use SSR, you need to use the server's full URL
		 * @link https://trpc.io/docs/ssr
		 */
		const url = `${getBaseUrl()}/api/trpc`;

		return {
			links: [
				loggerLink({
					enabled: (opts) =>
						process.env.NODE_ENV === "development" ||
						(opts.direction === "down" && opts.result instanceof Error),
				}),
				httpBatchLink({ url }),
			],
			url,
			transformer: superjson,
			/**
			 * @link https://react-query.tanstack.com/reference/QueryClient
			 */
			// queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
		};
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 */
	ssr: false,
})(MyApp);
