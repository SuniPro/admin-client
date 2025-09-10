/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { ReactElement, useRef } from "react";
import { Rnd } from "react-rnd";

export function DraggableNode({ children }: { children: ReactElement }) {
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <Rnd
      bounds="window"
      default={{
        x: 300,
        y: 300,
        width: 320,
        height: 200,
      }}
      enableResizing={false}
      css={css`
        display: flex;
        align-items: center;
        justify-content: center;
      `}
    >
      <div ref={nodeRef} className="inline-block">
        {children}
      </div>
    </Rnd>
  );
}
