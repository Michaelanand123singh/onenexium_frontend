// SVG icon components for the auth pages

export function BoltIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M0 256L28.5 28c2-16 15.6-28 31.8-28L228.9 0c15 0 27.1 12.1 27.1 27.1 0 3.2-.6 6.5-1.7 9.5L208 160 347.3 160c20.2 0 36.7 16.4 36.7 36.7 0 7.4-2.2 14.6-6.4 20.7l-192.2 281c-5.9 8.6-15.6 13.7-25.9 13.7l-2.9 0c-15.7 0-28.5-12.8-28.5-28.5 0-2.3 .3-4.6 .9-6.9L176 288 32 288c-17.7 0-32-14.3-32-32z" />
    </svg>
  );
}

export function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width="16"
      height="16"
      fill="currentColor"
      className="text-white/60"
    >
      <path d="M500 261.8C500 403.3 403.1 504 260 504 122.8 504 12 393.2 12 256S122.8 8 260 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9c-88.3-85.2-252.5-21.2-252.5 118.2 0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9l-140.8 0 0-85.3 236.1 0c2.3 12.7 3.9 24.9 3.9 41.4z" />
    </svg>
  );
}

export function MicrosoftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 448"
      width="16"
      height="16"
    >
      <rect x="0" y="0" width="208" height="208" fill="rgba(255,255,255,0.4)" />
      <rect x="240" y="0" width="208" height="208" fill="rgba(255,255,255,0.5)" />
      <rect x="0" y="240" width="208" height="208" fill="rgba(255,255,255,0.5)" />
      <rect x="240" y="240" width="208" height="208" fill="rgba(255,255,255,0.4)" />
    </svg>
  );
}
