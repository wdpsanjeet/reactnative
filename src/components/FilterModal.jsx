import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Modal, Portal, Button, PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalDropdown from 'react-native-modal-dropdown';

const { width: screenWidth } = Dimensions.get('window');
const PARALLAX_SCALE = 0.9;
const PARALLAX_OPACITY = 0.5;
const ITEM_WIDTH = screenWidth;

let DateTimePicker = View;
try {
	DateTimePicker = require('@react-native-community/datetimepicker').default;
} catch (error) {
	console.log('DateTimePicker not available, using View as fallback');
}

const FilterModal = ({ matches, setFilterData, bottom }) => {
	const [visible, setVisible] = React.useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedTeam, setSelectedTeam] = useState('All Teams');
	const [selectedVenue, setSelectedVenue] = useState('All Venues');
	const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

	const containerStyle = { position: 'absolute', left: 0, bottom: bottom, marginVertical: 'auto', backgroundColor: 'white', padding: 20, height: 520, zIndex: 1000000, width: 365 };
	// const containerStyle = {backgroundColor: 'white', padding: 20,height:520,zIndex:1000000,width:365};
	const onDateChange = (event, selectedDate) => {
		setShowDatePicker(Platform.OS === 'ios');
		if (selectedDate) {
			setSelectedDate(selectedDate);
		}
	};
	const teams = ['All Teams', 'Mumbai Indians', 'Chennai Super Kings', 'Royal Challengers Bangalore', 'Kolkata Knight Riders', 'Delhi Capitals', 'Punjab Kings'];
	const venues = ['All Venues', 'Wankhede Stadium', 'M. Chinnaswamy Stadium', 'Eden Gardens', 'Arun Jaitley Stadium'];

	const handleFilter = () => {
		const year = selectedDate.getFullYear();
		const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
		const day = String(selectedDate.getDate()).padStart(2, '0');
		const formattedDate = `${year}-${month}-${day}`;
		const filteredMatches = matches.filter(match => {
			const matchesDate = selectedDate ?
				new Date(match.date).toDateString() === formattedDate : true;

			const matchesTeam = selectedTeam === 'All Teams' ||
				match.teamA === selectedTeam ||
				match.teamB === selectedTeam;

			const matchesVenue = selectedVenue === 'All Venues' ||
				match.venue.includes(selectedVenue);

			return matchesTeam && matchesVenue;
		});
		setFilterData(filteredMatches)
		hideModal()
	}
	return (
		<PaperProvider>
			<Portal>
				<Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
					<ScrollView style={{ flexDirection: 'column' }}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>Filter Matches</Text>
							<TouchableOpacity onPress={hideModal}>
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
								onSelect={(index, value) => { console.log(value); setSelectedTeam(value) }}
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
								onPress={handleFilter}
							>
								<Text style={styles.applyButtonText}>Apply Filters</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</Modal>
			</Portal>
			{/* <Button style={{marginTop: 30}} onPress={showModal}>
				Show
			</Button> */}
			<TouchableOpacity style={styles.filterButton} onPress={() => showModal()}>
				<Icon name="sliders" size={20} color="#fff" />
			</TouchableOpacity>
		</PaperProvider>
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
	// paddingVertical: 10,
	// backgroundColor: '#fff',
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
		maxHeight: '80%',
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
	dropdownContainer: {
		position: 'relative',
		zIndex: 1,
	},
	dropdownButton: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 5,
		padding: 12,
	},
	dropdownStyle:{
		width: '100%'
	},
	dropdownButtonText: {
		color: '#333',
		fontSize:15

	},
	dropdownOptions: {
		position: 'absolute',
		top: '100%',
		left: 0,
		right: 0,
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 5,
		marginTop: 5,
		maxHeight: 200

	},
	dropdownOption: {
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
		fontSize:15
	},
	dropdownTextStyle: {
		color: '#333',
		fontSize:15
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

	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'flex-end',
	},
	modalContainer: {
		backgroundColor: '#fff',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		maxHeight: '80%',
		paddingBottom: Platform.OS === 'ios' ? 30 : 20,
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#333',
	},
	modalContent: {
		paddingHorizontal: 20,
	},
	filterSection: {
		marginBottom: 20,
	},
	filterLabel: {
		fontSize: 16,
		color: '#666',
		marginBottom: 8,
		fontWeight: '500',
	},
	datePickerButton: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		padding: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	datePickerText: {
		fontSize: 16,
		color: '#333',
	},
	filterButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingTop: 15,
		borderTopWidth: 1,
		borderTopColor: '#eee',
	},
	resetButton: {
		flex: 1,
		backgroundColor: '#f5f5f5',
		padding: 14,
		borderRadius: 8,
		marginRight: 10,
		alignItems: 'center',
	},
	resetButtonText: {
		color: '#333',
		fontWeight: '500',
	},
	applyButton: {
		flex: 1,
		backgroundColor: '#1a3a5f',
		padding: 14,
		borderRadius: 8,
		alignItems: 'center',
	},
	applyButtonText: {
		color: '#fff',
		fontWeight: '500',
	},

	dropdownScroll: {
		flexGrow: 1,
	},
	dropdownListContainer: {
		zIndex: 9999, // Ensure dropdown appears above other elements
	},

});

export default FilterModal;
