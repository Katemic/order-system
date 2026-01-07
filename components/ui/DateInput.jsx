"use client";

import { useRef } from "react";

export default function DateInput({
  value,
  onCommit,
  className,
  prefix = "",
}) {
  const typedRef = useRef(false);

  return (
    <input
      type="date"
      key={`${prefix}-${value || "empty"}`}
      defaultValue={value}
      className={className}

      onKeyDown={(e) => {
        typedRef.current = true;

        if (e.key === "Enter") {
          onCommit(e.target.value || null);
          e.target.blur(); 
        }
      }}

      onChange={(e) => {
        const v = e.target.value;

        // If user typed, DO NOT commit (prevents 0002 bug)
        if (typedRef.current) return;

        // If user picked date from datepicker (valid date)
        if (v && v.length === 10) {
          onCommit(v);
        }
      }}

      onBlur={(e) => {
        // If blur came after typing
        if (typedRef.current) {
          typedRef.current = false;

          if (e.target.value && e.target.value.length === 10) {
            onCommit(e.target.value);
          }
        }
      }}
    />
  );
}