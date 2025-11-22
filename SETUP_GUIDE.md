# Tacos El Junior Mobile - Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
cd TacosElJuniorMobile
npm install
```

### Step 2: Set Up Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

You can find these in your Supabase project settings:
- Go to https://supabase.com/dashboard
- Select your project
- Go to Settings → API
- Copy the URL and anon/public key

### Step 3: Run the App

```bash
npx expo start
```

Then:
- **For iOS**: Press `i` or scan QR code with Camera app
- **For Android**: Press `a` or scan QR code with Expo Go app
- **For Web**: Press `w` (for testing only)

### Step 4: Test on Your Phone

1. Download **Expo Go** app:
   - iOS: App Store
   - Android: Google Play Store

2. Open Expo Go and scan the QR code from your terminal

3. The app will load on your phone!

---

## ✅ What's Working Right Now

### Completed Features:
- ✅ **Menu browsing** - View all menu items by category
- ✅ **Search** - Find items by name or description
- ✅ **Category filtering** - Filter by Tacos, Burritos, etc.
- ✅ **Shopping cart** - Add items, adjust quantities, remove items
- ✅ **Cart persistence** - Cart saves even if app closes
- ✅ **Checkout form** - Customer info collection
- ✅ **Order confirmation** - Success screen after order
- ✅ **Restaurant info** - Hours, location, contact
- ✅ **Bottom tab navigation** - Menu, Cart, More tabs
- ✅ **Pull to refresh** - Refresh menu with swipe down

### What Needs Work:
- ⚠️ **Meat selection modal** - Currently shows alert, needs proper modal
- ⚠️ **Size selection modal** - Currently shows alert, needs proper modal
- ⚠️ **Stripe payment** - Payment processing not integrated yet
- ⚠️ **Order submission to Supabase** - Orders not saved to database yet
- ⚠️ **App icon & splash screen** - Using default Expo assets

---

## 📱 App Structure

```
TacosElJuniorMobile/
├── app/                          # Expo Router (file-based routing)
│   ├── (tabs)/                   # Bottom tab navigation
│   │   ├── _layout.tsx           # Tab bar configuration
│   │   ├── index.tsx             # Menu screen (home)
│   │   ├── cart.tsx              # Cart screen
│   │   └── more.tsx              # More info screen
│   ├── _layout.tsx               # Root layout with CartProvider
│   ├── checkout.tsx              # Checkout flow
│   └── confirmation.tsx          # Order confirmed screen
├── contexts/
│   └── CartContext.tsx           # Shopping cart state management
├── lib/
│   └── supabase.ts               # Supabase client config
├── utils/
│   └── menuService.ts            # Menu fetching & caching
├── package.json                  # Dependencies
├── app.json                      # Expo configuration
└── .env                          # Environment variables (you create this)
```

---

## 🔧 Testing Tips

### Test Menu Loading:
1. Open app
2. You should see menu items load from Supabase
3. Try searching for "taco"
4. Try filtering by "Burritos" category

### Test Cart:
1. Add items to cart from menu
2. Go to Cart tab
3. Adjust quantities with +/- buttons
4. Remove items
5. Close app and reopen - cart should persist

### Test Checkout:
1. Add items to cart
2. Go to Cart
3. Tap "Proceed to Checkout"
4. Fill in name and phone
5. Tap "Place Order"
6. Should see confirmation screen

---

## 🐛 Common Issues & Fixes

### "Cannot find module 'expo-router'"
```bash
npm install
npx expo start -c
```

### "Supabase client error"
- Check your `.env` file has correct credentials
- Make sure you're using `EXPO_PUBLIC_` prefix
- Restart Expo with `npx expo start -c`

### "Network error" when loading menu
- Check Supabase project is active
- Check your WiFi connection
- Verify API credentials are correct

### Images not loading
- Check Supabase Storage is set up correctly
- Verify image URLs are public
- Check image URLs in your database

### App won't run on iOS
- You need a Mac to run iOS simulator
- Or use physical iPhone with Expo Go app

---

## 📦 What Still Needs Converting

### High Priority:
1. **Meat Selection Modal** - Bottom sheet for choosing meat type
2. **Size Selection Modal** - Bottom sheet for small/medium/large
3. **Stripe Integration** - Payment processing
4. **Order Submission** - Save orders to Supabase database

### Medium Priority:
5. **Toast Notifications** - Instead of Alert.alert
6. **Loading States** - Better loading indicators
7. **Error Handling** - Better error messages
8. **Image Optimization** - Compress and cache images

### Nice to Have:
9. **Animations** - Smooth transitions
10. **App Icon** - Custom branding
11. **Splash Screen** - Custom loading screen
12. **Push Notifications** - Order ready notifications

---

## 🚀 Ready to Submit to App Store?

### Before Submitting:

1. **Test thoroughly** on real device
2. **Add app icon** (1024x1024px)
3. **Add splash screen**
4. **Complete Stripe integration** (or remove for MVP)
5. **Test all features** work as expected
6. **Prepare screenshots** for App Store listing

### Submit via Expo Launch:

1. Push code to GitHub
2. Go to https://launch.expo.dev
3. Connect GitHub repo
4. Sign in with Apple
5. Build and submit

**OR** use EAS CLI:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for iOS
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

---

## 💡 Next Steps

**Option 1: Continue converting features**
- I can add the meat/size selection modals
- Integrate Stripe payments
- Add order submission to Supabase

**Option 2: Test and iterate**
- Test current version on your phone
- Get feedback from restaurant owner
- Then add remaining features

**Option 3: Launch MVP first**
- Current version is functional for orders
- Can do phone orders / payment on pickup
- Add payment later as an update

**Which path do you want to take?**

---

## 📞 Need Help?

If you run into issues:
1. Check console logs in terminal for errors
2. Check Expo DevTools in browser
3. Verify environment variables are set
4. Make sure Supabase project is active

Let me know what problems you encounter and I can help fix them!
