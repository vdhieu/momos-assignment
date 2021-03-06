import { useCallback } from 'react';
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
  DropResult,
} from 'react-beautiful-dnd';
import LoadingIndicator from 'components/LoadingIndicator';
import { useTasksContext } from 'context/TasksContext';
import DraggableTaskColumn from 'components/Board/DraggableTaskColumn';
import AddTaskGroupInput from 'components/AddTaskGroupInput';

export default function IndexPage() {
  const {
    initializing,
    data,
    changeTaskGroupOrder,
    changeTaskOrder,
    addTaskToGroup,
    addNewTaskGroup,
  } = useTasksContext();

  const onDragEnd = useCallback((result: DropResult) => {
    const { type, draggableId, destination: dest, source: src } = result;
    if (!dest) {
      return;
    }

    if (type === 'COLUMN') {
      changeTaskGroupOrder(draggableId, src.index, dest.index);
      return;
    }

    changeTaskOrder({
      srcId: src.droppableId,
      destId: dest.droppableId,
      taskId: draggableId,
      destIdx: dest.index,
      srcIdx: src.index,
    });
  }, []);

  const onAddTask = useCallback(
    (id: string, txt: string) => {
      addTaskToGroup(id, txt);
    },
    [addTaskToGroup],
  );

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
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="tasks-board"
          type="COLUMN"
          direction="horizontal"
          ignoreContainerClipping
          isCombineEnabled
        >
          {(provided: DroppableProvided) => (
            <div
              ref={provided.innerRef}
              className="flex overflow-scroll flex-nowrap -mx-2 mt-4 select-none"
              {...provided.droppableProps}
            >
              {data.map((taskGroup, index) => (
                <DraggableTaskColumn
                  key={taskGroup.id}
                  id={taskGroup.id}
                  title={taskGroup.name}
                  index={index}
                  tasks={taskGroup.tasks}
                  onAddTask={onAddTask}
                />
              ))}
              {provided.placeholder}
              <div className="w-1/4 px-2">
                <AddTaskGroupInput onSubmit={addNewTaskGroup} />
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
