import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";
import { Poste } from "../lib/models";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const center = { lat: 9.3077, lng: 2.3158 }; // Centre géographique approximatif du Bénin

interface Props {
  postes: Poste[];
  /** Optionnel : trace une ligne reliant les points dans l'ordre fourni (visualisation du trajet). */
  path?: { lat: number; lng: number }[];
  zoom?: number;
}

export default function Map({ postes, path, zoom = 7 }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GMAPS_API_KEY;

  if (!apiKey) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAF7F2",
          color: "#6B6258",
          fontSize: "0.85rem",
          textAlign: "center",
          padding: "16px",
        }}
      >
        Carte indisponible : clé API Google Maps non configurée
        (NEXT_PUBLIC_GMAPS_API_KEY).
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={zoom} center={path?.[0] ?? center}>
        {postes.map((poste) => (
          <Marker key={poste.id} position={poste.coordonnees} title={poste.nom} />
        ))}
        {path && path.length > 1 && (
          <Polyline
            path={path}
            options={{
              strokeColor: "#D5001C",
              strokeWeight: 4,
              strokeOpacity: 0.85,
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}
