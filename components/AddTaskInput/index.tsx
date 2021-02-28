import PrimaryButton from 'components/Button/PrimaryButton';
import SecondaryButton from 'components/Button/SecondaryButton';
import TextInput from 'components/TextInput';
import { memo, useCallback, useState } from 'react';

interface Props {
  onSubmit?: (txt: string) => void;
}

function AddTaskInput({ onSubmit }: Props) {
  const [value, setValue] = useState('');
  const [editMode, setEditMode] = useState(false);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  function onSave(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (typeof onSubmit === 'function') {
      onSubmit(value);
    }
    setValue('');
    setEditMode(false);
  }

  if (!editMode) {
    return (
      <div>
        <PrimaryButton type="button" onClick={() => setEditMode(true)}>
          Add task
        </PrimaryButton>
      </div>
    );
  }

  return (
    <form onSubmit={onSave}>
      <TextInput
        autoFocus
        value={value}
        onChange={onChange}
        className="w-full"
        placeholder="Task name"
      />
      <div className="flex items-center justify-end -mx-1 mt-2">
        <div className="px-1">
          <PrimaryButton type="submit">Save</PrimaryButton>
        </div>
        <div className="px-1">
          <SecondaryButton type="button" onClick={() => setEditMode(false)}>
            Cancel
          </SecondaryButton>
        </div>
      </div>
    </form>
  );
}

export default memo(AddTaskInput);
