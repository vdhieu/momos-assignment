import { nanoid } from 'nanoid';
import React, { useCallback, useEffect, useState } from 'react';

export interface Task {
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
  changeTaskGroupOrder: (id: string, srcIdx: number, destIdx: number) => void;
  changeTaskOrder: (params: {
    srcId: string;
    destId: string;
    taskId: string;
    srcIdx: number;
    destIdx: number;
  }) => void;
}

const STORAGE_KEY = 'TASK_APP_DATA';
const Context = React.createContext<ContextType | undefined>(undefined);

const ID_LENGTH = 7;

const fakeData = [
  {
    id: nanoid(ID_LENGTH),
    name: 'Column 1',
    tasks: [
      {
        id: nanoid(ID_LENGTH),
        name: 'Hello world',
      },
      {
        id: nanoid(ID_LENGTH),
        name: 'Hi this is a task',
      },
    ],
  },
  {
    id: nanoid(ID_LENGTH),
    name: 'Column 2',
    tasks: [
      {
        id: nanoid(ID_LENGTH),
        name: 'Hello world 2',
      },
      {
        id: nanoid(ID_LENGTH),
        name: 'Hi this is a task 2',
      },
    ],
  },
  {
    id: nanoid(ID_LENGTH),
    name: 'Column 3',
    tasks: [
      {
        id: nanoid(ID_LENGTH),
        name: 'Hello world 3',
      },
      {
        id: nanoid(ID_LENGTH),
        name: 'Hi this is a task 3',
      },
    ],
  },
];

export const TasksContextProvider: React.FC = ({ children }) => {
  const [initializing, setInitializing] = useState(true);
  const [data, setData] = useState<TaskGroup[]>(fakeData);

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
    setData((pre) => [...pre, { id: nanoid(ID_LENGTH), name, tasks: [] }]);
  }, []);

  const changeTaskGroupOrder = useCallback(
    (id: string, srcIdx: number, destIdx: number) => {
      if (srcIdx === destIdx) {
        return;
      }

      setData((pre) => {
        const tskg = pre.find((tskg) => tskg.id === id);
        if (!tskg) {
          return pre;
        }

        const pos = destIdx > srcIdx ? destIdx + 1 : destIdx;
        const head = pre.slice(0, pos);
        const tail = pre.slice(pos);

        return [
          ...head.filter((tsk) => tsk.id !== id),
          tskg,
          ...tail.filter((tsk) => tsk.id !== id),
        ];
      });
    },
    [],
  );

  const changeTaskOrder = useCallback(
    (params: {
      srcId: string;
      destId: string;
      taskId: string;
      destIdx: number;
      srcIdx: number;
    }) => {
      const { srcId, destId, taskId, destIdx, srcIdx } = params;
      // order in same group
      if (srcId === destId) {
        if (destIdx === srcIdx) {
          return;
        }

        setData((pre) =>
          pre.map((tskg) => {
            if (tskg.id !== srcId) {
              return tskg;
            }

            const task = tskg.tasks.find((tsk) => tsk.id === taskId);
            if (!task) {
              return tskg;
            }

            const pos = destIdx > srcIdx ? destIdx + 1 : destIdx;
            const head = tskg.tasks.slice(0, pos);
            const tail = tskg.tasks.slice(pos);

            return {
              ...tskg,
              tasks: [
                ...head.filter((tsk) => tsk.id !== taskId),
                task,
                ...tail.filter((tsk) => tsk.id !== taskId),
              ],
            };
          }),
        );
        return;
      }

      setData((pre) => {
        const srcGroup = pre.find((tskg) => tskg.id === srcId);
        if (!srcGroup) {
          return pre;
        }
        const task = srcGroup.tasks.find((tsk) => tsk.id === taskId);
        if (!task) {
          return pre;
        }

        return pre.map(({ id, tasks, name }) => {
          // remove task from source
          if (id === srcId) {
            return {
              id,
              tasks: tasks.filter((tsk) => tsk.id !== taskId),
              name,
            };
          }
          // add task to destination
          if (id === destId) {
            const head = tasks.slice(0, destIdx);
            const tail = tasks.slice(destIdx);
            return {
              id,
              tasks: [...head, task, ...tail],
              name,
            };
          }

          return {
            id,
            tasks,
            name,
          };
        });
      });
    },
    [],
  );

  const addTaskToGroup = useCallback((groupId: string, taskName: string) => {
    setData((pre) =>
      pre.map((taskGroup) =>
        taskGroup.id === groupId
          ? {
              ...taskGroup,
              tasks: [
                ...taskGroup.tasks,
                { name: taskName, id: nanoid(ID_LENGTH) },
              ],
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
        changeTaskGroupOrder,
        changeTaskOrder,
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
