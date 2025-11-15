// NearestDermatologyMap.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../Styles/MapStyles.css';
import L from 'leaflet';
import { redMarkerIcon } from './ui/redMarkerIcon';

// 🔑 Your specific API key is now set here.
const API_KEY = 'AIzaSyB9-M0jCKZY2eY6gYuOUFSpGhv1JsVwSyU';

// ---------------------------------------------
// Icon Setup (for user location)
// ---------------------------------------------
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// ---------------------------------------------
// Component to handle Geolocation and Map State
// ---------------------------------------------
function LocationFinder({ setUserLocation, setDefaultCenterReached }) {
    const map = useMap();

    useEffect(() => {
        map.locate({
            setView: false,
            maxZoom: 16
        }).on('locationfound', (e) => {
            // SUCCESS: Location found
            setUserLocation(e.latlng);
            map.flyTo(e.latlng, 13);
        }).on('locationerror', (e) => {
            // ERROR: Geolocation failed
            console.error('Geolocation Error:', e.message);
            setDefaultCenterReached(true);
        });
    }, [map, setUserLocation, setDefaultCenterReached]);

    return null;
}

// ---------------------------------------------
// Main Map Component
// ---------------------------------------------
const NearestDermatologyMap = () => {
    // 📍 Default location set to Lahore, Pakistan
    const DEFAULT_CENTER = { lat: 31.537093019979395, lng: 74.35657732018396 };
    const [userLocation, setUserLocation] = useState(DEFAULT_CENTER);
    const [dermatologyCenters, setDermatologyCenters] = useState([]);
    const [defaultCenterReached, setDefaultCenterReached] = useState(false);
    const [searchStatus, setSearchStatus] = useState('searching');

    // Effect to fetch REAL nearby data whenever userLocation changes
    useEffect(() => {
        setSearchStatus('searching');

        const lat = userLocation.lat;
        const lng = userLocation.lng;

        // API URL to search for "face skin dermatology center" within a 5km radius
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=health&keyword=face%20skin%20dermatology%20center&key=${API_KEY}`;

        fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data.status === 'OK' && data.results && data.results.length > 0) {
                    // Process and store up to 10 results
                    const centers = data.results.slice(0, 10).map(place => ({
                        name: place.name,
                        position: [place.geometry.location.lat, place.geometry.location.lng],
                        address: place.vicinity || place.formatted_address || 'Address not available',
                        rating: place.rating,
                    }));
                    setDermatologyCenters(centers);
                    setSearchStatus('success');
                } else if (data.status === 'ZERO_RESULTS') {
                    setDermatologyCenters([]);
                    setSearchStatus('no-results');
                } else {
                    // Handle specific API errors like INVALID_REQUEST, OVER_QUERY_LIMIT, etc.
                    console.error("Google Places API Error:", data.status, data.error_message);
                    setSearchStatus(`error: ${data.status}`);
                }
            })
            .catch(error => {
                console.error("Error fetching places:", error);
                setSearchStatus('fetch-error');
            });
    }, [userLocation]); // Dependency array ensures fetch runs only when location changes

    return (
        <div className="map-container">
            <MapContainer
                center={[userLocation.lat, userLocation.lng]}
                zoom={12}
                scrollWheelZoom={false}
                className="leaflet-container"
            >
                <LocationFinder
                    setUserLocation={setUserLocation}
                    setDefaultCenterReached={setDefaultCenterReached}
                />

                <TileLayer
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Marker for User's Location (Default blue icon) */}
                {userLocation !== DEFAULT_CENTER && (
                    <Marker position={[userLocation.lat, userLocation.lng]}>
                        <Popup>
                            **Your Current Location**
                        </Popup>
                    </Marker>
                )}

                {/* Markers for Dermatology Centers (Red Marker Icon) */}
                {dermatologyCenters.map((center, index) => (
                    <Marker
                        key={index}
                        position={center.position}
                        icon={redMarkerIcon}
                    >
                        <Popup>
                            **{center.name}** <br />
                            {center.address} <br />
                            Rating: {center.rating ? `⭐ ${center.rating}` : 'Rating: N/A'}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <div className="mt-4 flex flex-col items-start space-y-2">
                {searchStatus === 'searching' && (
                    <p className="text-sm text-blue-600 font-semibold">
                        Searching for nearby face skin dermatology centers in Lahore/your area... ⏳
                    </p>
                )}
                {searchStatus === 'success' && (
                    <p className="text-sm text-green-600 font-semibold">
                        Found {dermatologyCenters.length} real nearby centers. They are marked in **red**. ✅
                    </p>
                )}
                {(searchStatus === 'no-results' || searchStatus.startsWith('error')) && (
                    <p className="text-sm text-orange-600 font-semibold">
                        No centers found nearby or an API issue occurred. ({searchStatus})
                    </p>
                )}
            </div>

            {defaultCenterReached && (
                <p className="text-sm text-red-500 mt-2 font-semibold">
                    ⚠️ **Location Error:** Geolocation failed. Showing the **default center of Lahore**. Please enable location services to see centers near you.
                </p>
            )}
        </div>
    );
};

export default NearestDermatologyMap;