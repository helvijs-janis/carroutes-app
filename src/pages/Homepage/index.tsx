import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Portal,
  Select,
  HStack,
  VStack,
  Field,
  Text,
  Button,
} from "@chakra-ui/react";
import { createListCollection } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../components/redux/store";
import {
  setCars,
  setSelectedCar,
  setStartDate,
  setEndDate,
} from "../../components/redux/listSlice";

const position = { lat: 53.54992, lng: 10.00678 };

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAPON_API_KEY = import.meta.env.VITE_MAPON_API_KEY;

interface Unit {
  number: string;
  unit_id: number;
}

function Homepage() {
  const dispatch = useDispatch();
  const { cars, selectedCar, startDate, endDate } = useSelector(
    (state: RootState) => state.list
  );

  const [, setRoutes] = useState({});
  const [displayMap, setDisplayMap] = useState(false);

  const convertToDatetime = (date: string | null) => {
    return date?.toString().replace(/\.\d{3}Z$/, "Z");
  };

  useEffect(() => {
    const fetchList = async () => {
      const response = await fetch(
        `https://mapon.com/api/v1/unit.json?key=${MAPON_API_KEY}`
      );
      const carList = await response.json();

      /// switching "value" and "label" values to number so it would work as intended with chakra.ui components
      const updatedList = carList?.data?.units.map(
        ({ number, ...rest }: Unit) => ({
          ...rest,
          value: number,
          label: number,
        })
      );
      dispatch(setCars(updatedList));
    };

    fetchList();
  }, [dispatch]);

  const fetchRoutes = async () => {
    if (!selectedCar) return;

    const response = await fetch(
      `https://mapon.com/api/v1/route/list.json?key=${MAPON_API_KEY}&unit_id=${
        selectedCar.unit_id
      }&from=${convertToDatetime(startDate)}&till=${convertToDatetime(
        endDate
      )}&include=polyline`
    );
    const routes = await response.json();
    setRoutes(routes);
    setDisplayMap(true);
  };

  return (
    <div className="App">
      <Box px="20%">
        <Heading size="2xl">Route report</Heading>

        <HStack w="100%" align="start">
          <Heading size="md" w="200px">
            Vehicle number
          </Heading>
          <Box flex="1">
            <Field.Root>
              <Select.Root
                collection={createListCollection({
                  items: cars,
                })}
                width="100%"
                value={selectedCar ? [selectedCar.value] : []}
                onValueChange={(e) => {
                  dispatch(setSelectedCar(e.items[0]));
                }}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select vehicle" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {cars.map((car) => (
                        <Select.Item item={car} key={car.unit_id}>
                          {car.value}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
              <Field.ErrorText>This field is required</Field.ErrorText>
            </Field.Root>
          </Box>
        </HStack>

        <HStack>
          <Heading size="md" w="200px">
            Period
          </Heading>

          <VStack align="start">
            <Text>From</Text>
            <DatePicker
              selected={startDate ? new Date(startDate) : null}
              onChange={(date) =>
                date && dispatch(setStartDate(date.toISOString()))
              }
            />
          </VStack>

          <VStack align="start">
            <Text>To</Text>
            <DatePicker
              selected={endDate ? new Date(endDate) : null}
              onChange={(date) =>
                date && dispatch(setEndDate(date.toISOString()))
              }
            />
          </VStack>
        </HStack>

        {displayMap && (
          <Box position="relative" w="100%" h="200px">
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
              <Map
                defaultCenter={position}
                defaultZoom={10}
                mapId="DEMO_MAP_ID"
              >
                <AdvancedMarker position={position} />
              </Map>
            </APIProvider>
          </Box>
        )}

        <Button
          onClick={fetchRoutes}
          colorPalette="purple"
          variant="solid"
          disabled={!selectedCar}
          w="full"
        >
          Generate
        </Button>
      </Box>
    </div>
  );
}

export default Homepage;
