import { Task } from 'context/TasksContext';
import { memo } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import DraggableTaskItem from './DraggableTaskItem';

interface Props {
  droppableId: string;
  tasks: Task[];
}

function DroppableTaskZone({ droppableId, tasks }: Props) {
  return (
    <Droppable droppableId={droppableId} type="ITEM">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{ minHeight: 32 }}
        >
          {tasks.map((task, idx) => (
            <DraggableTaskItem key={task.id} task={task} index={idx} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default memo(DroppableTaskZone);
