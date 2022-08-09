import React, { ReactElement, useState, useRef } from 'react';
import GoogleMapReact from 'google-map-react';
import useSupercluster from 'use-supercluster';
import * as Popover from '@radix-ui/react-popover';
import { MdClose } from 'react-icons/md';

/* eslint-disable no-shadow */

type City = {
  id: number;
  name: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
};

type Props = {
  apiKey: string;
  cities: City[];
};

type MarkerProps = {
  children: ReactElement;
  lat: number;
  lng: number;
};

type Map = google.maps.Map;

const Marker = ({ children }: MarkerProps) => children;

// Heavily inspired by
// https://github.com/leighhalliday/google-maps-clustering/blob/master/src/App.js
const GoogleMap = ({ apiKey, cities }: Props) => {
  const mapRef = useRef<Map>();
  const [bounds, setBounds] = useState<number[]>();
  const [zoom, setZoom] = useState(10);
  const maxZoom = 12;

  const points = cities.map((location) => ({
    properties: {
      cluster: false,
      locationId: location.id,
      name: location.name,
      state: location.state,
      country: location.country,
    },
    geometry: {
      type: 'Point',
      coordinates: [location.longitude, location.latitude],
    },
  }));

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom },
  });

  // Vancouver
  const center = {
    lat: 49.2827291,
    lng: -123.1207375,
  };

  const markerClasses =
    'rounded-full flex justify-center items-center bg-blue-700 text-white';

  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: apiKey }}
      defaultCenter={center}
      defaultZoom={2}
      yesIWantToUseGoogleMapApiInternals
      onChange={({ zoom, bounds }) => {
        setZoom(zoom);
        setBounds([bounds.nw.lng, bounds.se.lat, bounds.se.lng, bounds.nw.lat]);
      }}
      onGoogleApiLoaded={({ map }) => {
        mapRef.current = map;
      }}
    >
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const {
          cluster: isCluster,
          point_count: pointCount,
        } = cluster.properties;

        if (isCluster) {
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              lat={latitude}
              lng={longitude}
            >
              <button
                className={markerClasses}
                style={{
                  width: `${30 + (pointCount / points.length) * 20}px`,
                  height: `${30 + (pointCount / points.length) * 20}px`,
                }}
                type="button"
                onClick={() => {
                  const expansionZoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    maxZoom,
                  );
                  if (mapRef.current !== undefined) {
                    mapRef.current.setZoom(expansionZoom);
                    mapRef.current.panTo({ lat: latitude, lng: longitude });
                  }
                }}
              >
                {pointCount}
              </button>
            </Marker>
          );
        }

        return (
          <Marker
            key={`location-${cluster.properties.locationId}`}
            lat={latitude}
            lng={longitude}
          >
            <Popover.Root>
              <Popover.Trigger
                onClick={() => {
                  if (mapRef.current !== undefined) {
                    mapRef.current.panTo({ lat: latitude, lng: longitude });
                  }
                }}
              >
                <span className={`${markerClasses} w-6 h-6`}>{1}</span>
              </Popover.Trigger>
              <Popover.Content>
                <div className="max-w-sm rounded shadow-lg bg-gray-700 text-white">
                  <div className="relative flex justify-center">
                    <div className="bg-gray-700 absolute w-3 h-3 transform rotate-45 -mt-1" />
                  </div>
                  <div className="px-6 py-4">
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="font-bold text-xl mr-8">
                        {cluster.properties.name}, {cluster.properties.state},{' '}
                        {cluster.properties.country}
                      </h2>
                      <Popover.Close>
                        <MdClose className="w-6 h-6" />
                      </Popover.Close>
                    </div>
                    {/* <p className="text-gray-100 text-base"></p> */}
                  </div>
                </div>
              </Popover.Content>
            </Popover.Root>
          </Marker>
        );
      })}
    </GoogleMapReact>
  );
};

export default GoogleMap;
