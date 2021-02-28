import classnames from 'classnames';
import { memo } from 'react';

interface Props extends React.HTMLProps<HTMLInputElement> {}

function TextInput({ className, ...props }: Props) {
  return (
    <input
      className={classnames(
        'py-2 px-2 rounded outline-none focus:ring-1 focus:ring-purple-500',
        className,
      )}
      {...props}
    />
  );
}

export default memo(TextInput);
