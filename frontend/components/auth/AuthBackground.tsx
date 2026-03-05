export function AuthBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="
        absolute left-1/2 top-1/2
        h-150 w-150
        -translate-x-1/2 -translate-y-1/2
        rounded-full
        opacity-10
        blur-3xl
        bg-primary
        "
      />

      <div
        className="
        absolute inset-0 opacity-[0.04]
        "
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}