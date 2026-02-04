import { useEffect, useRef } from "react";
import { OlaMaps } from "olamaps-web-sdk";

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const olaMaps = new OlaMaps({ apiKey: "qNNAudElO1nt3biMroXs1NLgZOUbLqSB9T5KW9a4"});
    const map = olaMaps.init({
      style:
        "https://api.olamaps.io/styleEditor/v1/styleEdit/styles/28876226-99fd-4e73-8ad5-d2d5e4fbed40/map",
      container: mapContainerRef.current,
      center: [77.61648, 12.93142],
      zoom: 12,
    });
    const geolocate = olaMaps.addGeolocateControls({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    map.addControl(geolocate);
    map.on('load', () => {
      geolocate.trigger()
    });
  }, []);

  return <div ref={mapContainerRef} className="h-[500px] w-full" />;
};

export default Map;
