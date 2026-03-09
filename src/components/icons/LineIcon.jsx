export function LineIconActive() {
  return (
    <div className="w-8 h-8 rounded-full bg-[#06C755] flex items-center justify-center">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C6.477 2 2 6.065 2 11.1c0 2.647 1.168 5.023 3.04 6.727.126.112.204.27.204.44 0 .09-.013.178-.04.263l-.394 1.475c-.11.412.192.812.618.812.09 0 .18-.02.264-.06l1.74-.812a.82.82 0 01.364-.086c.09 0 .18.013.266.038C8.825 20.226 10.385 20.5 12 20.5c5.523 0 10-4.065 10-9.1S17.523 2 12 2z"/>
      </svg>
    </div>
  );
}

export function LineIconInactive() {
  return (
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#9ca3af">
        <path d="M12 2C6.477 2 2 6.065 2 11.1c0 2.647 1.168 5.023 3.04 6.727.126.112.204.27.204.44 0 .09-.013.178-.04.263l-.394 1.475c-.11.412.192.812.618.812.09 0 .18-.02.264-.06l1.74-.812a.82.82 0 01.364-.086c.09 0 .18.013.266.038C8.825 20.226 10.385 20.5 12 20.5c5.523 0 10-4.065 10-9.1S17.523 2 12 2z"/>
      </svg>
    </div>
  );
}

export function LinkIcon({ color = '#06C755' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
    </svg>
  );
}

export function BrokenLinkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
      <line x1="2" y1="2" x2="22" y2="22"/>
    </svg>
  );
}
