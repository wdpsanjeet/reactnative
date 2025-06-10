import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Platform,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Dropdown = ({ 
  options, 
  selectedValue, 
  onSelect, 
  placeholder = "Select an option",
  style = {},
  dropdownStyle = {} 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 100, left: 0 });

  const measureDropdownPosition = (event) => {
    const { pageY, pageX, width } = event.nativeEvent;
    setDropdownPosition({
      top: pageY + (Platform.OS === 'android' ? 45 : 40), // Adjust based on your header height
      left: pageX,
      width: width
    });
    setIsOpen(!isOpen);
  };

  return (
    <View style={[styles.dropdownContainer, style]}>
      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={measureDropdownPosition}
        activeOpacity={0.8}
      >
        <Text style={styles.dropdownHeaderText}>
          {selectedValue || placeholder}
        </Text>
        <Icon 
          name={isOpen ? "angle-up" : "angle-down"} 
          size={20} 
          color="#555" 
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={[
            styles.dropdownListContainer, 
            { 
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width
            },
            dropdownStyle
          ]}>
            <ScrollView 
              style={styles.dropdownScroll}
              nestedScrollEnabled={true}
            >
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dropdownItem,
                    option === selectedValue && styles.selectedItem
                  ]}
                  onPress={() => {
                    onSelect(option);
                    setIsOpen(false);
                  }}
                  activeOpacity={0.6}
                >
                  <Text style={styles.dropdownItemText}>{option}</Text>
                  {option === selectedValue && (
                    <Icon name="check" size={16} color="#1a3a5f" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    position: 'relative',
    zIndex: 1,
    marginBottom: 15,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dropdownHeaderText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdownListContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownScroll: {
    flex: 1,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedItem: {
    backgroundColor: '#f5f9ff',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
});

export default Dropdown;