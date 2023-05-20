import { PageAuthenticationWrapper } from "@/components/PageAutheticationWrapper/PageAuthenticationWrapper";
import "@/styles/globals.css";
import { MetaMaskProvider } from "metamask-react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MetaMaskProvider>
      <PageAuthenticationWrapper>
        <Component {...pageProps} />
      </PageAuthenticationWrapper>
    </MetaMaskProvider>
  );
}
