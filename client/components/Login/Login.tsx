import { useMetaMask } from "metamask-react";
import { useRouter } from "next/router";
import { PageContainer } from "./Login.styles";
import { Box, Button, Text } from "gestalt";

export const LoginComponent = () => {
  const router = useRouter();
  const { connect, account, status } = useMetaMask();

  if (status === "connected") {
    router.push("/");
    return <></>;
  }

  return (
    <PageContainer>
      <Box
        borderStyle="raisedTopShadow"
        maxWidth={400}
        padding={12}
        alignItems="center"
        justifyContent="center"
        direction="column"
        display="flex"
        rounding={2}
        height="100%"
        maxHeight={200}
      >
        <Box marginBottom={4}>
          <Text weight="bold" size="400">
            Login with MetaMask
          </Text>
        </Box>

        <Button
          color="blue"
          fullWidth
          text="Connect"
          onClick={connect}
          iconEnd="visit"
        />
      </Box>
    </PageContainer>
  );
};
