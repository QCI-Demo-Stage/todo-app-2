import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((node) => !node.hasAttribute("disabled") && !node.hidden);
}

/**
 * Focus trap, Escape-to-close, and focus restoration for modal dialogs.
 */
function useDialogFocusTrap(
  isActive: boolean,
  onClose: () => void,
): RefObject<HTMLDivElement | null> {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    previousActiveRef.current = document.activeElement as HTMLElement | null;

    const focusables = getFocusableElements(container);
    if (focusables.length > 0) {
      focusables[0].focus();
    }

    const onDocumentKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onCloseRef.current();
      }
    };

    const onContainerKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const elements = getFocusableElements(container);
      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onDocumentKeyDown, true);
    container.addEventListener("keydown", onContainerKeyDown);

    return () => {
      document.removeEventListener("keydown", onDocumentKeyDown, true);
      container.removeEventListener("keydown", onContainerKeyDown);
      previousActiveRef.current?.focus?.();
    };
  }, [isActive]);

  return containerRef;
}

export default useDialogFocusTrap;
