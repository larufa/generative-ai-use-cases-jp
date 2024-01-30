import React, { useEffect, useRef, useState } from 'react';
import RowItem, { RowItemProps } from './RowItem';
import Help from './Help';

type Props = RowItemProps & {
  value?: string;
  label?: string;
  placeholder?: string;
  hint?: string;
  help?: string;
  imageInput?: boolean;
  optional?: boolean;
  noBorder?: boolean;
  rows?: number;
  maxHeight?: number;
  onEnter?: () => void;
  onChange: (value: string) => void;
  onImageChange: (value: File | null) => void;
};

const MAX_HEIGHT = 300;

const Textarea: React.FC<Props> = (props) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [isMax, setIsMax] = useState(false);
  const _maxHeight = props.maxHeight || MAX_HEIGHT;

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.style.height = 'auto';

    if (_maxHeight > 0 && ref.current.scrollHeight > _maxHeight) {
      ref.current.style.height = _maxHeight + 'px';
      setIsMax(true);
    } else {
      ref.current.style.height = ref.current.scrollHeight + 'px';
      setIsMax(false);
    }
  }, [props.value, _maxHeight]);

  useEffect(() => {
    const current = ref.current;
    if (!current) {
      return;
    }

    const listener = (e: DocumentEventMap['keypress']) => {
      if (props.onEnter) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          props.onEnter();
        }
      }
    };

    current.addEventListener('keypress', listener);

    return () => {
      if (current) {
        current.removeEventListener('keypress', listener);
      }
    };
  }, [ref, props]);

  return (
    <RowItem notItem={props.notItem}>
      {props.label && (
        <div className="flex items-center">
          <span className="text-sm">{props.label}</span>
          {props.help && <Help className="ml-1" message={props.help} />}
          {props.optional && (
            <span className="ml-2 text-xs italic text-gray-500">
              - Optional
            </span>
          )}
        </div>
      )}
      <textarea
        ref={ref}
        className={`${
          props.className ?? ''
        } w-full resize-none rounded p-1.5 outline-none ${
          isMax ? 'overflow-y-auto' : 'overflow-hidden'
        } ${
          props.noBorder ? 'border-0 focus:ring-0 ' : 'border border-black/30'
        } `}
        rows={props.rows ?? 1}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
      />
      {props.imageInput && (
        <input
          className="absolute top-3 right-0 text-sm"
          type="file"
          accept="image/png, image/gif, image/jpeg"
          onChange={(e) => {
            props.onImageChange(e.target.files && e.target.files[0])
          }}
        />
      )}
      {props.hint && (
        <div className="-mt-0.5 text-xs text-gray-400">{props.hint}</div>
      )}
    </RowItem>
  );
};

export default Textarea;
