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
import { Controller, useForm } from "react-hook-form";

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
    },
  });

  const closeAndReset = () => {
    setIsCreateSidepanelVisible(false);
  };

  return (
    <Layer zIndex={zIndex}>
      <OverlayPanel
        accessibilityLabel="create dataset"
        onDismiss={closeAndReset}
        closeOnOutsideClick={false}
        dismissConfirmation={{}}
        footer={
          <Flex justifyContent="end">
            <Button text="Publish Dataset" color="blue" />
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
        </Flex>
      </OverlayPanel>
    </Layer>
  );
};
