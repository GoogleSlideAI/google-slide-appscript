import React from 'react';
import { ExtraProps } from 'react-markdown';
import { toText } from 'hast-util-to-text';
import CopyButton from '../../copy-button';


type CodeProps = React.HTMLAttributes<HTMLElement> & ExtraProps;

const CODE_BLOCK_REGEX = /language-(\w+)/;

const Code = (props: CodeProps) => {
  const { node, className, ...restProps } = props;
  const isCodeBlock = CODE_BLOCK_REGEX.exec(className || '');

  return isCodeBlock ? (
    <div className="group relative my-2 max-w-full overflow-x-auto rounded-md bg-[#f6f8fa]">
      <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100">
        {node && <CopyButton text={toText(node, { whitespace: 'pre-wrap' })} />}
      </div>
      <code className={className} {...restProps} />
    </div>
  ) : (
    <span className="inline-block py-0.5">
      <span className="rounded-md bg-[#f3f3f3] px-1">
        <code className={className} {...restProps} />
      </span>
    </span>
  );
};

export default Code;
