export type MapPin = {
  id: string;
  label: string;
  lat: number;
  lng: number;
  color: string;
};

type MapWithPinsProps = {
  pins: MapPin[];
  bbox?: [number, number, number, number];
  height?: number;
  title?: string;
  legend?: { label: string; color: string }[];
  fullBleed?: boolean;
};

const DEFAULT_BBOX: [number, number, number, number] = [79.05, 21.08, 79.25, 21.28];

export function MapWithPins({ pins, bbox = DEFAULT_BBOX, height = 180, title, legend, fullBleed }: MapWithPinsProps) {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=mapnik`;

  const toPosition = (lat: number, lng: number) => ({
    left: `${Math.min(96, Math.max(4, ((lng - minLon) / (maxLon - minLon)) * 100))}%`,
    top: `${Math.min(92, Math.max(8, ((maxLat - lat) / (maxLat - minLat)) * 100))}%`,
  });

  return (
    <div className={`bg-card overflow-hidden ${fullBleed ? "rounded-none border-y border-border" : "rounded-2xl border border-border"}`}>
      {(title || legend) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-border gap-2 flex-wrap">
          {title && <span className="text-sm font-medium text-foreground">{title}</span>}
          {legend && (
            <div className="flex items-center gap-3 text-xs flex-wrap">
              {legend.map((l) => (
                <div key={l.label} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                  <span className="text-muted-foreground">{l.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="relative" style={{ height }}>
        <iframe
          src={embedUrl}
          width="100%"
          height={height}
          style={{ border: 0, display: "block" }}
          title={title || "Map"}
          loading="lazy"
        />
        {pins.map((pin) => {
          const pos = toPosition(pin.lat, pin.lng);
          return (
            <div
              key={pin.id}
              className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-none"
              style={{ left: pos.left, top: pos.top }}
              title={pin.label}
            >
              <span className="w-3 h-3 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: pin.color }} />
              <span className="text-[9px] font-medium text-foreground bg-white/90 px-1 py-0.5 rounded mt-0.5 shadow-sm max-w-[72px] truncate">
                {pin.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
