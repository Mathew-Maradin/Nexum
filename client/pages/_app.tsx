import { PageAuthenticationWrapper } from "@/components/PageAutheticationWrapper/PageAuthenticationWrapper";
import "gestalt/dist/gestalt.css";
import "@/styles/global.css";
import { MetaMaskProvider } from "metamask-react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const { isAuthenticated } = pageProps || {};

  return (
    <MetaMaskProvider>
      <PageAuthenticationWrapper isAuthenticated={isAuthenticated}>
        <Component {...pageProps} />
      </PageAuthenticationWrapper>
    </MetaMaskProvider>
  );
}
