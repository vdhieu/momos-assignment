import { Task } from 'context/TasksContext';
import { memo, useCallback } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import DroppableTaskZone from './DroppableTaskZone';
import classnames from 'classnames';
import AddTaskInput from 'components/AddTaskInput';

interface Props {
  title: string;
  id: string;
  index: number;
  tasks: Task[];
  onAddTask?: (id: string, txt: string) => void;
}

function DraggableTaskColumn({ title, id, index, tasks, onAddTask }: Props) {
  const onSubmitNewTask = useCallback(
    (txt: string) => {
      if (typeof onAddTask === 'function') {
        onAddTask(id, txt);
      }
    },
    [id, onAddTask],
  );

  return (
    <Draggable key={id} draggableId={id} index={index}>
      {(provider, snapshot) => (
        <div
          ref={provider.innerRef}
          className="w-1/4 px-2"
          {...provider.draggableProps}
        >
          <div
            className={classnames('bg-gray-200 rounded flex flex-col p-2', {
              'shadow-md': snapshot.isDragging,
            })}
          >
            <h1 {...provider.dragHandleProps}>{title}</h1>
            <DroppableTaskZone droppableId={id} tasks={tasks} />
            <AddTaskInput onSubmit={onSubmitNewTask} />
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default memo(DraggableTaskColumn);
