import React, { useState, useEffect, useRef } from 'react';
import {View,Text,StyleSheet,ScrollView,TouchableOpacity,Image,TextInput,FlatList,Dimensions,Platform,Modal,ActivityIndicator} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import Carousel from 'react-native-snap-carousel';
import DateTimePicker from '@react-native-community/datetimepicker';
import ModalDropdown from 'react-native-modal-dropdown';

const { width: screenWidth } = Dimensions.get('window');

const Home = () => {
    // const Home = ({ navigation }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [selectedVenue, setSelectedVenue] = useState('All Venues');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const carouselRef = useRef(null);

  // Sample data for matches
  const [matches, setMatches] = useState([
    {
      id: '1',
      teamA: 'Mumbai Indians',
      teamB: 'Chennai Super Kings',
      teamALogo: 'https://i.imgur.com/JRqkE5j.png',
      teamBLogo: 'https://i.imgur.com/3tG3QzC.png',
      date: '2023-04-10',
      time: '19:30',
      venue: 'Wankhede Stadium, Mumbai',
      isLive: true,
      ticketsAvailable: true,
    },
    {
      id: '2',
      teamA: 'Royal Challengers Bangalore',
      teamB: 'Kolkata Knight Riders',
      teamALogo: 'https://i.imgur.com/8bBwCg1.png',
      teamBLogo: 'https://i.imgur.com/4YQ2X9k.png',
      date: '2023-04-12',
      time: '15:30',
      venue: 'M. Chinnaswamy Stadium, Bangalore',
      isLive: false,
      ticketsAvailable: true,
    },
    // Add more matches as needed
  ]);

  // Get live matches for carousel
  const liveMatches = matches.filter(match => match.isLive);

  // Filter matches based on search and filters
  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.teamA.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         match.teamB.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         match.venue.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDate = selectedDate ? 
      new Date(match.date).toDateString() === selectedDate.toDateString() : true;
    
    const matchesTeam = selectedTeam === 'All Teams' || 
                       match.teamA === selectedTeam || 
                       match.teamB === selectedTeam;
    
    const matchesVenue = selectedVenue === 'All Venues' || 
                        match.venue.includes(selectedVenue);
    
    return matchesSearch && matchesDate && matchesTeam && matchesVenue;
  });

  // Teams list for dropdown
  const teams = ['All Teams', 'Mumbai Indians', 'Chennai Super Kings', 'Royal Challengers Bangalore', 'Kolkata Knight Riders'];

  // Venues list for dropdown
  const venues = ['All Venues', 'Wankhede Stadium', 'M. Chinnaswamy Stadium', 'Eden Gardens'];

  // Render carousel item
  const renderCarouselItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.carouselItem}
        // onPress={() => navigation.navigate('MatchDetail', { match: item })}
      >
        <View
          colors={['#1a3a5f', '#0a1f3a']}
          style={styles.carouselGradient}
        >
          <View style={styles.liveTag}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          
          <View style={styles.teamsContainer}>
            <View style={styles.teamContainer}>
              <Image source={{ uri: item.teamALogo }} style={styles.teamLogo} />
              <Text style={styles.teamName}>{item.teamA}</Text>
            </View>
            
            <View style={styles.vsContainer}>
              <Text style={styles.vsText}>VS</Text>
            </View>
            
            <View style={styles.teamContainer}>
              <Image source={{ uri: item.teamBLogo }} style={styles.teamLogo} />
              <Text style={styles.teamName}>{item.teamB}</Text>
            </View>
          </View>
          
          <View style={styles.matchInfo}>
            <Text style={styles.matchDetailText}>{item.date} • {item.time}</Text>
            <Text style={styles.matchDetailText}>{item.venue}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.bookButton}
            // onPress={() => navigation.navigate('Booking', { match: item })}
          >
            <Text style={styles.bookButtonText}>BOOK TICKETS</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Render match item for list
  const renderMatchItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.matchCard}
        // onPress={() => navigation.navigate('MatchDetail', { match: item })}
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
            <Image source={{ uri: item.teamALogo }} style={styles.teamLogoSmall} />
            <Text style={styles.teamNameSmall}>{item.teamA}</Text>
          </View>
          
          <Text style={styles.vsTextSmall}>VS</Text>
          
          <View style={styles.matchTeam}>
            <Image source={{ uri: item.teamBLogo }} style={styles.teamLogoSmall} />
            <Text style={styles.teamNameSmall}>{item.teamB}</Text>
          </View>
        </View>
        
        <Text style={styles.matchVenue}>{item.venue}</Text>
        
        {item.ticketsAvailable ? (
          <TouchableOpacity 
            style={styles.bookButtonSmall}
            // onPress={() => navigation.navigate('Booking', { match: item })}
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

  // Handle date change
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        colors={['#0a1f3a', '#1a3a5f']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>IPL 2023 Tickets</Text>
        <TouchableOpacity 
        // onPress={() => navigation.navigate('Profile')}
            >
          <Icon name="user-circle" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Live Matches Carousel */}
      {liveMatches.length > 0 && (
        <View style={styles.carouselContainer}>
          <Carousel
            ref={carouselRef}
            data={liveMatches}
            renderItem={renderCarouselItem}
            sliderWidth={screenWidth}
            itemWidth={screenWidth - 60}
            onSnapToItem={index => setActiveSlide(index)}
          />
          <View style={styles.pagination}>
            {liveMatches.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === activeSlide ? styles.paginationDotActive : null
                ]}
              />
            ))}
          </View>
        </View>
      )}

      {/* Search and Filter Section */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search matches..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setIsFilterModalVisible(true)}
        >
          <Icon name="sliders" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Matches</Text>
              <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
                <Icon name="times" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Date</Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.datePickerText}>
                  {selectedDate.toDateString()}
                </Text>
                <Icon name="calendar" size={18} color="#1a3a5f" />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Team</Text>
              <ModalDropdown
                options={teams}
                defaultValue={selectedTeam}
                onSelect={(index, value) => setSelectedTeam(value)}
                style={styles.dropdownButton}
                textStyle={styles.dropdownButtonText}
                dropdownStyle={styles.dropdownStyle}
                dropdownTextStyle={styles.dropdownTextStyle}
              />
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Venue</Text>
              <ModalDropdown
                options={venues}
                defaultValue={selectedVenue}
                onSelect={(index, value) => setSelectedVenue(value)}
                style={styles.dropdownButton}
                textStyle={styles.dropdownButtonText}
                dropdownStyle={styles.dropdownStyle}
                dropdownTextStyle={styles.dropdownTextStyle}
              />
            </View>
            
            <View style={styles.filterButtons}>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={() => {
                  setSelectedDate(new Date());
                  setSelectedTeam('All Teams');
                  setSelectedVenue('All Venues');
                }}
              >
                <Text style={styles.resetButtonText}>Reset Filters</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={() => setIsFilterModalVisible(false)}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Matches List */}
      <FlatList
        data={filteredMatches}
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
    </View>
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
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  carouselContainer: {
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
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
    marginVertical: 15,
  },
  teamContainer: {
    alignItems: 'center',
    flex: 1,
  },
  teamLogo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  teamName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  vsContainer: {
    width: 50,
    alignItems: 'center',
  },
  vsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  matchInfo: {
    alignItems: 'center',
  },
  matchDetailText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 3,
  },
  bookButton: {
    backgroundColor: '#ff8a00',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
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
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a3a5f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
  },
  datePickerText: {
    color: '#333',
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
  },
  dropdownButtonText: {
    color: '#333',
  },
  dropdownStyle: {
    marginTop: 10,
    width: '100%',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdownTextStyle: {
    padding: 10,
    color: '#333',
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#333',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#1a3a5f',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
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
});

export default Home;