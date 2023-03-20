import * as React from 'react';

export const CalendarToday = ({color = '#D9D9D9'}: { color?: string }) => (
    <svg
        width={20}
        height={20}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M13.334 2.5v3.333M6.667 2.5v3.333M3.334 9.167h13.333M5 4.167h10c.92 0 1.667.746 1.667 1.666v10c0 .92-.746 1.667-1.667 1.667H5c-.92 0-1.667-.746-1.667-1.667v-10c0-.92.747-1.666 1.667-1.666ZM6.667 12.5h1.667v1.667H6.667V12.5Z"
            stroke={color}
            strokeWidth={1.667}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

