'use client';

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
  label: string;
}

export default function Toggle({ enabled, onToggle, label }: ToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
        enabled ? 'bg-[var(--color-accent-dark)]' : 'bg-[var(--color-border-light)]'
      }`}
      aria-label={label}
    >
      <span
        className={`absolute left-0.5 inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
