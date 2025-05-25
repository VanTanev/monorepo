"use client";

import { useState } from "react";

export type ButtonProps = {
  initialCount?: number;
};
export function Button(props: ButtonProps) {
  const [count, setCount] = useState(props.initialCount ?? 0);

  return (
    <div>
      <p>
        Component from <code>packages/ui</code>
      </p>

      <button
        onClick={() => {
          setCount((c) => c + 1);
        }}
        type="button"
      >
        Count: {count}
      </button>
    </div>
  );
}
