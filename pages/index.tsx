import Link from "next/link";
import Head from "next/head";

import styles from "../styles/Home.module.css";

const Home = () => (
  <div className={styles.container}>
    <Head>
      <title>Create Next App</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className={styles.main}>
      <h1>
        Welcome to <strong>Resolutions for 2021</strong>
      </h1>

      <div className={styles.grid}>
        <Link href="/form">
          <h3 className={styles.card}>Get started &rarr;</h3>
        </Link>
      </div>
    </main>

    <footer className={styles.footer}>
      <a
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by{" "}
        <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
      </a>
    </footer>
  </div>
);

export default Home;
