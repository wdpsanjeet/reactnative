import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList, Dimensions, Platform, Modal, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Dropdown from '../components/DropDown';
import Carousel from 'react-native-reanimated-carousel';
// import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { interpolate, runOnJS } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import ModalDropdown from 'react-native-modal-dropdown';
import FilterModal from '../components/FilterModal';
import { useSharedValue, useAnimatedStyle, withSpring, withTiming, withRepeat, Easing } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');
const PARALLAX_SCALE = 0.9;
const PARALLAX_OPACITY = 0.5;
const ITEM_WIDTH = screenWidth;


// Component fallbacks
let LinearGradientComponent = View;
try {
  const LinearGradient = require('react-native-linear-gradient').default;
  LinearGradientComponent = LinearGradient;
} catch (error) {
  console.log('LinearGradient not available, using View as fallback');
}

let DateTimePicker = View;
try {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
} catch (error) {
  console.log('DateTimePicker not available, using View as fallback');
}

// const { width: screenWidth } = Dimensions.get('window');

const Matches = ({ navigation }) => {
  // Sample match data
  const matches = [
    {
      id: '1',
      teamA: 'Mumbai Indians',
      teamB: 'Chennai Super Kings',
      teamALogo: 'mi',
      teamBLogo: 'csk',
      date: '2025-05-16',
      time: '19:30',
      venue: 'Wankhede Stadium, Mumbai',
      isLive: true,
      ticketsAvailable: true,
    },
    {
      id: '2',
      teamA: 'Royal Challengers Bangalore',
      teamB: 'Kolkata Knight Riders',
      teamALogo: 'rcb',
      teamBLogo: 'kkr',
      date: '2025-05-16',
      time: '15:30',
      venue: 'M. Chinnaswamy Stadium, Bangalore',
      isLive: false,
      ticketsAvailable: true,
    },
    {
      id: '3',
      teamA: 'Delhi Capitals',
      teamB: 'Punjab Kings',
      teamALogo: 'dc',
      teamBLogo: 'kp',
      date: '2025-05-17',
      time: '19:30',
      venue: 'Arun Jaitley Stadium, Delhi',
      isLive: true,
      ticketsAvailable: false,
    },
  ];
  const [loading, setLoading] = useState(true);
  const isUnmounted = useRef(false);
  const [data, setData] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [selectedVenue, setSelectedVenue] = useState('All Venues');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filterData, setFilterData] = useState(matches);
  const carouselRef = useRef(null);

  useEffect(() => {
    isUnmounted.current = false; // Set to false when component mounts

    const unsubscribe = navigation.addListener("focus", () => {
      // check api to merge
      if (!isUnmounted.current) {
        fetchData();
      }
      if (!data && !loading) {
        fetchData();
      }
    });

    // Cleanup function: This runs when the component unmounts
    return () => {
      isUnmounted.current = true; // Set to true when component unmounts
      unsubscribe(); // Clean up the listener
    };
  }, []);
  const fetchData = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/wdpsanjeet/reactnative/refs/heads/main/data.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      setData(json)
      setLoading(false)
      // console.log(json)
    } catch (error) {
      //  setError(error);
    } finally {
      setLoading(false);
    }
  };

  const images = {
    'mi': require('../assets/mi.png'),
    'csk': require('../assets/csk.png'),
    'srh': require('../assets/srh.png'),
    'kp': require('../assets/kp.png'),
    'gt': require('../assets/gt.png'),
    'kkr': require('../assets/kkr.png'),
    'dc': require('../assets/dc.png'),
    'lsg': require('../assets/lsg.png'),
    'rcb': require('../assets/rcb.png'),
    'rr': require('../assets/rr.png'),
  };
  // Get live matches for carousel
  const liveMatches = matches.filter(match => match.isLive);

  const handleSearch = (text) => {
    console.log(text)
    setSearchQuery(text);
    if (text.length > 2) {
      const filteredMatches = data.filter(match => {
        const matchesSearch = match.teamA.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.teamB.toLowerCase().includes(searchQuery.toLowerCase()) ||
          match.venue.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
      });
      setFilterData(filteredMatches)
    } else {
      setFilterData(data)
    }
  }

  // Teams and venues for dropdowns
  const teams = ['All Teams', 'Mumbai Indians', 'Chennai Super Kings', 'Royal Challengers Bangalore', 'Kolkata Knight Riders', 'Delhi Capitals', 'Punjab Kings'];
  const venues = ['All Venues', 'Wankhede Stadium', 'M. Chinnaswamy Stadium', 'Eden Gardens', 'Arun Jaitley Stadium'];

  // Using shared value for animation
  const translateX = useSharedValue(0);

  // Start animation (could be in useEffect or onPress)
  React.useEffect(() => {
    translateX.value = withRepeat(
      withTiming(30, {
        duration: 2000,
        easing: Easing.inOut(Easing.quad)
      }),
      -1, // infinite repeat
      true // reverse the animation
    );
  }, []);

  // Render match item for list
  const renderMatchItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.matchCard}
        onPress={() => navigation.navigate('Booking', { match: item })}
      >
        <View style={styles.matchHeader}>
          <Text style={styles.matchDate}>{item.date} • {item.time}</Text>
          {item.isLive && (
            <View style={styles.liveTagSmall}>
              <View style={styles.liveDotSmall} />
              <Text style={styles.liveTextSmall}>LIVE</Text>
            </View>
          )}
        </View>

        <View style={styles.matchTeams}>
          <View style={styles.matchTeam}>
            <Image
              source={images[item.teamALogo]}
              style={styles.teamLogoSmall}
              defaultSource={require('../assets/ipl-logo.png')}
            />
            <Text style={styles.teamNameSmall}>{item.teamA}</Text>
          </View>

          <Text style={styles.vsTextSmall}>VS</Text>

          <View style={styles.matchTeam}>
            <Image
              source={images[item.teamBLogo]}
              style={styles.teamLogoSmall}
              defaultSource={require('../assets/ipl-logo.png')}
            />
            <Text style={styles.teamNameSmall}>{item.teamB}</Text>
          </View>
        </View>

        <Text style={styles.matchVenue}>{item.venue}</Text>

        {item.ticketsAvailable ? (
          <TouchableOpacity
            style={styles.bookButtonSmall}
            onPress={() => navigation.navigate('Booking', { match: item })}
          >
            <Text style={styles.bookButtonTextSmall}>Book Now</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.soldOutButton}>
            <Text style={styles.soldOutText}>Sold Out</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {data ? <>
        {/* Header */}
        <LinearGradientComponent
          colors={['#0a1f3a', '#1a3a5f']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>IPL 2025 Tickets</Text>
        </LinearGradientComponent>


        {/* Search and Filter Section */}
        <View style={styles.searchContainer}>
          <View>
            <FilterModal matches={data} setFilterData={setFilterData} bottom='-550' />
          </View>
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search matches..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={(text) => handleSearch(text)}
            />
            <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
          </View>
        </View>

        {/* Matches List */}
        <FlatList
          data={filterData}
          renderItem={renderMatchItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.matchesList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="frown-o" size={50} color="#999" />
              <Text style={styles.emptyText}>No matches found</Text>
              <Text style={styles.emptySubText}>Try adjusting your filters</Text>
            </View>
          }
        />
      </>
        :
        <View style={{flex:1,justifyContent:'center'}}>
          <ActivityIndicator size="large" />
        </View>
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  // carouselContainer: {
  //   paddingVertical: 10,
  //   backgroundColor: '#fff',
  // },
  carouselItem: {
    borderRadius: 10,
    overflow: 'hidden',
    height: 220,
    marginHorizontal: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  carouselGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  liveTag: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4757',
    marginRight: 5,
  },
  liveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  teamContainer: {
    alignItems: 'center',
    flex: 1,
    width: 150,
    marginBottom: -2
  },
  teamLogo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 2,
  },
  teamName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  vsContainer: {
    width: 30,
    alignItems: 'center',
  },
  vsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  matchInfo: {
    alignItems: 'center',
    marginTop: 15
  },
  matchDetailText: {
    color: '#fff',
    fontSize: 14,
    // marginBottom: 3,
    marginTop: 5
  },
  bookButton: {
    backgroundColor: '#ff8a00',
    paddingVertical: 5,
    width: 150,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 5,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: '#1a3a5f',
  },
  searchContainer: {
    zIndex: 1,
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBox: {
    zIndex: -1,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginRight: 10,
  },
  searchIcon: {
    zIndex: 0,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    zIndex: 0,
    height: 40,
    color: '#333',
  },
  matchesList: {
    padding: 15,
  },
  matchCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  matchDate: {
    color: '#666',
    fontSize: 14,
  },
  liveTagSmall: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignItems: 'center',
  },
  liveDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff4757',
    marginRight: 5,
  },
  liveTextSmall: {
    color: '#ff4757',
    fontSize: 10,
    fontWeight: 'bold',
  },
  matchTeams: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  matchTeam: {
    flex: 1,
    alignItems: 'center',
  },
  teamLogoSmall: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  teamNameSmall: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  vsTextSmall: {
    color: '#999',
    fontSize: 14,
  },
  matchVenue: {
    color: '#666',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 15,
  },
  bookButtonSmall: {
    backgroundColor: '#1a3a5f',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  bookButtonTextSmall: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  soldOutButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  soldOutText: {
    color: '#999',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 15,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  carouselContainer: {
    height: ITEM_WIDTH * 0.55, // Adjust based on your item height
    marginVertical: 1,
  },
  carouselItem: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 20,
    overflow: 'hidden',
  },
  carouselGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
});

export default Matches;