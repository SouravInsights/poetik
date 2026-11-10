"use client";

/**
 * CreditInput
 *
 * A plain, single-line text field for the signature — implemented as a
 * `contentEditable` surface rather than an `<input>`.
 *
 * Why not an input? Mobile OS autofill services target form controls, and on
 * some devices they raise a native panel (cards, addresses) over a name-looking
 * field no matter what autocomplete hints you set. contentEditable is not a form
 * control, so that panel never appears. It also means the caret is native and
 * always where the text is.
 *
 * It is deliberately uncontrolled in the DOM: we only write `value` back when
 * it changes from OUTSIDE (a restored draft), never on the keystroke that
 * produced it — otherwise the caret would jump to the end on every letter.
 */

import { useEffect, useRef } from "react";

interface CreditInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CreditInput({
  value,
  onChange,
  placeholder,
  className,
}: CreditInputProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Only reconcile when the incoming value genuinely differs from what is on
    // screen (e.g. it was restored or clamped), so live typing never reflows.
    const current = el.textContent ?? "";
    if (current !== value) {
      el.textContent = value;
    }
  }, [value]);

  return (
    <div
      ref={ref}
      role="textbox"
      aria-label="signature"
      aria-multiline="false"
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      autoCorrect="off"
      autoCapitalize="none"
      enterKeyHint="done"
      data-placeholder={placeholder}
      onInput={(e) => {
        const el = e.currentTarget;
        const text = el.textContent ?? "";
        // Keep `:empty` true after the field is cleared, so the placeholder
        // returns (browsers otherwise leave a stray <br> behind).
        if (text === "") el.innerHTML = "";
        onChange(text);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      onPaste={(e) => {
        // Force plain text — pasted HTML would bring its own styling.
        e.preventDefault();
        const text = e.clipboardData
          .getData("text/plain")
          .replace(/\s+/g, " ")
          .trim();
        document.execCommand("insertText", false, text);
      }}
      className={className}
    />
  );
}
