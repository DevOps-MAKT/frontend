import React from 'react';

export const Logo = () => (
  <svg
    fill="none"
    width={24}
    height={24}
    viewBox="0 0 64 64"
    strokeWidth={1.5}
    stroke="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <rect width="64" height="64" rx="10" ry="10" fill="#FFB100" />
      <g transform="translate(10, 10)">
        <circle cx="22" cy="22" r="22" fill="#FFB100" />
        <circle cx="22" cy="22" r="18" fill="#FFFFFF" />
        <circle cx="18" cy="18" r="3" fill="#000000" />
        <circle cx="26" cy="18" r="3" fill="#000000" />
        <circle cx="18" cy="18" r="1.5" fill="#FFFFFF" />
        <circle cx="26" cy="18" r="1.5" fill="#FFFFFF" />
        <path
          d="M16 28 C16 25, 28 25, 28 28"
          stroke="#000000"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="22" cy="22" r="2" fill="#000000" />
      </g>
      <path
        d="M45 10 C43 8, 43 6, 45 4"
        fill="#FFB100"
      />
    </g>
  </svg>
);

