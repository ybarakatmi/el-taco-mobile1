import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MenuItem {
  id: string;
  ItemName: string;
  Category: string;
  Price: string;
  Description: string;
  ImageURL: string;
  Available: string;
  MeatChoice: string;
  HasSizeOptions: string;
  SmallPrice: string | null;
  MediumPrice: string | null;
  LargePrice: string | null;
  updated_at?: string;
}

const CACHE_KEY = '@tacoeljunior_menu';
const CACHE_TIMESTAMP_KEY = '@tacoeljunior_menu_timestamp';
const CACHE_DURATION = 1 * 60 * 1000; // 1 minute

export async function fetchMenu(): Promise<MenuItem[]> {
  const cached = await getCachedMenu();
  if (cached) {
    return cached;
  }

  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('available', true)
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Menu fetch error:', error);
    throw new Error('Failed to fetch menu');
  }

  const menuItems: MenuItem[] = (data || []).map(item => ({
    id: item.id,
    ItemName: item.item_name,
    Category: item.category,
    Price: item.price.toString(),
    Description: item.description || '',
    ImageURL: item.image_url || '',
    Available: item.available ? 'Yes' : 'No',
    MeatChoice: item.meat_choice ? 'Yes' : 'No',
    HasSizeOptions: item.has_size_options ? 'Yes' : 'No',
    SmallPrice: item.small_price ? item.small_price.toString() : null,
    MediumPrice: item.medium_price ? item.medium_price.toString() : null,
    LargePrice: item.large_price ? item.large_price.toString() : null,
    updated_at: item.updated_at,
  }));

  await cacheMenu(menuItems);
  return menuItems;
}

async function getCachedMenu(): Promise<MenuItem[] | null> {
  try {
    const timestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
    const cached = await AsyncStorage.getItem(CACHE_KEY);

    if (!timestamp || !cached) {
      return null;
    }

    const age = Date.now() - parseInt(timestamp);
    if (age > CACHE_DURATION) {
      return null;
    }

    return JSON.parse(cached);
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

async function cacheMenu(menu: MenuItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(menu));
    await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error caching menu:', error);
  }
}

export async function clearMenuCache(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CACHE_KEY);
    await AsyncStorage.removeItem(CACHE_TIMESTAMP_KEY);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

export const MEAT_OPTIONS = [
  { value: 'Barbacoa', label: 'Barbacoa (Shredded Beef)' },
  { value: 'Birria', label: 'Birria (Beef)' },
  { value: 'Campechana', label: 'Campechana (Steak + Chorizo)' },
  { value: 'Carne Asada', label: 'Carne Asada (Steak)' },
  { value: 'Carne Molida', label: 'Carne Molida (Ground Beef)' },
  { value: 'Chorizo', label: 'Chorizo (Pork Sausage)' },
  { value: 'Pollo', label: 'Pollo (Chicken)' },
  { value: 'Tripa', label: 'Tripa' },
];
