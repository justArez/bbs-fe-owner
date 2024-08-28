import { GoogleMap as GoogleMapReact, useJsApiLoader } from "@react-google-maps/api";
import config from "@/config";
import {
  useFilterFormStore,
  useGoogleMapStore,
  useSearchLocationStore,
  useCenterPinStore,
} from "@/store/componentStore";
import { usePlaceDetail } from "@/features/map/api";
import { useState, useEffect, useRef, useCallback } from "react";
import { SkeletonLoader } from "@/components/SkeletonLoader";
import { setMapFitBounds } from "@/libs/helper/googleMapHelper";
import AutocompleteAddress from "../AutocompleteAddress";
import { ArrowCloseIcon, ArrowOpenIcon } from "@/assets/icons";
import { useNavigate } from "react-router-dom";
import { encodeStringtoURI } from "@/libs/helper";
import { Loader } from "@mantine/core";
import { twMerge } from "tailwind-merge";
import CenterListPin from "../CenterListPin/CenterListPin";

export default function GoogleMap({ visible }: { visible: boolean }) {
  const { isLoaded } = useJsApiLoader({
    // id: "4efdfc21c30d0be0",
    googleMapsApiKey: config.API.API_KEY,
  });
  const [isFirstIdle, setIsFirstIdle] = useState(false);
  const [isLoadfull, setIsLoadFull] = useState(false);
  const { sessionToken, placeChoose, setSessionToken } = useSearchLocationStore();
  const { data } = usePlaceDetail({ placeId: placeChoose?.place_id || "", sessionToken });
  const [isOpen, setIsOpen] = useState(false);
  const { map, setMap, setPlaceDetail } = useGoogleMapStore();
  const navigate = useNavigate();
  const { setFilterData, isQuery, listCenter } = useFilterFormStore();
  const { setCenterPin } = useCenterPinStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);

  const handleClickLoaction = useCallback(
    (location: string, placeId: string) => {
      navigate(`/search-location?location=${encodeStringtoURI(location)}&placeId=${placeId}`);
    },
    [navigate],
  );

  useEffect(() => {
    if (isFirstIdle && data && data.geometry && map) {
      setMapFitBounds(map, mapRef, data.geometry);
      setPlaceDetail(data);
      setSessionToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirstIdle, data?.place_id]);

  return (
    <div
      id="google-map"
      className={twMerge(
        "sticky top-[64px] h-[calc(100vh-64px)] w-full",
        visible ? "visible" : "invisible lgmax:visible",
      )}
    >
      <div className="relative w-full h-full">
        {!isLoadfull && <SkeletonLoader className="absolute top-0 left-0 z-10" />}

        {isLoadfull && isQuery && (
          <div className="absolute left-1/2 top-2 z-[997] p-4 bg-white rounded-lg">
            <Loader variant="dots" size={"md"} color="dark" />
          </div>
        )}

        {isLoaded && (
          <>
            <div className="w-2/3 absolute top-3 left-3 z-[1]">
              <div className="relative">
                <AutocompleteAddress
                  isVisible={isOpen && !isQuery}
                  navigateOnClickOption={handleClickLoaction}
                />
                {isOpen ? (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute z-[1] -top-1 left-full ml-3 p-[14px] rounded-lg bg-white text-black"
                  >
                    <ArrowOpenIcon />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsOpen(true)}
                    className="absolute z-[1] -top-1 left-0 ml-3 p-[14px] rounded-lg bg-white text-black"
                  >
                    <ArrowCloseIcon />
                  </button>
                )}
              </div>
            </div>
            <GoogleMapReact
              ref={mapRef}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              zoom={10}
              onUnmount={() => setMap(null)}
              onLoad={(map) => {
                setMap(map);
              }}
              onClick={() => {
                setCenterPin(null);
              }}
              onTilesLoaded={() => {
                setIsLoadFull(true);
              }}
              onIdle={() => {
                let bounds: google.maps.LatLngBounds | undefined;
                if (map) {
                  bounds = map.getBounds();
                }
                if (bounds) {
                  setFilterData({
                    viewPortNE: {
                      lat: bounds.getNorthEast().lat(),
                      lng: bounds.getNorthEast().lng(),
                    },
                    viewPortSW: {
                      lat: bounds.getSouthWest().lat(),
                      lng: bounds.getSouthWest().lng(),
                    },
                  });
                }
                if (!isFirstIdle) {
                  setIsFirstIdle(true);
                }
                scrollTo({ top: 0 });
                setIsOpen(false);
              }}
              options={{
                gestureHandling: "greedy",
                mapTypeControl: false,
                streetViewControl: false,
                // mapId: "4efdfc21c30d0be0",
                zoomControl: false,
              }}
            >
              {listCenter && <CenterListPin centers={listCenter} />}
            </GoogleMapReact>
          </>
        )}
      </div>
    </div>
  );
}
