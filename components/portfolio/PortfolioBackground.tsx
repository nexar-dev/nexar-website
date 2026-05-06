export function PortfolioBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <div
        className="absolute inset-0 bg-grid opacity-50"
        style={{
          maskImage:
            "radial-gradient(ellipse 85% 70% at 50% 30%, black 35%, transparent 100%)",
        }}
      />
      <div
        className="absolute rounded-full blur-[100px]"
        style={{
          top: "-12%",
          left: "-8%",
          width: "520px",
          height: "520px",
          background: "radial-gradient(circle, hsl(var(--primary) / 0.14), transparent 70%)",
        }}
      />
      <div
        className="absolute rounded-full blur-[100px]"
        style={{
          bottom: "-18%",
          right: "-8%",
          width: "580px",
          height: "580px",
          background:
            "radial-gradient(circle, hsl(var(--pink-accent) / 0.12), transparent 70%)",
        }}
      />
    </div>
  );
}
