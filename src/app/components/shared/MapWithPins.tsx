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

function computeZoom(pins: MapPin[], bbox: [number, number, number, number]): number {
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

function buildStaticMapUrl(pins: MapPin[], bbox: [number, number, number, number], height: number): string {
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

export function MapWithPins({ pins, bbox = DEFAULT_BBOX, height = 180, title, legend, fullBleed }: MapWithPinsProps) {
  const mapUrl = buildStaticMapUrl(pins, bbox, height);

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
        <img
          src={mapUrl}
          alt={title || "Map"}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      {pins.length > 0 && (
        <div className="px-4 py-2 border-t border-border flex flex-wrap gap-2">
          {pins.map((pin) => (
            <div key={pin.id} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: pin.color }} />
              <span>{pin.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
