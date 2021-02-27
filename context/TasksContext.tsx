import { nanoid } from 'nanoid';
import React, { useCallback, useEffect, useState } from 'react';

interface Task {
  id: string;
  name: string;
}

interface TaskGroup {
  id: string;
  name: string;
  tasks: Task[];
}

interface ContextType {
  initializing: boolean;
  data: TaskGroup[];
  addNewTaskGroup: (name: string) => void;
  addTaskToGroup: (groupId: string, taskName: string) => void;
}

const STORAGE_KEY = 'TASK_APP_DATA';
const Context = React.createContext<ContextType | undefined>(undefined);

export const TasksContextProvider: React.FC = ({ children }) => {
  const [initializing, setInitializing] = useState(true);
  const [data, setData] = useState<TaskGroup[]>([
    {
      id: nanoid(),
      name: 'Initial column',
      tasks: [],
    },
  ]);

  // restore data on first load
  useEffect(() => {
    try {
      setInitializing(true);
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (!rawData) {
        return;
      }
      const parsedData = JSON.parse(rawData);
      setData(parsedData as TaskGroup[]);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setInitializing(false);
      }, 1500);
    }
  }, []);

  // save on data changed
  useEffect(() => {
    if (!initializing) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [initializing, data]);

  const addNewTaskGroup = useCallback((name: string) => {
    setData((pre) => [...pre, { id: nanoid(), name, tasks: [] }]);
  }, []);

  const addTaskToGroup = useCallback((groupId: string, taskName: string) => {
    setData((pre) =>
      pre.map((taskGroup) =>
        taskGroup.id === groupId
          ? {
              ...taskGroup,
              tasks: [...taskGroup.tasks, { name: taskName, id: nanoid() }],
            }
          : taskGroup,
      ),
    );
  }, []);

  return (
    <Context.Provider
      value={{
        initializing,
        data,
        addNewTaskGroup,
        addTaskToGroup,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export function useTasksContext() {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error(
      'useTasksContext must be inside a TasksContextProvider with a value',
    );
  }

  return context;
}
