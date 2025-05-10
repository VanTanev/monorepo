"use client";

import { useState } from "react";

export function Button() {
  const [count, setCount] = useState(0);

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
