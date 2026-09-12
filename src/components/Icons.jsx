export function Volume2() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>; }
export function VolumeX() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5L6 9H2v6h4l5 4V5zM22 9l-6 6M16 9l6 6" /></svg>; }
export function ArrowUpRight() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>; }
export function ArrowDown() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6" /></svg>; }
export function Moon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.3A8 8 0 0 1 9.7 3.5 8.5 8.5 0 1 0 20.5 14.3Z" /></svg>; }
export function Sun() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v2m0 14v2M3 12h2m14 0h2m-2.6-6.4-1.4 1.4M6.4 17.6 5 19m0-14 1.4 1.4m11.2 11.2 1.4 1.4M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>; }
export function Github() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 22v-3.5c0-1 .2-1.7.7-2.1 2.3-.3 4.8-1.1 4.8-5.2 0-1.2-.4-2.2-1.1-3 .1-.3.5-1.5-.1-3.1 0 0-1-.3-3.2 1.1a11 11 0 0 0-5.8 0C8 4.8 7 5.1 7 5.1c-.6 1.6-.2 2.8-.1 3.1-.7.8-1.1 1.8-1.1 3 0 4.1 2.5 4.9 4.8 5.2.5.4.7 1.1.7 2.1V22M9 19c-3 .9-3.5-1.4-3.5-1.4-.5-1.2-1.2-1.5-1.2-1.5-.9-.6.1-.6.1-.6 1 0 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 1" /></svg>; }
export function Linkedin() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9v10M6 5v.01M10 19v-6a4 4 0 0 1 8 0v6m-8-5v-5m0 5a4 4 0 0 1 4-4" /></svg>; }
export function Mail() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM4 7l8 6 8-6" /></svg>; }
export function PortfolioMark(props) {
  return (
    <img
      src="/logo/portfolio-logo.png"
      alt="Aravind Bala Logo"
      className="brand-logo"
      style={{ objectFit: 'contain', display: 'block' }}
      {...props}
    />
  );
}
