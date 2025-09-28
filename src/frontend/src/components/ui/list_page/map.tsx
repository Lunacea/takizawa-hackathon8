"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ▼▼▼ 画像のimport文を削除 ▼▼▼
// import icon from "leaflet/dist/images/marker-icon.png";
// import iconShadow from "leaflet/dist/images/marker-shadow.png";

// ▼▼▼ publicフォルダのパスを直接指定するように変更 ▼▼▼
const DefaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export type MapProps = {
  position: [number, number];
  popupText: string;
};

const Map = ({ position, popupText }: MapProps) => {
  return (
    <MapContainer
      center={position}
      zoom={14}
      scrollWheelZoom={false}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>{popupText}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;