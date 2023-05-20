import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Nexum</title>
        <meta
          name="description"
          content="Get exclusive private AI training datasets"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main></main>
    </>
  );
}

export const getStaticProps = () => ({
  props: {
    isAuthenticated: true,
  },
});
