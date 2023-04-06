import Head from "next/head";
import AuthForm from "@/components/authForm";

export default function Home() {
  return (
    <>
      <Head>
        <title>Smart-Id Authentication</title>
        <meta name="description" content="Authentication with Smart-Id Test" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <AuthForm />
      </div>
    </>
  );
}
