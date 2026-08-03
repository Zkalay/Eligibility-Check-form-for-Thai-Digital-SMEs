export function smoothScrollToTop(duration: number = 850): Promise<void> {
  return new Promise((resolve) => {
    const startY = window.scrollY || window.pageYOffset;
    if (startY < 5) {
      window.scrollTo(0, 0);
      resolve();
      return;
    }
    const startTime = performance.now();

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Gentle easeInOutCubic curve for smooth slow ease
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startY * (1 - ease));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(step);
  });
}

export function smoothScrollBy(distance: number, duration: number = 750): Promise<void> {
  return new Promise((resolve) => {
    const startY = window.scrollY || window.pageYOffset;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const targetY = Math.min(startY + distance, maxScroll);
    const actualDistance = targetY - startY;

    if (Math.abs(actualDistance) < 5) {
      resolve();
      return;
    }

    const startTime = performance.now();

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startY + actualDistance * ease);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(step);
  });
}
