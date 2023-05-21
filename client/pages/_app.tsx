import { PageAuthenticationWrapper } from "@/components/PageAutheticationWrapper/PageAuthenticationWrapper";
import "gestalt/dist/gestalt.css";
import "@/styles/global.css";
import { MetaMaskProvider } from "metamask-react";
import type { AppProps } from "next/app";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYlmMm3-eH4iFPww371anISnq6aUbnoEQ",
  authDomain: "nexum-5dbaa.firebaseapp.com",
  projectId: "nexum-5dbaa",
  storageBucket: "nexum-5dbaa.appspot.com",
  messagingSenderId: "322948254464",
  appId: "1:322948254464:web:c62bd7764d1e18576541e5",
};

// Initialize Firebase
initializeApp(firebaseConfig);

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
