'use client';

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
  label: string;
}

export default function Toggle({ enabled, onToggle, label }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C88C4A]"
      aria-label={label}
      aria-pressed={enabled}
    >
      <span
        aria-hidden="true"
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
          enabled ? 'bg-[var(--color-accent-dark)]' : 'bg-[var(--color-border-light)]'
        }`}
      >
        <span
          className={`absolute left-0.5 inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </span>
    </button>
  );
}
