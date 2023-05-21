import {
  Badge,
  Box,
  Button,
  Collage,
  FixedZIndex,
  Flex,
  Image,
  Layer,
  Link,
  Mask,
  OverlayPanel,
  Text,
  Toast,
} from "gestalt";
import {
  BadgeContainer,
  DatasetDescriptionContainer,
  DatasetDescriptionInnerContainer,
  TitleContainer,
} from "./DatasetCard.styles";
import { utils } from "ethers";
import { useState } from "react";
import { useContract } from "@/util/useContract";
import { useConnectedMetaMask } from "metamask-react";

export const DatasetCard = ({
  fid,
  name,
  thumnbnailUrls,
  numImages,
  description,
  cost,
  owner,
  index,
  authorizedUsers,
}) => {
  const [isDetailsSidepanelOpen, setIsDetailsSidepanelOpen] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [txnAddress, setTxnAddress] = useState("");
  const [showToast, setShowToast] = useState(false);
  const sidepanelZIndex = new FixedZIndex(10);
  const { contract, address } = useContract();
  const { account, ethereum } = useConnectedMetaMask();

  const isUserAuthorizedToDownload = Boolean(
    authorizedUsers.filter(
      (user) => user.toLowerCase() === account.toLowerCase()
    )?.length
  );

  const buyDataset = async () => {
    // buy
    setIsBuying(true);
    try {
      const txnDetails = {
        to: address,
        from: account,
        value: utils.parseUnits(cost.toString(), "wei").toHexString(),
        data: contract.methods.buyDataSet(index).encodeABI(),
      };
      const txn = await ethereum.request({
        method: "eth_sendTransaction",
        params: [txnDetails],
      });
      setTxnAddress(txn);
      setIsDetailsSidepanelOpen(false);
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 10000);
    } catch {
      setIsBuying(false);
    }
    setIsBuying(false);
  };

  return (
    <>
      <div onClick={() => setIsDetailsSidepanelOpen(true)}>
        <Box rounding={3} overflow="hidden" height="300px">
          <Collage
            columns={2}
            height={300}
            width={300}
            renderImage={({ index, width, height }) => {
              const image = thumnbnailUrls?.[index];
              return (
                <Mask wash width={width} height={height}>
                  <Image
                    alt="collage image"
                    fit="cover"
                    naturalHeight={300}
                    naturalWidth={300}
                    src={image}
                  />
                </Mask>
              );
            }}
          />
          <DatasetDescriptionContainer
            onClick={() => setIsDetailsSidepanelOpen(true)}
          >
            <DatasetDescriptionInnerContainer>
              <TitleContainer>
                <Text lineClamp={1} color="light" weight="bold" size="400">
                  {name}
                </Text>
                <BadgeContainer>
                  <Badge
                    text={`${utils.formatEther(cost)} ETH`}
                    type="lightWash"
                  />
                </BadgeContainer>
              </TitleContainer>

              <Text lineClamp={2} color="light">
                {description}
              </Text>
            </DatasetDescriptionInnerContainer>
          </DatasetDescriptionContainer>
        </Box>
      </div>
      {isDetailsSidepanelOpen && (
        <Layer zIndex={sidepanelZIndex}>
          <OverlayPanel
            accessibilityLabel="create dataset"
            onDismiss={() => setIsDetailsSidepanelOpen(false)}
            footer={
              !isUserAuthorizedToDownload && (
                <Flex justifyContent="end">
                  <Button
                    text={isBuying ? "Confirming Purchase..." : "Buy Dataset"}
                    onClick={buyDataset}
                    color="blue"
                    disabled={isBuying}
                  />
                </Flex>
              )
            }
            heading={name}
            size="sm"
          >
            <Flex direction="column" gap={{ row: 8, column: 8 }}>
              <Flex direction="column" gap={{ row: 2, column: 2 }}>
                <Text weight="bold">Description</Text>
                <Text>{description}</Text>
              </Flex>

              <Flex direction="column" gap={{ row: 2, column: 2 }}>
                <Text weight="bold">Number of Images</Text>
                <Text>{numImages}</Text>
              </Flex>

              <Flex direction="column" gap={{ row: 2, column: 2 }}>
                <Text weight="bold">Price</Text>
                <Text>{`${utils.formatEther(cost)} ETH`}</Text>
              </Flex>
              <Flex direction="column" gap={{ row: 2, column: 2 }}>
                <Text weight="bold">Owner</Text>
                <Text inline>
                  <Link
                    externalLinkIcon="default"
                    href={`https://sepolia.etherscan.io/address/${owner}`}
                    underline="always"
                    target="blank"
                  >
                    {owner}
                  </Link>
                </Text>
              </Flex>

              {isUserAuthorizedToDownload && (
                <Flex direction="column" gap={{ row: 2, column: 2 }}>
                  <Text weight="bold">Download Link</Text>
                  <Text inline>
                    <Link
                      externalLinkIcon="default"
                      href={`${process.env.NEXT_PUBLIC_JACKAL_HOST}/${fid}`}
                      underline="always"
                      target="blank"
                    >
                      {name}.zip
                    </Link>
                  </Text>
                </Flex>
              )}
            </Flex>
          </OverlayPanel>
        </Layer>
      )}
      {showToast && (
        <Layer>
          <Box
            dangerouslySetInlineStyle={{
              __style: {
                bottom: 50,
                left: "50%",
                transform: "translateX(-50%)",
              },
            }}
            width="100%"
            paddingX={1}
            position="fixed"
            display="flex"
            justifyContent="center"
          >
            <Toast
              dissmissButton={undefined}
              variant="progress"
              primaryAction={{
                accessibilityLabel: "view",
                label: "View",
                href: `https://sepolia.etherscan.io/tx/${txnAddress}`,
                target: "blank",
              }}
              text={<Text inline>Transaction processing</Text>}
              thumbnail={{
                image: (
                  <Image
                    alt="preview thumbnail"
                    naturalHeight={564}
                    naturalWidth={564}
                    src={thumnbnailUrls?.[0]}
                  />
                ),
              }}
            />
          </Box>
        </Layer>
      )}
    </>
  );
};
