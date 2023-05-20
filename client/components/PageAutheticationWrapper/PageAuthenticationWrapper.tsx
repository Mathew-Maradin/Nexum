import { useMetaMask } from "metamask-react";
import { useRouter } from "next/router";
import React, { FC, ReactNode } from "react";

interface IPageAuthenticationWrapper {
  isAuthenticated?: boolean;
  children: any;
}

export const PageAuthenticationWrapper = ({
  isAuthenticated,
  children,
}: IPageAuthenticationWrapper) => {
  const router = useRouter();
  const { status, account } = useMetaMask();

  if (isAuthenticated) {
    if (status === "initializing" || status === "connecting")
      return <div></div>;

    if (status === "unavailable")
      return <div>Error connecting to metamask</div>;

    if (status === "notConnected" || !account) {
      router.push("/login");
      return;
    }

    if (status === "connected") return children;
  } else {
    return children;
  }
};
