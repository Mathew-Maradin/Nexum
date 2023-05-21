import { Layout } from "@/components/Layout/Layout";
import { useContract } from "@/util/useContract";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import { Box, Flex, Text } from "gestalt";
import { useContext, useState, useEffect } from "react";
import { FirebaseContext } from "./_app";
import { DatasetCard } from "@/components/DatasetCard/DatasetCard";
import { useConnectedMetaMask } from "metamask-react";

const Purchases = () => {
  const { contract } = useContract();
  const { firebaseApp } = useContext(FirebaseContext);
  const { account } = useConnectedMetaMask();
  const db = getFirestore(firebaseApp);

  const [dataSets, setDataSets] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    const fetchAllDataSets = async () => {
      const allOnChainDatasetsPromise = contract.methods
        .getAllDataSets()
        .call();
      const allFirebaseDatasetsPromise = getDocs(collection(db, "datasets"));

      const [allOnChainDatasets, allFirebaseDatasets] = await Promise.all([
        allOnChainDatasetsPromise,
        allFirebaseDatasetsPromise,
      ]);

      const finalFBDatasets: Record<string, unknown> = {};
      allFirebaseDatasets.forEach((doc) => {
        finalFBDatasets[doc.id] = {
          fid: doc.id,
          ...doc.data(),
        };
      });

      // merge the two arrays
      const finalDataset = allOnChainDatasets.map((dataset, idx) => {
        const fid = dataset[2];
        const firebaseDoc = finalFBDatasets?.[fid] || {};
        return {
          index: idx,
          owner: dataset[0],
          name: dataset[1],
          fid,
          description: dataset[3],
          cost: dataset[4],
          authorizedUsers: dataset[5],
          ...firebaseDoc,
        };
      });

      setDataSets(finalDataset);
    };

    fetchAllDataSets();
  }, [contract]);

  const doesAuthorizedUsersIncludeUser = (authorizedUsers) => {
    return Boolean(
      authorizedUsers.filter(
        (user) => user.toLowerCase() === account.toLowerCase()
      )?.length
    );
  };

  return (
    <Layout>
      <Box marginBottom={6}>
        <Text weight="bold" size="500">
          Your Purchases
        </Text>
      </Box>

      <Flex gap={{ row: 8, column: 8 }}>
        {dataSets
          ?.filter(({ authorizedUsers }) => {
            return doesAuthorizedUsersIncludeUser(authorizedUsers);
          })
          .map(
            (
              {
                authorizedUsers,
                index,
                owner,
                name,
                numImages,
                description,
                cost,
                thumbnailUrls,
                fid,
              },
              idx
            ) => (
              <DatasetCard
                key={idx}
                name={name}
                numImages={numImages}
                description={description}
                cost={cost}
                thumnbnailUrls={thumbnailUrls}
                owner={owner}
                index={index}
                authorizedUsers={authorizedUsers}
                fid={fid}
              />
            )
          )}
      </Flex>
    </Layout>
  );
};

export default Purchases;

export const getStaticProps = () => {
  return {
    props: {
      isAuthenticated: true,
    },
  };
};
