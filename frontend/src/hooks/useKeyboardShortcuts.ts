import { useEffect } from 'react';

interface KeyBindings {
  [key: string]: (e: KeyboardEvent) => void;
}

export function useKeyboardShortcuts(bindings: KeyBindings) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = `${e.ctrlKey || e.metaKey ? 'ctrl+' : ''}${
        e.shiftKey ? 'shift+' : ''
      }${e.altKey ? 'alt+' : ''}${e.key.toLowerCase()}`;

      if (bindings[key]) {
        e.preventDefault();
        bindings[key](e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bindings]);
}
