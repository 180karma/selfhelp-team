import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22c-5 0-9-4.5-9-10 0-5.5 4-10 9-10s9 4.5 9 10c0 5.5-4 10-9 10Z" />
      <path d="M12 15a6 6 0 0 0-6-6h.1a1 1 0 0 1 1-1.1C8.3 6.9 10 6 12 6c3.9 0 7 3.1 7 7a4 4 0 0 1-4 4" />
      <path d="M12 8a3 3 0 0 0-3 3" />
    </svg>
  );
}
