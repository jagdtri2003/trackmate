import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Loader from "./Loader";
import DropBox from "./DropBox";
import LocationInfo from "./LocationInfo";

const MapComponent = () => {
  const [position, setPosition] = useState(null); // Current position
  const [granted, setGranted] = useState(true);
  const [option, setOption] = useState("today");
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [startingPoint, setStartingPoint] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [heading, setHeading] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0); // Track current index along the route
  const markerRef = useRef(null); // Reference to the marker
  const mapRef = useRef(null); // Reference to the map instance
  const intervalRef = useRef(null); // To store the interval reference
  const [time, setTime] = useState([]);

  const customIcon = new L.Icon({
    iconUrl:
      "https://firebasestorage.googleapis.com/v0/b/travelkro-1e28f.appspot.com/o/pngtree-red-car-top-view-icon-png-image_3745904-removebg-preview.png?alt=media&token=24c61390-e6d4-489c-8c64-6356315aa61b",
    iconSize: [35, 35],
    iconAnchor: [20, 40],
    popupAnchor: [0, -30],
    className: "car",
  });

  useEffect(() => {
    // Open the popup when the marker is ready
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [mapRef.current]);

  useEffect(() => {
    let watchId;
    if (option === "yesterday") {
      fetch("https://server-travelkro.vercel.app/location")
        .then((response) => response.json())
        .then((data) => {
          const transformedData = data.map((coord) => [coord[1], coord[0]]); // latitude, longitude
          setRouteCoordinates(transformedData);
          setStartingPoint([data[0][1], data[0][0]]); // Set the starting point
          setCurrentIndex(0); // Reset index
          setTime(data.map((coord) => coord[2]));

          // Move the map to the starting point
          if (mapRef.current) {
            mapRef.current.flyTo([data[0][1], data[0][0]], 18); // Center the map
          }
        });
    } else if ("geolocation" in navigator) {
      setRouteCoordinates([]);
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          // Move the map to the user's current position
          if (mapRef.current) {
            mapRef.current.flyTo([pos.coords.latitude, pos.coords.longitude], 16);
          }
        },
        (err) => {
          console.error("Error getting location", err);
          if (err.code === 1) {
            setGranted(false);
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
    }

    // Cleanup watchPosition on unmount
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [option]);

  useEffect(() => {
    // Move the car when playing is true
    if (playing && routeCoordinates.length > 0) {
      moveCar();
    } else {
      // Stop the movement when playing is false
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      // Cleanup the interval on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [playing, routeCoordinates, currentIndex]);

  const moveCar = () => {
    intervalRef.current = setInterval(() => {
      if (currentIndex < routeCoordinates.length - 1) {
        const start = routeCoordinates[currentIndex];
        const end = routeCoordinates[currentIndex + 1];
        setPosition(end);

        // Update position and heading (rotation angle)
        if (markerRef.current) {
          markerRef.current.setLatLng(start);
        }

        const angle = calculateAngle(start, end);
        setHeading(angle);

        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        // Stop the movement when the route ends
        setPlaying(false);
        clearInterval(intervalRef.current);
      }
    }, 1000); // Move every 1 second
  };

  const calculateAngle = (start, end) => {
    const latDiff = end[0] - start[0];
    const lngDiff = end[1] - start[1];
    return (Math.atan2(lngDiff, latDiff) * 180) / Math.PI;
  };

  return (
    <div>
      {position || option === "yesterday" ? (
        <>
          <MapContainer
            center={option === "yesterday" ? startingPoint : position}
            zoom={16}
            style={{ height: "100vh", width: "100vw" }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="mailto:jagdtri2003@gmail.com">Jagdamba Tripathi</a>'
            />

            {routeCoordinates.length > 0 && (
              <Polyline positions={routeCoordinates} color="blue" weight={4} />
            )}

            {option === "yesterday" && startingPoint && (
              <Marker
                position={startingPoint}
                icon={L.divIcon({
                  className: "vehicle-icon",
                  html: `<div style="transform: rotate(${heading}deg); transform-origin: bottom center;">
                          <img src="https://firebasestorage.googleapis.com/v0/b/travelkro-1e28f.appspot.com/o/pngtree-red-car-top-view-icon-png-image_3745904-removebg-preview.png?alt=media&token=24c61390-e6d4-489c-8c64-6356315aa61b" style="width: 40px; height: 40px; background:transparent" />
                        </div>`,
                  iconSize: [40, 40],
                  iconAnchor: [20, 38],
                })}
                ref={markerRef}
              >
                <Popup>You were here!</Popup>
              </Marker>
            )}

            {option === "today" && position && (
              <Marker position={position} icon={customIcon} ref={markerRef}>
                <Popup>You are here!</Popup>
              </Marker>
            )}
          <LocationInfo
            latitude={position ? position[0].toFixed(6) : null}
            longitude={position ? position[1].toFixed(6) : null}
            timestamp={time[currentIndex]}
          />

            <DropBox setOption={setOption} playing={playing} setPlaying={setPlaying} />
          </MapContainer>
        </>
      ) : (
        <Loader granted={granted} />
      )}
    </div>
  );
};

export default MapComponent;
