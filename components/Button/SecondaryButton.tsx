import classnames from 'classnames';
import { memo } from 'react';

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}

function PrimaryButton({ className, children, ...props }: Props) {
  return (
    <button
      className={classnames(
        'py-1 px-2 text-white rounded bg-gray-500 hover:bg-gray-400 outline-none focus:outline-none focus:ring-1 focus:ring-gray-400',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default memo(PrimaryButton);
