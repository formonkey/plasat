import React, { memo } from "react";

export type TooltipProps = {
  children: React.ReactNode;
  text?: string;
  content?: React.ReactNode;
};

export const Tooltip: React.FC<TooltipProps> = memo((props) => {
  return (
    <span className="group relative z-1">
      <span className="pointer-events-none absolute
        -top-24 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-50 px-2 py-1 text-gray-800 opacity-0 transition
        before:absolute before:left-1/2 before:top-full before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-slate-50 before:content-['']
        group-hover:opacity-100 z-[999]">
        {props.text}
        {props.content}
      </span>

      {props.children}
    </span>
  );
});

Tooltip.displayName = "Tooltip";
