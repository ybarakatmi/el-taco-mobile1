import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { X, Plus, Minus } from 'lucide-react-native';
import { MEAT_OPTIONS } from '../utils/menuService';

interface MeatSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  price: number;
  imageURL?: string;
  onAdd: (meat: string, quantity: number, specialInstructions: string) => void;
}

export default function MeatSelectionModal({
  isOpen,
  onClose,
  itemName,
  price,
  imageURL,
  onAdd,
}: MeatSelectionModalProps) {
  const [selectedMeat, setSelectedMeat] = useState(MEAT_OPTIONS[0].value);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleAdd = () => {
    onAdd(selectedMeat, quantity, specialInstructions);
    // Reset and close
    setSelectedMeat(MEAT_OPTIONS[0].value);
    setQuantity(1);
    setSpecialInstructions('');
    onClose();
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>Choose Your Meat</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X color="#6b7280" size={24} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.content}>
            {/* Item Info */}
            <View style={styles.itemInfo}>
              {imageURL && (
                <Image source={{ uri: imageURL }} style={styles.image} resizeMode="cover" />
              )}
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{itemName}</Text>
                <Text style={styles.itemPrice}>${price.toFixed(2)}</Text>
              </View>
            </View>

            {/* Meat Selection */}
            <Text style={styles.sectionTitle}>Select Meat</Text>
            <View style={styles.meatOptions}>
              {MEAT_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.meatOption,
                    selectedMeat === option.value && styles.meatOptionSelected,
                  ]}
                  onPress={() => setSelectedMeat(option.value)}
                >
                  <Text
                    style={[
                      styles.meatOptionText,
                      selectedMeat === option.value && styles.meatOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Quantity */}
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity style={styles.quantityButton} onPress={decrementQuantity}>
                <Minus color="#6b7280" size={20} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={incrementQuantity}>
                <Plus color="#6b7280" size={20} />
              </TouchableOpacity>
            </View>

            {/* Special Instructions */}
            <Text style={styles.sectionTitle}>Special Instructions (Optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Extra sauce, no onions..."
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalPrice}>${(price * quantity).toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  itemInfo: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  meatOptions: {
    gap: 8,
    marginBottom: 24,
  },
  meatOption: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  meatOptionSelected: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  meatOptionText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  meatOptionTextSelected: {
    color: '#dc2626',
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 24,
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    minWidth: 40,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 80,
    marginBottom: 24,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  addButton: {
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
