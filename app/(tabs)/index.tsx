import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { Search, RefreshCw } from 'lucide-react-native';
import { fetchMenu, MenuItem, clearMenuCache } from '../../utils/menuService';
import { useCart } from '../../contexts/CartContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import MeatSelectionModal from '../../components/MeatSelectionModal';
import SizeSelectionModal from '../../components/SizeSelectionModal';
import Toast from '../../components/Toast';

const CATEGORIES = [
  'All',
  'Tacos',
  'Burritos',
  'Quesadillas',
  'Specials',
  'Sandwiches',
  'Nachos/Fries',
  'Soups',
  'Lunch Specials',
  'Sides',
  'Drinks',
  'Sweets',
  'Corn',
];

export default function MenuScreen() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [meatModalOpen, setMeatModalOpen] = useState(false);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const { addToCart } = useCart();

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchMenu();
      setMenu(data);
    } catch (err) {
      setError('Unable to load menu. Please try again.');
      console.error('Menu fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await clearMenuCache();
    await loadMenu();
    setRefreshing(false);
    showToast('Menu refreshed', 'info');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const handleAddToCart = (item: MenuItem) => {
    const needsMeatSelection = item.MeatChoice === 'Yes' || item.MeatChoice === 'TRUE' || item.MeatChoice === 'true';
    const hasSizeOptions = item.HasSizeOptions === 'Yes' || item.HasSizeOptions === 'TRUE' || item.HasSizeOptions === 'true';

    if (hasSizeOptions && (item.SmallPrice || item.MediumPrice || item.LargePrice)) {
      setSelectedItem(item);
      setSizeModalOpen(true);
    } else if (needsMeatSelection) {
      setSelectedItem(item);
      setMeatModalOpen(true);
    } else {
      addToCart({
        menuItemId: item.id,
        itemName: item.ItemName,
        price: parseFloat(item.Price),
        quantity: 1,
        imageURL: item.ImageURL,
      });
      showToast('Added to cart!', 'success');
    }
  };

  const handleMeatSelection = (meat: string, quantity: number, specialInstructions: string) => {
    if (!selectedItem) return;

    addToCart({
      menuItemId: selectedItem.id,
      itemName: selectedItem.ItemName,
      meat,
      price: parseFloat(selectedItem.Price),
      quantity,
      specialInstructions: specialInstructions || undefined,
      imageURL: selectedItem.ImageURL,
    });

    showToast('Added to cart!', 'success');
  };

  const handleSizeSelection = (size: 'small' | 'medium' | 'large', quantity: number, specialInstructions: string) => {
    if (!selectedItem) return;

    let price = 0;
    if (size === 'small') {
      price = parseFloat(selectedItem.SmallPrice || '0');
    } else if (size === 'medium') {
      price = parseFloat(selectedItem.MediumPrice || '0');
    } else {
      price = parseFloat(selectedItem.LargePrice || '0');
    }

    addToCart({
      menuItemId: selectedItem.id,
      itemName: `${selectedItem.ItemName} (${size.charAt(0).toUpperCase() + size.slice(1)})`,
      size,
      price,
      quantity,
      specialInstructions: specialInstructions || undefined,
      imageURL: selectedItem.ImageURL,
    });

    showToast('Added to cart!', 'success');
  };

  const filteredMenu = menu.filter(item => {
    const matchesSearch =
      item.ItemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.Description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.Category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuCard}>
      <View style={styles.imageContainer}>
        {item.ImageURL ? (
          <Image
            source={{ uri: item.ImageURL }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderEmoji}>🌮</Text>
          </View>
        )}
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.itemName}>{item.ItemName}</Text>
        {item.Description && (
          <Text style={styles.description} numberOfLines={2}>
            {item.Description}
          </Text>
        )}
        
        <View style={styles.cardFooter}>
          <Text style={styles.price}>${parseFloat(item.Price).toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddToCart(item)}
          >
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading && menu.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#dc2626" />
          <Text style={styles.loadingText}>Loading menu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && menu.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadMenu}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Our Menu</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <RefreshCw color="#6b7280" size={24} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search color="#9ca3af" size={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for tacos, burritos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categories}
      >
        {CATEGORIES.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              activeCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => setActiveCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Menu Items */}
      {filteredMenu.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyText}>No items found. Try a different search.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMenu}
          renderItem={renderMenuItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.menuList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#dc2626']} />
          }
        />
      )}

      {/* Modals */}
      {selectedItem && (
        <>
          <MeatSelectionModal
            isOpen={meatModalOpen}
            onClose={() => {
              setMeatModalOpen(false);
              setSelectedItem(null);
            }}
            itemName={selectedItem.ItemName}
            price={parseFloat(selectedItem.Price)}
            imageURL={selectedItem.ImageURL}
            onAdd={handleMeatSelection}
          />
          {(selectedItem.SmallPrice || selectedItem.MediumPrice || selectedItem.LargePrice) && (
            <SizeSelectionModal
              isOpen={sizeModalOpen}
              onClose={() => {
                setSizeModalOpen(false);
                setSelectedItem(null);
              }}
              itemName={selectedItem.ItemName}
              smallPrice={selectedItem.SmallPrice ? parseFloat(selectedItem.SmallPrice) : undefined}
              mediumPrice={selectedItem.MediumPrice ? parseFloat(selectedItem.MediumPrice) : undefined}
              largePrice={selectedItem.LargePrice ? parseFloat(selectedItem.LargePrice) : undefined}
              imageURL={selectedItem.ImageURL}
              onAdd={handleSizeSelection}
            />
          )}
        </>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  refreshButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  categoriesScroll: {
    marginBottom: 16,
  },
  categories: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryButtonActive: {
    backgroundColor: '#dc2626',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  categoryTextActive: {
    color: '#fff',
  },
  menuList: {
    padding: 16,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f3f4f6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderEmoji: {
    fontSize: 64,
  },
  cardContent: {
    padding: 16,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  addButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
  },
});
