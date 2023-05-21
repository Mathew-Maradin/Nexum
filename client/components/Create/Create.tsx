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
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import JSZip from "jszip";
import ABIObject from "../../contract.json";
import { utils } from "ethers";
import { useUploadFile } from "react-firebase-hooks/storage";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import {
  arrayUnion,
  doc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
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
import { useContext, useState } from "react";
import { FirebaseContext } from "@/pages/_app";
import { useConnectedMetaMask } from "metamask-react";
import { useContract } from "@/util/useContract";
import { randomUUID } from "crypto";

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
  const { account, ethereum } = useConnectedMetaMask();
  const { contract, address } = useContract();
  const { firebaseApp } = useContext(FirebaseContext);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [uploadFile] = useUploadFile();
  const storage = getStorage(firebaseApp);
  const db = getFirestore(firebaseApp);

  const closeAndReset = () => {
    setIsCreateSidepanelVisible(false);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // first ZIP all of the files and then upload them to jackal
      const zip = new JSZip();
      data.files.forEach((file: File) =>
        zip.file(file.webkitRelativePath || file.name, file, { binary: true })
      );
      const zippedBlob = await zip.generateAsync({ type: "blob" });
      const jackalFormData = new FormData();
      jackalFormData.append("file", zippedBlob, `${data.name}-${Date()}.zip`);
      const jackalResponse = await fetch("http://localhost:2929/upload", {
        method: "POST",
        body: jackalFormData,
        redirect: "follow",
      });

      const { fid } = (await jackalResponse.json()) || {};

      if (fid) {
        // create smart contract
        const txnDetails = {
          to: address,
          from: account,
          data: contract.methods
            .createDataSet(
              account,
              data.name,
              fid,
              data.description,
              utils.parseUnits(data.price.toString(), "ether")
            )
            .encodeABI(),
        };

        // buy
        // const txnDetails = {
        //   to: address,
        //   from: account,
        //   value: utils.parseUnits(data.price.toString(), "ether").toHexString(),
        //   data: contract.methods.buyDataSet(0).encodeABI(),
        // };

        const response = await ethereum.request({
          method: "eth_sendTransaction",
          params: [txnDetails],
        });

        // create firestore document for the contract
        const thumbnailFiles = data.files.slice(0, 4);

        const fireStoreDoc = doc(db, "datasets", fid);
        setDoc(fireStoreDoc, {
          thumbnailUrls: [],
          fid,
          numImages: data.files.length,
        });

        // // then upload thumbnails and set under contract ID in firestore
        thumbnailFiles.forEach(async (file: File) => {
          const fileRef = ref(storage, `${fid}/${file.name}`);
          const result = await uploadFile(fileRef, file, {
            contentType: file.type,
          });
          const downloadUrl = await getDownloadURL(result.ref);
          updateDoc(doc(db, "datasets", fid), {
            thumbnailUrls: arrayUnion(downloadUrl),
          });
        });
      }

      setIsSubmitting(false);
    } catch {
      setIsSubmitting(false);
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
              text={isSubmitting ? "Creating Dataset..." : "Publish Dataset"}
              disabled={isSubmitting}
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
