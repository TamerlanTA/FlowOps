export default function SectionGlow({
  intensity = "normal",
}: {
  intensity?: "soft" | "normal" | "strong";
}) {
  const opacityMap = {
    soft: "opacity-[0.04]",
    normal: "opacity-[0.06]",
    strong: "opacity-[0.09]",
  } as const;

  return (
    <div className="relative h-px w-full" aria-hidden="true">
      <div
        className={`absolute inset-x-[10%] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-blue-400 to-transparent ${opacityMap[intensity]}`}
      />
      <div
        className={`absolute left-1/2 top-1/2 h-16 w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-full ${opacityMap[intensity]}`}
        style={{
          background:
            "radial-gradient(ellipse, rgba(60,100,220,0.18) 0%, transparent 70%)",
          filter: "blur(24px)",
        }}
      />
    </div>
  );
}
