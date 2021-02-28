import { useCallback } from 'react';
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DropResult,
} from 'react-beautiful-dnd';
import LoadingIndicator from 'components/LoadingIndicator';
import { useTasksContext } from 'context/TasksContext';

export default function IndexPage() {
  const {
    initializing,
    data,
    changeTaskGroupOrder,
    changeTaskOrder,
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
                <Draggable
                  key={taskGroup.id}
                  draggableId={taskGroup.id}
                  index={index}
                >
                  {(columnProvider) => (
                    <div
                      key={taskGroup.id}
                      ref={columnProvider.innerRef}
                      className="w-1/4 px-2"
                      {...columnProvider.draggableProps}
                    >
                      <div className="bg-gray-200 rounded flex flex-col p-2">
                        <h1 {...columnProvider.dragHandleProps}>
                          {taskGroup.name}
                        </h1>
                        <Droppable droppableId={`${taskGroup.id}`} type="ITEM">
                          {(taskDroppableProvided) => (
                            <div
                              ref={taskDroppableProvided.innerRef}
                              {...taskDroppableProvided.droppableProps}
                              className="relative"
                            >
                              {taskGroup.tasks.map((task, idx) => (
                                <Draggable
                                  key={task.id}
                                  draggableId={task.id}
                                  index={idx}
                                >
                                  {(
                                    taskDraggableProvided: DraggableProvided,
                                  ) => (
                                    <div
                                      ref={taskDraggableProvided.innerRef}
                                      className="my-2 bg-white p-4 rounded"
                                      {...taskDraggableProvided.draggableProps}
                                      {...taskDraggableProvided.dragHandleProps}
                                    >
                                      <p className="text-xs text-gray-500">
                                        ID: {task.id}
                                      </p>
                                      <h4>{task.name}</h4>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {taskDroppableProvided.placeholder}
                              <button>Add new task</button>
                            </div>
                          )}
                        </Droppable>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <div className="w-1/4 px-2">
                <button>Add new column</button>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
