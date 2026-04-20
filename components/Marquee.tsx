const TECH = [
  { color: "#9B59B6", name: "Make" },
  { color: "#EA4B71", name: "n8n" },
  { color: "#10A37F", name: "OpenAI" },
  { color: "#96BF48", name: "Shopify" },
  { color: "#2CA5E0", name: "Telegram" },
  { color: "#4285F4", name: "Google Cloud" },
  { color: "#FF6B35", name: "Airtable" },
  { color: "#00D4C0", name: "Zapier" },
];

const items = [...TECH, ...TECH];

export default function Marquee() {
  return (
    <div
      className="relative z-10 overflow-hidden border-y border-[rgba(255,255,255,0.07)] bg-[rgba(10,10,20,0.97)] py-3.5"
      aria-hidden="true"
    >
      <div className="marquee-inner flex items-center gap-12">
        {items.map((item, i) => (
          <div key={i} className="flex flex-shrink-0 items-center gap-2.5 text-[13px] font-semibold text-[#525270]">
            <span
              className="size-[6px] rounded-full flex-shrink-0"
              style={{ background: item.color }}
            />
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
