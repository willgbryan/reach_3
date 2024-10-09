import { useEffect } from 'react';

export const useExternalLinks = (containerRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateLinks = () => {
      const links = container.querySelectorAll('a');

      links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        let url;
        try {
          url = new URL(href, window.location.origin);
        } catch (e) {
          console.error('Invalid URL:', href);
          return;
        }

        if (url.hostname !== window.location.hostname) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      });
    };

    updateLinks();

    const observer = new MutationObserver(() => {
      updateLinks();
    });

    observer.observe(container, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [containerRef.current]);
};
