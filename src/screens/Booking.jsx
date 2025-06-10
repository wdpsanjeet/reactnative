import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';

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
// Dummy Data - Replace with your actual match details
const matchDetails = {
  teamALogo: require('../assets/csk.png'), // Replace with actual paths
  teamA: 'Chennai Super Kings',
  teamBLogo: require('../assets/mi.png'), // Replace with actual paths
  teamB: 'Mumbai Indians',
  venue: 'Wankhede Stadium, Mumbai',
  dateTime: 'April 27, 2025, 7:30 PM IST',
};

// Dummy Ticket Price Data - Replace with your actual pricing structure
const ticketPrices = [
  { category: 'General', price: 1500, color: '#f0da81' },
  { category: 'Premium', price: 2500, color: '#c5e884' },
  { category: 'VIP', price: 5000, color: '#75ebbc' },
  { category: 'Hospitality', price: 8000, color: '#603cf0' },
];

const offers = [
  { id: 'OFFER10', description: '10% off on first booking!' },
  { id: 'COMBO2', description: 'Book 2 tickets and get 5% off.' },
];

const paymentOptions = ['UPI', 'Credit/Debit Card', 'Net Banking', 'Wallet'];

const Booking = (props) => {
 const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [promoCode, setPromoCode] = useState('');
  const [appliedOffer, setAppliedOffer] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const incrementQuantity = () => {
    // console.log(data)
    console.log(props.route.params.match)

    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const applyPromoCode = () => {
    const validOffer = offers.find((offer) => offer.id.toLowerCase() === promoCode.toLowerCase());
    if (validOffer) {
      setAppliedOffer(validOffer);
      // Implement actual discount logic here based on the offer ID
      alert(`Promo code "${validOffer.id}" applied: ${validOffer.description}`);
    } else {
      alert('Invalid promo code.');
      setAppliedOffer(null);
    }
  };

  const calculateTotalPrice = () => {
    if (selectedCategory) {
      let basePrice = ticketPrices.find((t) => t.category === selectedCategory)?.price || 0;
      let totalPrice = basePrice * quantity;

      if (appliedOffer && appliedOffer.id === 'OFFER10') {
        totalPrice *= 0.9; // 10% off
      } else if (appliedOffer && appliedOffer.id === 'COMBO2' && quantity >= 2) {
        totalPrice *= 0.95; // 5% off
      }

      return totalPrice.toFixed(2);
    }
    return 'Select Ticket';
  };

  const handlePayment = (paymentMethod) => {
    if (selectedCategory && quantity > 0) {
      const totalPrice = calculateTotalPrice();
      alert(`Proceeding to pay ₹${totalPrice} via ${paymentMethod}`);
      // Navigate to payment gateway or confirmation page
      // navigation.navigate('PaymentGateway', { totalPrice, paymentMethod });
    } else {
      alert('Please select a ticket category and quantity.');
    }
  };
  useFocusEffect(
    useCallback(() => {
      // Reset data when screen comes into focus
      if (props.route.params?.match) {
        console.log(props.route.params.key)
        setData(props.route.params.match)
        setLoading(false)
      }
      
      return () => {
        // Optional cleanup
      };
    }, [props.route.params])
  );

  if (loading) return <Text>Loading</Text>
  else return (
    <ScrollView style={styles.container}>
      {/* Match Details Section */}
      <View style={styles.matchDetailsCard}>
        <View style={styles.teamsContainer}>
          <View style={styles.team}>
            <Image source={images[data.teamALogo]} style={styles.teamLogo} />
            <Text style={styles.teamName}>{data.teamA}</Text>
          </View>
          <Text style={styles.vsText}>VS</Text>
          <View style={styles.team}>
            <Image source={images[data.teamBLogo]} style={styles.teamLogo} />
            <Text style={styles.teamName}>{data.teamB}</Text>
          </View>
        </View>
        <Text style={styles.venue}>{data.venue}</Text>
        <Text style={styles.dateTime}>{data.dateTime}</Text>
      </View>

      {/* Ticket Price & Selection */}
      <View style={styles.ticketSelectionCard}>
        <Text style={styles.sectionTitle}>Select Your Tickets</Text>
        {ticketPrices.map((ticket) => (
          <TouchableOpacity
            key={ticket.category}
            style={[
              styles.ticketCategory,
              selectedCategory === ticket.category && styles.selectedCategory,
              { backgroundColor: ticket.color }
            ]}
            onPress={() => handleCategorySelect(ticket.category)}
          >
            <Text style={styles.ticketCategoryName}>{ticket.category}</Text>
            <Text style={styles.ticketPrice}>₹{ticket.price}</Text>
          </TouchableOpacity>
        ))}

        {selectedCategory && (
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity style={styles.quantityButton} onPress={decrementQuantity}>
                <Text>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={incrementQuantity}>
                <Text>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Offers & Promo Code */}
      <View style={styles.offersCard}>
        <Text style={styles.sectionTitle}>Offers & Promo Codes</Text>
        {offers.map((offer) => (
          <Text key={offer.id} style={styles.offerText}>
            {offer.description} (Code: {offer.id})
          </Text>
        ))}
        <View style={styles.promoCodeInputContainer}>
          <TextInput
            style={styles.promoCodeInput}
            placeholder="Enter Promo Code"
            value={promoCode}
            onChangeText={setPromoCode}
          />
          <TouchableOpacity style={styles.applyButton} onPress={applyPromoCode}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
        {appliedOffer && (
          <Text style={styles.appliedOfferText}>Applied: {appliedOffer.description}</Text>
        )}
      </View>

      {/* Total Price */}
      <View style={styles.totalPriceCard}>
        <Text style={styles.totalPriceLabel}>Total:</Text>
        <Text style={styles.totalPriceAmount}>₹{calculateTotalPrice()}</Text>
      </View>

      {/* Payment Options */}
      <View style={styles.paymentOptionsCard}>
        <Text style={styles.sectionTitle}>Payment Options</Text>
        {paymentOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.paymentOptionButton}
            onPress={() => handlePayment(option)}
          >
            <Text style={styles.paymentOptionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 15,
  },
  matchDetailsCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  team: {
    flex: 7,
    alignItems: 'center',
    // maxWidth:155
  },
  teamLogo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  teamName: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  vsText: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#777',
  },
  venue: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 5,
  },
  dateTime: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  ticketSelectionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ticketCategory: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    marginVertical: 2
  },
  selectedCategory: {
    borderColor: '#f03c6f',
    borderWidth: 1,
  },
  ticketCategoryName: {
    fontSize: 16,
    color: '#333',
  },
  ticketPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue', // Assuming you have a 'blue' constant
  },
  quantityContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityLabel: {
    fontSize: 16,
    color: '#333',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 8,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  offersCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  offerText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  promoCodeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  promoCodeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
  },
  applyButton: {
    backgroundColor: 'blue',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  appliedOfferText: {
    marginTop: 10,
    color: 'green',
    fontWeight: 'bold',
  },
  totalPriceCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  totalPriceLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  totalPriceAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'blue',
  },
  paymentOptionsCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentOptionButton: {
    backgroundColor: 'blue',
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  paymentOptionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Booking;