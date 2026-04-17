"use client";

interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export function PhoneMockup({ children, className = "", dark = true }: PhoneMockupProps) {
  return (
    <div
      className={`relative mx-auto ${className}`}
      style={{
        width: "220px",
        height: "476px",
        borderRadius: "36px",
        border: dark ? "2px solid rgba(255,255,255,0.12)" : "2px solid rgba(0,0,0,0.1)",
        background: dark ? "#0D0B09" : "#F5F0E8",
        boxShadow: dark
          ? "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.05)"
          : "0 32px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
    >
      {/* Notch */}
      <div
        style={{
          position: "absolute",
          top: "12px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "72px",
          height: "8px",
          borderRadius: "4px",
          background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
          zIndex: 10,
        }}
      />
      {/* Content */}
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}
