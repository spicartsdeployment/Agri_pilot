import { useMemo } from "react";
import { MapPin } from "lucide-react";

export type MapPinType = {
  id: string;
  label: string;
  lat: number;
  lng: number;
  color: string;
};

type MapWithPinsProps = {
  pins: MapPinType[];
  bbox?: [number, number, number, number];
  height?: number;
  title?: string;
  legend?: { label: string; color: string }[];
  fullBleed?: boolean;
  interactive?: boolean;
  selectedPinId?: string | null;
  onPinClick?: (id: string) => void;
};

const DEFAULT_BBOX: [number, number, number, number] = [79.05, 21.08, 79.25, 21.28];

const MARKER_COLORS = ["red", "blue", "green", "yellow", "orange", "purple"] as const;

function pinColorToMarker(color: string, index: number): string {
  const map: Record<string, string> = {
    "#16a34a": "green",
    "#374151": "red",
    "#0369a1": "blue",
    "#f59e0b": "orange",
    green: "green",
    red: "red",
    blue: "blue",
  };
  return map[color] || MARKER_COLORS[index % MARKER_COLORS.length];
}

function computeBbox(pins: MapPinType[], base: [number, number, number, number]): [number, number, number, number] {
  if (pins.length === 0) return base;
  const lats = pins.map((p) => p.lat);
  const lngs = pins.map((p) => p.lng);
  const pad = 0.02;
  return [
    Math.min(...lngs) - pad,
    Math.min(...lats) - pad,
    Math.max(...lngs) + pad,
    Math.max(...lats) + pad,
  ];
}

function computeZoom(pins: MapPinType[], bbox: [number, number, number, number]): number {
  if (pins.length === 0) return 11;
  const lats = pins.map((p) => p.lat);
  const lngs = pins.map((p) => p.lng);
  const latSpan = Math.max(...lats) - Math.min(...lats);
  const lngSpan = Math.max(...lngs) - Math.min(...lngs);
  const span = Math.max(latSpan, lngSpan, 0.01);
  const [, minLat, , maxLat] = bbox;
  const bboxSpan = Math.max(maxLat - minLat, bbox[2] - bbox[0]);
  const effective = Math.max(span, bboxSpan * 0.3);
  if (effective > 0.4) return 9;
  if (effective > 0.2) return 10;
  if (effective > 0.1) return 11;
  if (effective > 0.05) return 12;
  return 13;
}

function buildStaticMapUrl(pins: MapPinType[], bbox: [number, number, number, number], height: number): string {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const centerLat = pins.length
    ? pins.reduce((s, p) => s + p.lat, 0) / pins.length
    : (minLat + maxLat) / 2;
  const centerLng = pins.length
    ? pins.reduce((s, p) => s + p.lng, 0) / pins.length
    : (minLon + maxLon) / 2;
  const zoom = computeZoom(pins, bbox);
  const w = 800;
  const h = Math.max(180, height * 2);
  const markers = pins
    .map((p, i) => `${p.lat},${p.lng},${pinColorToMarker(p.color, i)}`)
    .join("|");
  const base = `https://staticmap.openstreetmap.de/staticmap.php?center=${centerLat},${centerLng}&zoom=${zoom}&size=${w}x${h}&maptype=mapnik`;
  return markers ? `${base}&markers=${encodeURIComponent(markers)}` : base;
}

function buildEmbedUrl(bbox: [number, number, number, number]): string {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=mapnik`;
}

function latLngToPercent(lat: number, lng: number, bbox: [number, number, number, number]) {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const x = ((lng - minLon) / (maxLon - minLon)) * 100;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
  return { left: `${Math.min(96, Math.max(4, x))}%`, top: `${Math.min(96, Math.max(4, y))}%` };
}

export function MapWithPins({
  pins,
  bbox = DEFAULT_BBOX,
  height = 180,
  title,
  legend,
  fullBleed,
  interactive,
  selectedPinId,
  onPinClick,
}: MapWithPinsProps) {
  const activeBbox = useMemo(() => computeBbox(pins, bbox), [pins, bbox]);
  const mapUrl = buildStaticMapUrl(pins, activeBbox, height);
  const embedUrl = buildEmbedUrl(activeBbox);

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
      <div className="relative bg-muted" style={{ height }}>
        {interactive ? (
          <>
            <iframe
              title={title || "Farm map"}
              src={embedUrl}
              className="w-full h-full border-0"
              loading="lazy"
            />
            <div className="absolute inset-0 pointer-events-none">
              {pins.map((pin) => {
                const pos = latLngToPercent(pin.lat, pin.lng, activeBbox);
                const selected = selectedPinId === pin.id;
                return (
                  <button
                    key={pin.id}
                    type="button"
                    onClick={() => onPinClick?.(pin.id)}
                    className="absolute pointer-events-auto -translate-x-1/2 -translate-y-full flex flex-col items-center gap-0.5"
                    style={{ left: pos.left, top: pos.top }}
                    aria-label={pin.label}
                  >
                    <MapPin
                      className={`w-7 h-7 drop-shadow-md ${selected ? "text-green-600 scale-110" : "text-red-600"}`}
                      fill="currentColor"
                    />
                    {selected && (
                      <span className="text-[9px] font-semibold bg-white/95 text-foreground px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap max-w-[80px] truncate">
                        {pin.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <img
            src={mapUrl}
            alt={title || "Map"}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
      </div>
      {pins.length > 0 && (
        <div className="px-4 py-2 border-t border-border flex flex-wrap gap-2">
          {pins.map((pin) => (
            <button
              key={pin.id}
              type="button"
              onClick={() => onPinClick?.(pin.id)}
              className={`flex items-center gap-1.5 text-[10px] rounded-full px-2 py-0.5 transition-colors ${
                selectedPinId === pin.id ? "bg-secondary text-foreground font-medium" : "text-muted-foreground hover:bg-secondary/50"
              }`}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: pin.color }} />
              <span>{pin.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
