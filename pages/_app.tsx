import { AppProps } from 'next/app';
import Head from 'next/head';
import 'tailwindcss/tailwind.css';
import { TasksContextProvider } from '../context/TasksContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Tasks app</title>
      </Head>
      <TasksContextProvider>
        <Component {...pageProps} />
      </TasksContextProvider>
    </>
  );
}

export default MyApp;
