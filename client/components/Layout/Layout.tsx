import { useConnectedMetaMask } from "metamask-react";
import { Container, TopBar } from "./Layout.styles";
import { Avatar, Box, Button, Dropdown, Text } from "gestalt";
import { useRef, useState } from "react";
import { useRouter } from "next/router";

export const Layout = ({ children }) => {
  const router = useRouter();
  const { account } = useConnectedMetaMask();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownAnchorRef = useRef(null);

  return (
    <Container>
      <TopBar>
        <Text weight="bold" size="400">
          Nexum
        </Text>
        <Button
          onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
          selected={isUserDropdownOpen}
          iconEnd="arrow-down"
          text={account.substring(0, 10) + "..."}
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
