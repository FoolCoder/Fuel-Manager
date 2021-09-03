import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Animated,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
  PermissionsAndroid,

} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { link, apikey } from './links/links'
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Geocoder from 'react-native-geocoding';
import { markers, mapDarkStyle, mapStandardStyle } from './mapData';
import StarRating from './StarRating';
import { useTheme } from '@react-navigation/native';
import { AuthContext } from '../authcontext/authcontext'
import RNGooglePlaces from 'react-native-google-places';
import { totalSize } from 'react-native-dimension'
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from 'react-native-geolocation-service';
import Group6896 from '../../traffic/assets/Group6896.png'
import Group6895 from '../../traffic/assets/Group6895.png'
import t2 from '../../figmathings/Group6900.png'
//  './figmathings/Group6900.png'
import arow from '../../figmathings/arow.png'
import AsyncStorage from '@react-native-async-storage/async-storage';

// const origin = { latitude: 33.6844, longitude: 73.0479 };
// const destination = { latitude: 33.6844, longitude: 73.0479 };

let v = '';
const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 180;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const GOOGLE_MAPS_APIKEY = "AIzaSyDZfZmOL5uAAX2ZFTlbi458oQGKNrkKZZ0";

let RE = true

const ExploreScreen = () => {
  const [n, setn] = useState(false)
  const [start, setstart] = useState(false)
  const [btnflag, setbtnflag] = useState(false)
  const [lat, setlat] = useState(LATITUDE)
  const [lon, setlon] = useState(LONGITUDE)
  const [speed, setspeed] = useState(0)
  const [Price, setprice] = useState(0)
  const [modal, setmodal] = useState(false)
  const [placename, setplacename] = useState('Search')
  const [cord, setcord] = useState({
    Lat: 0,
    Lon: 0,
    image: ''
  })
  const [origin, setOrigin] = useState({
    latitude: 52.3500, longitude: 4.9166
  })
  const [destination, setDestination] = useState(null)
  const [marginBottom, setmaarginBottom] = useState(1)
  const { logout } = useContext(AuthContext)
  const theme = useTheme();
  const _map = React.useRef(null);
  const _scrollView = React.useRef(null);



  const initialMapState = {
    markers,
    categories: [
      {
        name: 'Gas Station',
        icon: <MaterialCommunityIcons name="gas-station" style={styles.chipsIcon} size={18} />,
      },
    ],
    region: {
      latitude: 52.3500,
      longitude: 4.9166,
      latitudeDelta: 0.04864195044303443,
      longitudeDelta: 0.040142817690068,
    },
  };

  const [state, setState] = useState(initialMapState);

  let mapIndex = 0;
  let mapAnimation = new Animated.Value(0);

  useEffect(() => {
    Geolocation.getCurrentPosition(info => {
      console.log("info", info.coords)
      setOrigin(info.coords)
    },
      error => {
        console.log(error)
      });
  }, [])

  useEffect(() => {

    calspeed()

    Geocoder.init(GOOGLE_MAPS_APIKEY);
    // _Geocoding()
    mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= state.markers.length) {
        index = state.markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(regionTimeout);

      const regionTimeout = setTimeout(() => {
        if (mapIndex !== index) {
          mapIndex = index;
          const { coordinate } = state.markers[index];
          _map.current.animateToRegion(
            {
              ...coordinate,
              latitudeDelta: state.region.latitudeDelta,
              longitudeDelta: state.region.longitudeDelta,
            },
            350
          );
          setOrigin(coordinate)
        }
      }, 10);

    });

  });


  const colorpick = btnflag => {
    if (!btnflag)
      return '#5ded09'
    else
      return '#f20a0a'
  }

  const calspeed = async () => {
    let array = []
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.watchPosition((pos) => {

          console.log("pos", pos.coords.speed)

          setspeed((pos.coords.speed * 3.6).toFixed(0))

          array.push(pos.coords)

          AsyncStorage.setItem("logs", array);

          _map.current.animateToRegion({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            nameee: pos.coords.heading,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,

          }, 1500)

          setTimeout(() => {
            calspeed()
          }, 2000);

          setlat(pos.coords.latitude)
          setlon(pos.coords.longitude)
          if (speed <= 0) {
            _Geocoding(lat, lon)
          }

        }, (err) => {
          console.log(err);
          alert("turn on current location")
        })

      }
      else {
        console.log("Location permission denied");
      }

    }

    catch (e) {
      console.log(e)
    }

  }

  const interpolations = state.markers.map((marker, index) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      ((index + 1) * CARD_WIDTH),
    ];

    const scale = mapAnimation.interpolate({
      inputRange,
      outputRange: [1, 1.5, 1],
      extrapolate: "clamp"
    });

    return { scale };
  });

  const onMarkerPress = (mapEventData, coordinate) => {
    const markerID = mapEventData._targetInst.return.key;

    console.log("coordinates", coordinate.latitude)

    let x = (markerID * CARD_WIDTH) + (markerID * 20);
    if (Platform.OS === 'ios') {
      x = x - SPACING_FOR_CARD_INSET;
    }
    _scrollView.current.scrollTo({ x: x, y: 0, animated: true });
    // destination.latitude = coordinate.latitude
    // destination.longitude = coordinate.longitude
    setDestination(coordinate)
    // setDestination(destination.latitude = coordinate.latitude, destination.longitude = coordinate.longitude)
  }


  const animatetocord = (Lat, Lon) => {
    console.log("Lat ", Lat);
    console.log("Lon ", Lon);

    _map.current.animateToRegion({
      latitude: Lat,
      longitude: Lon,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    }, 1500)
  }

  const GooglePlacesInput = () => {
    RNGooglePlaces.openAutocompleteModal({
      useOverlay: true,
      type: 'establishment',
      initialQuery: 'Gas Station',
      // country: 'NL'
    })
      .then((place) => {
        console.log(place.name);
        animatetocord(place.location.latitude, place.location.longitude)
        setcord({ Lat: place.location.latitude, Lon: place.location.longitude })
        return setplacename(place.name)
        // setcord(place.location.latitude, place.location.longitude)
      })
      .catch(error => console.log(error.message));  // error is a Javascript Error object
  }

  const _Geocoding = (lat, lon) => {

    Geocoder.from(lat, lon)
      .then(json => {
        var addressComponent = json.results[0].address_components[0];
        console.log(addressComponent);
      })
      .catch(error => console.warn(error));

  }
  return (


    <View style={styles.container}>
      <MapView
        ref={_map}
        initialRegion={state.region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}

        onMapReady={() => {
          setmaarginBottom(0)
        }}
        style={[styles.container, { marginBottom: marginBottom }]}
        provider={PROVIDER_GOOGLE}
        customMapStyle={theme.dark ? mapDarkStyle : mapStandardStyle}

      >
        {destination != null ?
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={5}
            strokeColor="#00FFFF"
          />
          :
          null}
        {markers.map((marker, index) => {

          const scaleStyle = {
            transform: [
              {
                scale: interpolations[index].scale,
              },
            ],
          };
          {
            return (
              n === 1 ?
                <MapView.Marker key={index} coordinate={marker.coordinate} onPress={(e) => onMarkerPress(e, marker.coordinate)}>
                  <Animated.View style={[styles.markerWrap]}>
                    <Animated.Image
                      source={require('../../assets/marker.png')}
                      style={[styles.marker, scaleStyle]}
                      resizeMode="cover"
                    />
                  </Animated.View>
                </MapView.Marker>
                :
                null
            )
          }
        })}
        {
          cord == null ?
            null
            :
            <Marker

              // key={index}
              coordinate={{
                latitude: cord.Lat,
                longitude: cord.Lon
              }}
              image={require('../../assets/marker.png')}
            />
        }
      </MapView>

      <View style={{
        position: 'absolute',
        marginTop: Platform.OS === 'ios' ? 40 : 8,
        flexDirection: "row",
        width: '73%',
        borderRadius: 5,
        justifyContent: 'space-between',
        zIndex: 1,
        alignSelf: 'center',
        // borderWidth: 1,
        paddingRight: 5

      }}>

        <TouchableOpacity
          style={{
            left: 0,

          }}
          onPress={() => {
            // alert('gcgc')
            setmodal(true)

          }}  >
          <Image
            style={{
              width: 45,
              height: 45,


            }} source={t2} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: '80%',
            justifyContent: 'space-between',
            paddingLeft: '3%',
            paddingRight: '3%',
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() =>
            GooglePlacesInput(placename)
          }
        >
          <Text
            numberOfLines={1}
            style={{
              fontSize: totalSize(1.8),

              width: '90%'
            }}>{placename}</Text>
          <Ionicons

            name="ios-search" size={20} />
        </TouchableOpacity>

      </View>

      {
        start ?
          <View style={{
            height: '16%', width: '90%',
            bottom: '5%', alignSelf: 'center',
            position: 'absolute', zIndex: 1
            , backgroundColor: '#ffffff',
            borderRadius: 15,
            justifyContent: 'center', alignItems: 'center',

          }}>
            <Image style={{
              width: 50,
              height: 35,
              resizeMode: 'contain',
              justifyContent: 'center',
            }} source={speed === 0 ? Group6896 : Group6895} />

            <Text style={{
              marginVertical: '2%',
              fontSize: totalSize(1.5)
            }}>
              {speed}KM
            </Text>
            {
              speed === 0 ?

                <Text style={{
                  fontSize: totalSize(1.5),
                  fontWeight: 'bold'
                }}>
                  You are not DRIVING
                </Text>
                :
                <Text style={{
                  fontSize: totalSize(1.5),
                  fontWeight: 'bold'
                }}>
                  Safe driving
                </Text>
            }
          </View>
          :
          null

      }
      <ScrollView
        horizontal
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        height={50}
        style={styles.chipsScrollView}
        contentInset={{ // iOS only
          top: 0,
          left: 0,
          bottom: 0,
          right: 20
        }}
        contentContainerStyle={{
          paddingRight: Platform.OS === 'android' ? 20 : 0
        }}
      >
        {state.categories.map((category, index) => (

          <TouchableOpacity key={index} style={styles.chipsItem}
            onPress={() => {

              if (category.name === 'Gas Station') {
                // return setState(category.name)
                setn(!n);
              }


            }}
          >
            {category.icon}
            <Text>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Animated.ScrollView
        ref={_scrollView}
        horizontal
        pagingEnabled
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 20}
        snapToAlignment="center"
        style={styles.scrollView}
        contentInset={{
          top: 0,
          left: SPACING_FOR_CARD_INSET,
          bottom: 0,
          right: SPACING_FOR_CARD_INSET
        }}
        contentContainerStyle={{
          paddingHorizontal: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0
        }}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: mapAnimation,
                }
              },
            },
          ],
          { useNativeDriver: true }
        )}
      >
        {state.markers.map((marker, index) => {
          {
            return (
              n == 1 ?
                <View style={styles.card} key={index}>
                  <Image
                    source={marker.image}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  <View style={styles.textContent}>
                    <Text numberOfLines={1} style={styles.cardtitle}>{marker.title}</Text>
                    <StarRating ratings={marker.rating} reviews={marker.reviews} />
                    <Text numberOfLines={1} style={styles.cardDescription}>{marker.description}</Text>
                  </View>
                </View>
                :
                null
            )
          }

        })}
      </Animated.ScrollView>

      {/* Modal here */}

      <Modal
        transparent={true}
        visible={modal}
        animationType='slide'

      >

        <View

          style={{
            flex: 1,

            height: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#FFFFFF'

          }} >

          <View style={{
            flexDirection: 'row',
            width: '90%',
            marginTop: '5%',
            alignItems: 'center',
            alignSelf: 'center',

          }}>
            <TouchableOpacity onPress={() => {
              setmodal(false)
              setprice(0)
            }}>
              <Image
                style={{
                  width: 20, height: 20
                }} source={arow} />
            </TouchableOpacity>
            <Text style={{
              fontSize: totalSize(3),
              marginLeft: '3%'
            }}>
              Setting
            </Text>
          </View>


          <View style={{
            height: '0.2%',
            backgroundColor: '#000',
            width: '90%',
            alignSelf: 'center',
            marginTop: '4%'
          }} />



          <Text
            style={{
              width: '90%',
              alignSelf: 'center',
              marginTop: '3%',
              fontSize: totalSize(2)
            }}
          >
            Calculator
          </Text>
          <View style={{
            height: '0.2%',
            backgroundColor: '#000',
            width: '90%',
            alignSelf: 'center',
            marginTop: '4%'
          }} />
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: '4%',


            }}
          >
            <Text>
              Liters
            </Text>

            <View
              style={{
                width: '25%',
                height: totalSize(4.5),
                borderWidth: 1,

                justifyContent: 'center',
                alignItems: 'center'

              }}
            >

              <TextInput
                style={{
                  fontSize: totalSize(1.5),
                  padding: 0,
                  color: 'black'
                }}
                keyboardType={'numeric'}
                onChangeText={(val) => {
                  setprice(val * 110)
                }}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: '4%',
              alignItems: 'center',
              width: '90%',
              alignSelf: 'center'

            }}
          >
            <Text>
              Price
            </Text>


            <View style={{
              fontSize: totalSize(1.5),
              height: totalSize(3.5),
              width: '25%',
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'

            }}>
              <Text style={{

                fontSize: totalSize(1.7),


              }}>
                {Price}
              </Text>
            </View>


          </View>

          <TouchableOpacity
            onPress={() => {
              setbtnflag(!btnflag)
              setstart(!start)
            }}
            style={{
              width: '30%',
              height: '5%',
              borderRadius: 25,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colorpick(btnflag),

              alignSelf: 'center'
            }} >
            {
              !btnflag ?
                <Text>
                  Start
                </Text>
                :
                <Text>
                  Stop
                </Text>
            }

          </TouchableOpacity>
          <Text style={{
            marginLeft: '3%'
          }} onPress={async () => {
            RE = false
            setTimeout(async () => {
              logout()
              await AsyncStorage.clear()
            }, 1000);
          }}>
            Sign out
          </Text>

        </View>



      </Modal>

    </View >
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBox: {
    position: 'absolute',
    marginTop: Platform.OS === 'ios' ? 40 : 20,
    flexDirection: "row",
    backgroundColor: '#fff',
    width: '85%',
    alignSelf: 'center',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  chipsScrollView: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 90 : 70,
    paddingHorizontal: 10
  },
  chipsIcon: {
    marginRight: 5,
  },
  chipsItem: {
    flexDirection: "row",
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    height: 35,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  scrollView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    // padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardtitle: {
    fontSize: 12,
    // marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  marker: {
    width: 30,
    height: 30,
  },
  button: {
    alignItems: 'center',
    marginTop: 5
  },
  signIn: {
    width: '100%',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3
  },
  textSign: {
    fontSize: 14,
    fontWeight: 'bold'
  }
});
