import { Box, Collage, Image, Mask, Text } from "gestalt";

export const DatasetCard = ({ name, thumnbnailUrls }) => {
  return (
    <Box rounding={3} overflow="hidden">
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
      <Text>{name}</Text>
    </Box>
  );
};
