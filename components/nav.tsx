'use client';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ComponentProps } from 'react';

// Route changes run inside a view transition where the browser has them: the
// old page is held while Next renders the new one, then they crossfade.

type Router = ReturnType<typeof useRouter>;
type VTDocument = Document & { startViewTransition?: (update: () => Promise<void>) => unknown };
type NextState = { __NA?: boolean; __PRIVATE_NEXTJS_INTERNALS_TREE?: unknown } | null;

let shown = '';                         // pathname on screen
let arrive: (() => void) | null = null;
let traversal = false;                  // the route change came from Back/Forward
let moved = false;                      // there has been an in-app navigation
let replaying = false;
let known: NextState = null;

const canAnimate = () =>
  typeof (document as VTDocument).startViewTransition === 'function' &&
  !matchMedia('(prefers-reduced-motion: reduce)').matches;

function transition(update: () => void) {
  (document as VTDocument).startViewTransition!(() => new Promise<void>(resolve => {
    arrive?.();
    arrive = resolve;
    // Don't hold the old page forever on a slow network
    setTimeout(resolve, 3000);
    update();
  }));
}

// Every page scrolls inside its own fixed container and places itself, so
// Next's window scrolling has nothing to do
export function navigate(router: Router, href: string) {
  const go = () => router.push(href, { scroll: false });
  if (new URL(href, location.href).pathname === location.pathname || !canAnimate()) go();
  else transition(go);
}

export const useNavigate = () => {
  const router = useRouter();
  return (href: string) => navigate(router, href);
};

export const isTraversal = () => traversal;
export const hasAppHistory = () => moved;

type LinkProps = Omit<ComponentProps<typeof NextLink>, 'href'> & { href: string };

// Same-page #links stay native anchors
export function Link({ href, onClick, ...rest }: LinkProps) {
  const router = useRouter();
  if (href.startsWith('#')) return <a href={href} onClick={onClick} {...rest} />;
  return (
    <NextLink
      href={href}
      onClick={e => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target) return;
        e.preventDefault();
        navigate(router, href);
      }}
      {...rest}
    />
  );
}

export function NavEvents() {
  const path = usePathname();

  useEffect(() => {
    if (shown && shown !== path) moved = true;
    shown = path;
    traversal = false;
    known = history.state ?? known;
    arrive?.();
    arrive = null;
  }, [path]);

  useEffect(() => {
    // Every view scrolls inside its own container, so there's nothing for the
    // browser to restore, and on iPhones a restored offset left the layout
    // under the toolbar after a reload
    history.scrollRestoration = 'manual';

    // Capture runs before Next's own listener, so Back/Forward to another
    // route can be held until the old page has been snapshotted
    const onPop = (e: PopStateEvent) => {
      if (replaying || location.pathname === shown) return;
      traversal = true;
      if (!e.state?.__NA || !canAnimate() || (e as PopStateEvent & { hasUAVisualTransition?: boolean }).hasUAVisualTransition) return;
      e.stopImmediatePropagation();
      const state = e.state;
      transition(() => {
        replaying = true;
        dispatchEvent(new PopStateEvent('popstate', { state }));
        replaying = false;
      });
    };
    // Next ignores Back/Forward onto entries with no state, which plain #links
    // create, so give them this page's
    const onHash = () => {
      if (history.state) { known = history.state; return; }
      if (known?.__NA) history.replaceState({ __NA: true, __PRIVATE_NEXTJS_INTERNALS_TREE: known.__PRIVATE_NEXTJS_INTERNALS_TREE }, '');
    };
    addEventListener('popstate', onPop, true);
    addEventListener('hashchange', onHash);
    return () => {
      removeEventListener('popstate', onPop, true);
      removeEventListener('hashchange', onHash);
    };
  }, []);

  return null;
}
