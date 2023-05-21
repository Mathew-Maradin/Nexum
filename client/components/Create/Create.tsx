import {
  Box,
  Button,
  FixedZIndex,
  Flex,
  Layer,
  NumberField,
  OverlayPanel,
  Text,
  TextArea,
  TextField,
} from "gestalt";
import JSZip from "jszip";
import ABIObject from "../../contract.json";
import { ethers } from "ethers";
import { useUploadFile } from "react-firebase-hooks/storage";
import { getStorage, ref } from "firebase/storage";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { Controller, useForm } from "react-hook-form";
// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { useContext } from "react";
import { FirebaseContext } from "@/pages/_app";
import { useConnectedMetaMask } from "metamask-react";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const ETH_CONVERSION = 2451.97;

const Step = ({ title, subtitle, children }) => (
  <Flex
    direction="column"
    gap={{
      row: 0,
      column: 4,
    }}
  >
    <Box>
      <Text inline weight="bold">
        {title}
      </Text>
      <Text inline> {subtitle}</Text>
    </Box>
    {children}
  </Flex>
);

export const Create = ({ setIsCreateSidepanelVisible }) => {
  const zIndex = new FixedZIndex(10);
  const { watch, control, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      files: [],
    },
  });
  const { account } = useConnectedMetaMask();
  const { firebaseApp } = useContext(FirebaseContext);

  const [uploadFile] = useUploadFile();
  const storage = getStorage(firebaseApp);
  const db = getFirestore(firebaseApp);

  const closeAndReset = () => {
    setIsCreateSidepanelVisible(false);
  };

  const onSubmit = async (data) => {
    // first ZIP all of the files and then upload them to jackal
    // const zip = new JSZip();
    // data.files.forEach((file: File) =>
    //   zip.file(file.webkitRelativePath || file.name, file, { binary: true })
    // );
    // const zippedBlob = await zip.generateAsync({ type: "blob" });
    // console.log(zippedBlob);
    // const jackalFormData = new FormData();
    // jackalFormData.append("file", zippedBlob, `${data.name}.zip`);
    // const jackalResponse = await fetch("http://localhost:2929/upload", {
    //   method: "POST",
    //   body: jackalFormData,
    //   redirect: "follow",
    // });

    // const { fid } = (await jackalResponse.json()) || {};

    if (true) {
      // create smart contract
      const CONTRACT_ADDY = "0x1058ac4eDdBC11c5Bce945D8301D5Fa61ea46f1F";
      const provider = new ethers.providers.JsonRpcProvider(
        `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`
      );
      const signer = provider.getSigner(account);
      const contract = new ethers.Contract(
        CONTRACT_ADDY,
        ABIObject.abi,
        signer
      );
      const datasets = await contract.createDataSet(
        account,
        "Test set",
        "jklf1xzhm0vz7jxjzrk77ym92dmp4y2m42edllnepc2pk9awqdtsn0u0shn025z",
        "test description",
        0.02,
        "https://imgur.com"
      );
      console.log(datasets);
      // create firestore document for the contract
      // await setDoc(doc(db, "datasets", TEST_CONTRACT_ID), {
      //   thumbnailUrls: data.files.map(
      //     (file: File) => `${TEST_CONTRACT_ID}/${file.name}`
      //   ),
      // });

      // // then upload thumbnails and set under contract ID in firestore
      // data.files.forEach(async (file: File) => {
      //   const fileRef = ref(storage, `${TEST_CONTRACT_ID}/${file.name}`);
      //   const result = await uploadFile(fileRef, file, {
      //     contentType: file.type,
      //   });
      // });
    }
  };

  const onError = (errors, e) => console.log(errors, e);

  return (
    <Layer zIndex={zIndex}>
      <OverlayPanel
        accessibilityLabel="create dataset"
        onDismiss={closeAndReset}
        closeOnOutsideClick={false}
        dismissConfirmation={{}}
        footer={
          <Flex justifyContent="end">
            <Button
              text="Publish Dataset"
              onClick={handleSubmit(onSubmit, onError)}
              color="blue"
            />
          </Flex>
        }
        heading="Create Dataset"
        size="lg"
      >
        <Flex
          direction="column"
          gap={{
            row: 0,
            column: 12,
          }}
        >
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <Step
              title="Step 1: "
              subtitle="Enter some basic details about your dataset"
            >
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <TextField
                    label="Name"
                    placeholder="Name your dataset"
                    id="datasetName"
                    onChange={({ value }) => onChange(value)}
                    value={value}
                  />
                )}
              />
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <TextArea
                    label="Description"
                    placeholder=""
                    helperText="Describe your dataset in detail"
                    maxLength={{
                      characterCount: 400,
                      errorAccessibilityLabel: "",
                    }}
                    id="datasetDescription"
                    onChange={({ value }) => onChange(value)}
                    value={value}
                  />
                )}
              />
            </Step>
            <Step title="Step 2: " subtitle="How much will your dataset cost?">
              <Controller
                control={control}
                name="price"
                render={({ field: { onChange, value } }) => (
                  <NumberField
                    id="datasetPrice"
                    label="Price (ETH)"
                    helperText={`$${(ETH_CONVERSION * Number(value)).toFixed(
                      2
                    )} CAD`}
                    min={0}
                    onChange={({ value }) => onChange(value)}
                    value={Number(value)}
                    step={0.0001}
                  />
                )}
              />
            </Step>
            <Step title="Step 3: " subtitle="Upload your dataset files">
              <Controller
                control={control}
                name="files"
                render={({ field: { onChange, value } }) => (
                  <FilePond
                    files={value}
                    onupdatefiles={(files) => {
                      onChange(files.map((file) => file.file));
                    }}
                    allowMultiple={true}
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                    credits={false}
                    instantUpload={false}
                  />
                )}
              />
            </Step>
          </form>
        </Flex>
      </OverlayPanel>
    </Layer>
  );
};
