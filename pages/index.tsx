import LoadingIndicator from '../components/LoadingIndicator';
import { useTasksContext } from '../context/TasksContext';

export default function IndexPage() {
  const { initializing, data } = useTasksContext();

  if (initializing) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoadingIndicator className="h-10 w-10" />
      </div>
    );
  }
  return (
    <div className="w-full p-4">
      <h1 className="text-5xl text-purple-500 text-center">Tasks</h1>
      <code>{JSON.stringify(data)}</code>
    </div>
  );
}
