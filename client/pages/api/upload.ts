import { FileIo, FileUploadHandler, IChainConfig, IUploadList, StorageHandler, WalletHandler } from "jackal.js";
import { NextApiRequest, NextApiResponse } from "next";

const chainConfig: IChainConfig = {
  chainId: "jackal-1",
  chainName: "Jackal Mainnet",
  rpc: "https://rpc.jackalprotocol.com",
  rest: "https://api.jackalprotocol.com",
  bip44: {
    coinType: 118,
  },
  coinType: 118,
  stakeCurrency: {
    coinDenom: "JKL",
    coinMinimalDenom: "ujkl",
    coinDecimals: 6,
  },
  bech32Config: {
    bech32PrefixAccAddr: "jkl",
    bech32PrefixAccPub: "jklpub",
    bech32PrefixValAddr: "jklvaloper",
    bech32PrefixValPub: "jklvaloperpub",
    bech32PrefixConsAddr: "jklvalcons",
    bech32PrefixConsPub: "jklvalconspub",
  },
  currencies: [
    {
      coinDenom: "JKL",
      coinMinimalDenom: "ujkl",
      coinDecimals: 6,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "JKL",
      coinMinimalDenom: "ujkl",
      coinDecimals: 6,
      gasPriceStep: {
        low: 0.002,
        average: 0.002,
        high: 0.02,
      },
    },
  ],
  features: [],
};

const upload = async (req: NextApiRequest, res: NextApiResponse) => {
  const isThumbnailRequest = req.body.isThumbnailRequest;

  if (isThumbnailRequest) {
    // upload the images to firebase storage and then associate them with the contract
    // in firestore
  } else {
    // assert that the file is a ZIP and then upload it to Jackal
    const wallet = await WalletHandler.trackWallet({
      selectedWallet: "keplr",
      signerChain: "jackal-1",
      enabledChains: ["jackal-1"],
      queryAddr: "https://kdb-grpc.jackalprotocol.com",
      txAddr: "https://kdb-rpc.jackalprotocol.com",
      chainConfig,
    });

    const fileIo = await FileIo.trackIo(wallet);

    const FOLDER_NAME = "home"
    const folders = await fileIo.verifyFoldersExist([FOLDER_NAME]);
    const folderHandler = await fileIo.downloadFolder(FOLDER_NAME);

    const file = new File(, "name")
    const fileHandler = await FileUploadHandler.trackFile(file)

    const uploads: IUploadList = {
      "test_name": {
        data: null,
        exists: false,
        handler: fileHandler,
        key: "name",
        uploadable: await fileHandler.getForUpload()
      }
    }

    fileIo.staggeredUploadFiles(uploads, folderHandler, { complete: 0, timer: 0})
  }
};

export default upload;
