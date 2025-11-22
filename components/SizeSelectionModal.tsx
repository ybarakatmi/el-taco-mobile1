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

interface SizeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  smallPrice?: number;
  mediumPrice?: number;
  largePrice?: number;
  imageURL?: string;
  onAdd: (size: 'small' | 'medium' | 'large', quantity: number, specialInstructions: string) => void;
}

export default function SizeSelectionModal({
  isOpen,
  onClose,
  itemName,
  smallPrice,
  mediumPrice,
  largePrice,
  imageURL,
  onAdd,
}: SizeSelectionModalProps) {
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>(() => {
    if (smallPrice) return 'small';
    if (mediumPrice) return 'medium';
    return 'large';
  });
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const getCurrentPrice = () => {
    switch (selectedSize) {
      case 'small':
        return smallPrice || 0;
      case 'medium':
        return mediumPrice || 0;
      case 'large':
        return largePrice || 0;
    }
  };

  const handleAdd = () => {
    onAdd(selectedSize, quantity, specialInstructions);
    // Reset and close
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
              <Text style={styles.title}>Choose Size</Text>
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
              </View>
            </View>

            {/* Size Selection */}
            <Text style={styles.sectionTitle}>Select Size</Text>
            <View style={styles.sizeOptions}>
              {smallPrice && smallPrice > 0 && (
                <TouchableOpacity
                  style={[
                    styles.sizeOption,
                    selectedSize === 'small' && styles.sizeOptionSelected,
                  ]}
                  onPress={() => setSelectedSize('small')}
                >
                  <Text
                    style={[
                      styles.sizeLabel,
                      selectedSize === 'small' && styles.sizeLabelSelected,
                    ]}
                  >
                    Small
                  </Text>
                  <Text
                    style={[
                      styles.sizePrice,
                      selectedSize === 'small' && styles.sizePriceSelected,
                    ]}
                  >
                    ${smallPrice.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              )}

              {mediumPrice && mediumPrice > 0 && (
                <TouchableOpacity
                  style={[
                    styles.sizeOption,
                    selectedSize === 'medium' && styles.sizeOptionSelected,
                  ]}
                  onPress={() => setSelectedSize('medium')}
                >
                  <Text
                    style={[
                      styles.sizeLabel,
                      selectedSize === 'medium' && styles.sizeLabelSelected,
                    ]}
                  >
                    Medium
                  </Text>
                  <Text
                    style={[
                      styles.sizePrice,
                      selectedSize === 'medium' && styles.sizePriceSelected,
                    ]}
                  >
                    ${mediumPrice.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              )}

              {largePrice && largePrice > 0 && (
                <TouchableOpacity
                  style={[
                    styles.sizeOption,
                    selectedSize === 'large' && styles.sizeOptionSelected,
                  ]}
                  onPress={() => setSelectedSize('large')}
                >
                  <Text
                    style={[
                      styles.sizeLabel,
                      selectedSize === 'large' && styles.sizeLabelSelected,
                    ]}
                  >
                    Large
                  </Text>
                  <Text
                    style={[
                      styles.sizePrice,
                      selectedSize === 'large' && styles.sizePriceSelected,
                    ]}
                  >
                    ${largePrice.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              )}
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
              placeholder="e.g., Extra cheese, no tomatoes..."
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
              <Text style={styles.totalPrice}>${(getCurrentPrice() * quantity).toFixed(2)}</Text>
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
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  sizeOptions: {
    gap: 8,
    marginBottom: 24,
  },
  sizeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  sizeOptionSelected: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  sizeLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  sizeLabelSelected: {
    color: '#dc2626',
    fontWeight: '600',
  },
  sizePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  sizePriceSelected: {
    color: '#dc2626',
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
