import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../Styles/MapStyles.css';
import L from 'leaflet';
import { apiGetNearbyDermatology } from '../api/api';

// ---------------------------------------------
// Helper function to render star rating
// ---------------------------------------------
const renderStars = (rating) => {
    if (!rating && rating !== 0) return 'No rating';

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center gap-1" aria-hidden="true">
            {[...Array(fullStars)].map((_, i) => (
                <span key={`full-${i}`} className="text-yellow-400 text-sm">★</span>
            ))}
            {hasHalfStar && <span className="text-yellow-400 text-sm">☆</span>}
            {[...Array(emptyStars)].map((_, i) => (
                <span key={`empty-${i}`} className="text-gray-300 text-sm">☆</span>
            ))}
            <span className="text-xs text-gray-600 ml-1">({rating})</span>
        </div>
    );
};

// ---------------------------------------------
// Custom Marker Icon with Text Label
// ---------------------------------------------
const createMarkerWithLabel = (label) => {
    return L.divIcon({
        className: 'marker-with-label',
        html: `
            <div style="position: relative; display: flex; align-items: center; max-width:220px;">
                <img src="https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png"
                     style="width: 22px; height: 36px; filter: saturate(1.2) brightness(0.9);" />
                <div style="
                    background-color: white;
                    color: black;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 13px;
                    font-weight: 500;
                    margin-left: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.18);
                    border: 1px solid #ddd;
                    max-width: 160px;
                    word-wrap: break-word;
                    white-space: normal;
                    overflow: hidden;
                    text-overflow: ellipsis;
                ">
                    ${label}
                </div>
            </div>
        `,
        iconSize: [200, 40],
        iconAnchor: [12, 40],
    });
};

// ---------------------------------------------
// Custom user-location marker (red dot)
// ---------------------------------------------
const createUserLocationMarker = () =>
    L.divIcon({
        className: 'user-location-marker',
        html: `
            <div style="width: 18px; height: 18px; border-radius: 50%;
                        background: #e53935; box-shadow: 0 0 6px rgba(229,57,53,0.6);
                        border: 2px solid white;"></div>
        `,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
    });

// ---------------------------------------------
// Component to handle Geolocation
// ---------------------------------------------
function LocationFinder({ setUserLocation, setDefaultCenterReached, setLocationStatus, setHasUserLocation }) {
    const map = useMap();
    const [hasRequestedLocation, setHasRequestedLocation] = useState(false);

    useEffect(() => {
        if (hasRequestedLocation) return;

        setHasRequestedLocation(true);

        if (!navigator.geolocation) {
            console.error('Geolocation not supported');
            setLocationStatus('not-supported');
            setDefaultCenterReached(true);
            return;
        }

        setLocationStatus('requesting');

        map.locate({
            setView: false,
            maxZoom: 20,
            enableHighAccuracy: true,
            timeout: 30000,
        })
            .on('locationfound', (e) => {
                setLocationStatus('found');
                setUserLocation(e.latlng);
                setHasUserLocation(true);
                setDefaultCenterReached(false);
                map.flyTo(e.latlng, 15);
            })
            .on('locationerror', (e) => {
                console.error('Geolocation error:', e.message);
                setLocationStatus(`error-${e.code}`);
                setDefaultCenterReached(true);
                setHasUserLocation(false);
            });

        return () => {
            map.off('locationfound');
            map.off('locationerror');
        };
    }, [map, setUserLocation, setDefaultCenterReached, setLocationStatus, setHasUserLocation, hasRequestedLocation]);

    return null;
}

// ---------------------------------------------
// Main Map Component
// ---------------------------------------------
const NearestDermatologyMap = () => {
    const DEFAULT_CENTER = { lat: 31.537093019979395, lng: 74.35657732018396 }; // Lahore
    const [userLocation, setUserLocation] = useState(DEFAULT_CENTER);
    const [hasUserLocation, setHasUserLocation] = useState(false);
    const [dermatologyCenters, setDermatologyCenters] = useState([]);
    const [defaultCenterReached, setDefaultCenterReached] = useState(false);
    const [searchStatus, setSearchStatus] = useState('searching');
    const [locationStatus, setLocationStatus] = useState('initializing');

    const userLocationIcon = useMemo(() => createUserLocationMarker(), []);

    // Manual location request
    const requestLocation = () => {
        if (!navigator.geolocation) return alert('Geolocation not supported');

        setLocationStatus('requesting');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latlng = { lat: position.coords.latitude, lng: position.coords.longitude };
                setUserLocation(latlng);
                setHasUserLocation(true);
                setDefaultCenterReached(false);
                setLocationStatus('found');
            },
            (error) => {
                console.error('Manual location error:', error);
                setLocationStatus(`error-${error.code}`);
                setDefaultCenterReached(true);
                setHasUserLocation(false);
            },
            { enableHighAccuracy: true, timeout: 30000 }
        );
    };

    // Fetch nearby dermatology centers
    useEffect(() => {
        setSearchStatus('searching');

        const lat = userLocation.lat;
        const lng = userLocation.lng;

        apiGetNearbyDermatology(lat, lng, 5000)
            .then(response => {
                const data = response.data;
                if (data.results && data.results.length > 0) {
                    const centers = data.results.slice(0, 10).map(center => ({
                        name: center.name,
                        position: [center.lat, center.lng],
                        address: center.address,
                        rating: center.rating,
                    }));
                    setDermatologyCenters(centers);
                    setSearchStatus('success');
                } else {
                    setDermatologyCenters([]);
                    setSearchStatus('no-results');
                }
            })
            .catch(() => setSearchStatus('fetch-error'));
    }, [userLocation]);

    // Helper to generate Google Maps URL
    const getGoogleMapsUrl = (destination) => {
        const origin = hasUserLocation
            ? `${userLocation.lat},${userLocation.lng}`
            : `${DEFAULT_CENTER.lat},${DEFAULT_CENTER.lng}`;
        return `https://www.google.com/maps/dir/${origin}/${destination}`;
    };

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
                    setLocationStatus={setLocationStatus}
                    setHasUserLocation={setHasUserLocation}
                />
                <TileLayer
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* User marker */}
                {hasUserLocation && (
                    <Marker
                        position={[userLocation.lat, userLocation.lng]}
                        icon={userLocationIcon}
                    >
                        <Popup><strong>Your Current Location</strong></Popup>
                    </Marker>
                )}

                {/* Dermatology markers */}
                {dermatologyCenters.map((center, index) => (
                    <Marker
                        key={index}
                        position={center.position}
                        icon={createMarkerWithLabel(center.name)}
                        eventHandlers={{
                            click: () => {
                                const destination = `${center.position[0]},${center.position[1]}`;
                                window.open(getGoogleMapsUrl(destination), '_blank');
                            }
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -20]} sticky={true} className="custom-tooltip">
                            <div className="text-center max-w-xs">
                                <div className="font-semibold text-sm mb-1">{center.name}</div>
                                <div className="text-xs text-gray-600">{center.address}</div>
                                {center.rating !== undefined && <div className="mt-1">{renderStars(center.rating)}</div>}
                            </div>
                        </Tooltip>
                        <Popup>
                            <div className="text-center">
                                <h3 className="font-bold text-lg mb-2">{center.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{center.address}</p>
                                <p className="text-sm mb-3">{center.rating !== undefined ? renderStars(center.rating) : 'Rating: N/A'}</p>
                                <button
                                    aria-label={`Get directions to ${center.name}`}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const destination = `${center.position[0]},${center.position[1]}`;
                                        window.open(getGoogleMapsUrl(destination), '_blank');
                                    }}
                                >
                                    🗺️ Get Directions
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Status & messages */}
            <div className="mt-4 flex flex-col items-start space-y-2">
                {/* Location */}
                {locationStatus === 'initializing' && <p className="text-sm text-gray-600">🔄 Initializing location services...</p>}
                {/* {locationStatus === 'requesting' && <p className="text-sm text-blue-600">📍 Requesting your location...</p>} */}
                {locationStatus === 'searching' && <p className="text-sm text-blue-600">🔍 Finding your exact location...</p>}
                {locationStatus === 'found' && <p className="text-sm text-green-600">✅ Your location found!</p>}
                {locationStatus === 'not-supported' && <p className="text-sm text-red-500">❌ Geolocation not supported</p>}
                {locationStatus.startsWith('error-') && (
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm text-red-500">❌ Location access failed</p>
                        <button
                            onClick={requestLocation}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium"
                        >
                            🔄 Try Again
                        </button>
                    </div>
                )}

                {/* Search */}
                {searchStatus === 'searching' && <p className="text-sm text-blue-600">Searching for nearby dermatology centers... ⏳</p>}
                {searchStatus === 'success' && <p className="text-sm m-2 text-green-600">Found {dermatologyCenters.length} nearby dermatology centers.</p>}
                {(searchStatus === 'no-results' || searchStatus.startsWith('error')) && <p className="text-sm text-orange-600">No centers found nearby or an API issue occurred. ({searchStatus})</p>}
            </div>

            {/* Default center fallback */}
            {defaultCenterReached && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm text-red-700 font-semibold mb-2">⚠️ Unable to detect your location. Showing dermatology centers near Lahore.</p>
                    <button onClick={requestLocation} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium">
                        📍 Find My Location
                    </button>
                </div>
            )}
        </div>
    );
};

export default NearestDermatologyMap;
