import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  MapPin, 
  UtensilsCrossed, 
  Info, 
  Phone, 
  Mail,
  Clock,
  ChevronRight 
} from 'lucide-react-native';

export default function MoreScreen() {
  const handleCall = () => {
    Linking.openURL('tel:+14193291538');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:[email protected]');
  };

  const handleMaps = () => {
    // Replace with actual address coordinates
    const address = '2114 N Detroit Ave, Toledo, OH 43606';
    const url = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>More</Text>
        </View>

        {/* Restaurant Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tacos El Junior</Text>
          <Text style={styles.cardSubtitle}>Authentic Mexican Cuisine</Text>
          
          <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
            <Phone color="#dc2626" size={20} />
            <Text style={styles.contactText}>(419) 329-1538</Text>
            <ChevronRight color="#9ca3af" size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
            <Mail color="#dc2626" size={20} />
            <Text style={styles.contactText}>[email protected]</Text>
            <ChevronRight color="#9ca3af" size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handleMaps}>
            <MapPin color="#dc2626" size={20} />
            <View style={styles.addressContainer}>
              <Text style={styles.contactText}>2114 N Detroit Ave</Text>
              <Text style={styles.contactSubtext}>Toledo, OH 43606</Text>
            </View>
            <ChevronRight color="#9ca3af" size={20} />
          </TouchableOpacity>
        </View>

        {/* Hours Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Clock color="#dc2626" size={24} />
            <Text style={styles.cardTitle}>Hours</Text>
          </View>
          
          <View style={styles.hoursContainer}>
            <View style={styles.hoursRow}>
              <Text style={styles.dayText}>Monday - Thursday</Text>
              <Text style={styles.hoursText}>11:00 AM - 9:00 PM</Text>
            </View>
            <View style={styles.hoursRow}>
              <Text style={styles.dayText}>Friday - Saturday</Text>
              <Text style={styles.hoursText}>11:00 AM - 10:00 PM</Text>
            </View>
            <View style={styles.hoursRow}>
              <Text style={styles.dayText}>Sunday</Text>
              <Text style={styles.hoursText}>11:00 AM - 8:00 PM</Text>
            </View>
          </View>
        </View>

        {/* Quick Links */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Links</Text>
          
          <TouchableOpacity style={styles.linkItem}>
            <UtensilsCrossed color="#6b7280" size={20} />
            <Text style={styles.linkText}>Catering Services</Text>
            <ChevronRight color="#9ca3af" size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem}>
            <Info color="#6b7280" size={20} />
            <Text style={styles.linkText}>About Us</Text>
            <ChevronRight color="#9ca3af" size={20} />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About Tacos El Junior</Text>
          <Text style={styles.aboutText}>
            Welcome to Tacos El Junior! We serve authentic Mexican cuisine made with fresh 
            ingredients and traditional recipes. From our famous tacos to our delicious burritos, 
            every dish is prepared with love and care.
          </Text>
          <Text style={styles.aboutText}>
            Visit us today and experience the taste of Mexico right here in Toledo!
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 Tacos El Junior</Text>
          <Text style={styles.footerText}>All rights reserved</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 12,
  },
  contactText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  contactSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  addressContainer: {
    flex: 1,
  },
  hoursContainer: {
    gap: 12,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  dayText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  hoursText: {
    fontSize: 15,
    color: '#6b7280',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  aboutText: {
    fontSize: 15,
    color: '#6b7280',
    lineHeight: 24,
    marginBottom: 12,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },
});
