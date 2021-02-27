import type { AppProps } from 'next/app';
import 'tailwindcss/tailwind.css';
import { TasksContextProvider } from '../context/TasksContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TasksContextProvider>
      <Component {...pageProps} />
    </TasksContextProvider>
  );
}

export default MyApp;
