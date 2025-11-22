# Tacos El Junior - Mobile App (React Native/Expo)

## Overview
This is the mobile version of your Tacos El Junior restaurant app, converted from your Bolt web app to work with iOS and Android.

## What's Different from Web Version

### Mobile App (This Project)
- **Customer-facing only**: Menu browsing, cart, checkout, location
- **Native mobile experience**: Optimized for phones
- **App Store ready**: Can be submitted via Expo Launch
- **OTA updates**: Update content without App Store review

### Web App (Keep in Bolt)
- **Admin dashboard**: Restaurant owner portal
- **Menu management**: Upload/edit menu items
- **Analytics & reports**: Business insights

### Shared Backend
- Both apps connect to the **same Supabase database**
- Changes in admin web app instantly reflect in mobile app

## Setup Instructions

### 1. Install Prerequisites
```bash
# Install Node.js (if not already installed)
# Download from: https://nodejs.org

# Install Expo CLI globally
npm install -g expo-cli
```

### 2. Install Dependencies
```bash
cd TacosElJuniorMobile
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key_here
```

### 4. Run the App

**On iOS (requires Mac):**
```bash
npx expo start --ios
```

**On Android:**
```bash
npx expo start --android
```

**Or scan QR code with Expo Go app:**
```bash
npx expo start
```

## App Structure

```
TacosElJuniorMobile/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Bottom tab navigation
│   │   ├── index.tsx      # Home/Menu page
│   │   ├── cart.tsx       # Cart page
│   │   └── more.tsx       # More (Location, About, Catering)
│   ├── checkout.tsx       # Checkout flow
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── MenuCard.tsx
│   ├── CartItem.tsx
│   └── ...
├── contexts/              # React Context (Cart, Auth)
│   └── CartContext.tsx
├── lib/                   # Utilities
│   └── supabase.ts       # Supabase client
└── utils/                 # Helper functions
    └── menuService.ts    # Menu fetching logic
```

## Key Differences from Web Version

### Navigation
- **Web**: React Router with URL-based routing
- **Mobile**: Expo Router with file-based routing + bottom tabs

### Storage
- **Web**: localStorage
- **Mobile**: AsyncStorage (React Native equivalent)

### Styling
- **Web**: Tailwind CSS classes
- **Mobile**: StyleSheet or NativeWind (Tailwind for React Native)

### Components
- **Web**: `<div>`, `<button>`, `<img>`
- **Mobile**: `<View>`, `<TouchableOpacity>`, `<Image>`

### Payments
- **Web**: Stripe Web SDK
- **Mobile**: @stripe/stripe-react-native

## Features Included

✅ Menu browsing with categories
✅ Search functionality
✅ Shopping cart
✅ Meat/size selection modals
✅ Checkout with Stripe
✅ Location page
✅ Catering info
✅ About page
✅ Order confirmation

## Submitting to App Store

### Option 1: Expo Launch (Easiest - Browser-based)
1. Push code to GitHub
2. Go to https://launch.expo.dev
3. Connect your GitHub repo
4. Follow the prompts to build and submit

### Option 2: EAS CLI (Command line)
```bash
# Build for iOS
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

## OTA Updates (Instant Updates)

After your app is live, you can push updates without App Store review:

```bash
# Make changes to your code
# Then publish update
expo publish

# OR with EAS
eas update
```

Users get updates automatically within minutes!

## What You Need Before Submitting

1. **Apple Developer Account** ($99/year)
   - Sign up at https://developer.apple.com

2. **App Store Connect**
   - Create your app listing
   - Add screenshots, description, etc.

3. **Assets**
   - App icon (1024x1024px)
   - Splash screen
   - Screenshots for different iPhone sizes

## Testing Before Submit

1. **Test on real device** with Expo Go
2. **Build development build** to test native features
3. **Test checkout flow** with Stripe test mode
4. **Verify Supabase connection** works

## Troubleshooting

### "Cannot find module"
```bash
npm install
```

### "Metro bundler error"
```bash
# Clear cache
npx expo start -c
```

### Supabase not connecting
- Check your .env file has correct credentials
- Verify Supabase project is active

## Support

If you encounter issues during conversion or testing:
1. Check console logs for errors
2. Verify all environment variables are set
3. Test Supabase connection separately
4. Ensure Stripe keys are correct

## Next Steps

1. ✅ Review converted code
2. ✅ Test on your phone with Expo Go
3. ✅ Customize branding/colors if needed
4. ✅ Add app icon and splash screen
5. ✅ Test checkout flow
6. ✅ Submit to Expo Launch

---

**Questions?** Let me know what needs adjustment!
