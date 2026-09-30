// Runs before paint to avoid a theme flash
export const THEME = `(function(){try{var d=localStorage.getItem('dark');var k=d!==null?d==='true':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=k?'dark':'light'}catch(e){}})()`;

// Before paint on a full Back/Forward load; ClassicScroll saves the positions
export const SCROLL_KEY = 'classic-scroll';
export const KEEP_SCROLL = `(function(){var p=document.currentScript.parentElement;try{var n=performance.getEntriesByType('navigation')[0],y=JSON.parse(sessionStorage.getItem('${SCROLL_KEY}')||'{}')[location.pathname];if(n&&n.type==='back_forward'&&y!=null){var go=function(){p.scrollTo({top:y,behavior:'instant'})};go();if(location.hash)addEventListener('load',function(){requestAnimationFrame(go)})}}catch(e){}})()`;

export const SECTIONS = [
  { id: 'projects',   label: 'Projects',   app: 'projects' },
  { id: 'experience', label: 'Experience', app: 'experience' },
  { id: 'skills',     label: 'Skills',     app: 'skills' },
  { id: 'contact',    label: 'Contact',    app: 'contact' },
] as const;

export const PLATFORM = { web: 'Web app', mobile: 'Mobile app' } as const;

export const anchorOf = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
export const pageOf = (title: string) => `/classic/project/${encodeURIComponent(title)}`;
