import * as React from 'react';

export const Tree = ({ color = '#D9D9D9' }: { color?: string }) => (
  <svg
    width={20}
    height={20}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.5 5h9.166M7.5 10h9.166M7.5 15h9.166M4.166 5v.008m0 4.992v.008m0 4.992v.008"
      stroke={color}
      strokeWidth={1.667}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
