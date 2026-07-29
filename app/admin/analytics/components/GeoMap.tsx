'use client';
import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import * as isoCountries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

isoCountries.registerLocale(enLocale);

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

interface GeoMapProps {
  data: { country: string; count: number }[];
}

export default function GeoMap({ data }: GeoMapProps) {
  const [mounted, setMounted] = useState(false);
  const [tooltipContent, setTooltipContent] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const maxCount = Math.max(...data.map(d => d.count), 1);
  const colorScale = scaleLinear<string>()
    .domain([1, maxCount])
    .range(["#fbcfe8", "#9d174d"]); // From Light Pink to Dark Pink

  const dataMap = data.reduce((acc, curr) => {
    const numericCode = isoCountries.alpha2ToNumeric(curr.country);
    if (numericCode) {
      acc[numericCode] = curr;
    }
    return acc;
  }, {} as Record<string, { country: string; count: number }>);

  return (
    <div className="w-full h-full relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 120,
        }}
        width={800}
        height={400}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup zoom={1} center={[0, 0]} maxZoom={5}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const geoData = dataMap[geo.id];
                const hasData = !!geoData;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={hasData ? colorScale(geoData.count) : "currentColor"}
                    className={hasData ? "" : "text-zinc-200 dark:text-white/5"}
                    stroke={hasData ? "#831843" : "currentColor"}
                    strokeWidth={hasData ? 1 : 0.5}
                    strokeDasharray={hasData ? "2,2" : "none"}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: hasData ? "#be185d" : "", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                    onMouseEnter={() => {
                      if (hasData) {
                        const name = isoCountries.getName(geoData.country, "en") || geo.properties.name;
                        setTooltipContent(`${name}: ${geoData.count} visits`);
                      } else {
                        setTooltipContent(geo.properties.name);
                      }
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("");
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      {tooltipContent && (
        <div className="absolute top-2 right-2 bg-black/80 dark:bg-white/90 text-white dark:text-black font-semibold text-xs px-3 py-1.5 rounded-lg shadow-lg pointer-events-none transition-all">
          {tooltipContent}
        </div>
      )}
      <div className="absolute bottom-2 left-2 text-[10px] text-zinc-400 font-medium bg-white/80 dark:bg-black/50 px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
        Scroll to zoom, drag to pan
      </div>
    </div>
  );
}
