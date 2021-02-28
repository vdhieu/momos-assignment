import { Task } from 'context/TasksContext';
import { memo } from 'react';
import { Draggable } from 'react-beautiful-dnd';

interface Props {
  task: Task;
  index: number;
}

function DraggableTaskItem({ task, index }: Props) {
  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          className="my-2 bg-white p-4 rounded"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <p className="text-xs text-gray-500">ID: {task.id}</p>
          <h4>{task.name}</h4>
        </div>
      )}
    </Draggable>
  );
}

export default memo(DraggableTaskItem);
