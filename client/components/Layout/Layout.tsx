import { useConnectedMetaMask, useMetaMask } from "metamask-react";
import { Container, TopBar } from "./Layout.styles";
import { Avatar, Box, Button, Dropdown, Text } from "gestalt";
import { useRef, useState } from "react";
import { useRouter } from "next/router";

export const Layout = ({ children }) => {
  const router = useRouter();
  const { account, connect } = useMetaMask();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownAnchorRef = useRef(null);

  const handleButtonClick = () => {
    account ? setIsUserDropdownOpen(!isUserDropdownOpen) : connect();
  };

  return (
    <Container>
      <TopBar>
        <Text weight="bold" size="400">
          Nexum
        </Text>
        <Button
          onClick={handleButtonClick}
          selected={isUserDropdownOpen}
          iconEnd={account ? "arrow-down" : "visit"}
          text={account ? account.substring(0, 10) + "..." : "Login"}
          size="lg"
          ref={dropdownAnchorRef}
        />
        {isUserDropdownOpen && (
          <Dropdown
            id="user-dropdown"
            onDismiss={() => setIsUserDropdownOpen(false)}
            anchor={dropdownAnchorRef.current}
          >
            <Dropdown.Item
              onSelect={() => router.push("/purchases")}
              option={{ value: "Datasets", label: "Datasets" }}
            ></Dropdown.Item>
          </Dropdown>
        )}
      </TopBar>
      {children}
    </Container>
  );
};
