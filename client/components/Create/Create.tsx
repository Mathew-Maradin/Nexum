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
import { useUploadFile } from "react-firebase-hooks/storage";
import { getStorage, ref } from "firebase/storage";
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
  const { firebaseApp } = useContext(FirebaseContext);

  const [uploadFile, uploading, snapshot, error] = useUploadFile();
  const storage = getStorage(firebaseApp);

  const closeAndReset = () => {
    setIsCreateSidepanelVisible(false);
  };

  const onSubmit = (data) => {
    console.log(data);

    // create smart contract
    const TEST_CONTRACT_ID = "0xjoiwj4f3f";

    // then upload thumbnails and set under contract ID in firestore
    data.files.forEach((file: File) => {
      const fileRef = ref(storage, `${TEST_CONTRACT_ID}/${file.name}`);
    });
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
