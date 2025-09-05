# NumbReX Assets

This folder contains all the visual assets for the NumbReX React Native app, including icons, logos, and splash screens.

## 📁 Asset Files

### SVG Source Files (Created)
- `icon.svg` - Main app icon design (1024x1024)
- `adaptive-icon.svg` - Android adaptive icon design (512x512)
- `splash-icon.svg` - Splash screen icon design (400x400)
- `logo.svg` - In-app logo component design (200x200)
- `favicon.svg` - Web favicon design (48x48)

### PNG Files (Need to Generate)
- `icon.png` - Main app icon (1024x1024) - **Required for app stores**
- `adaptive-icon.png` - Android adaptive icon (512x512) - **Required for Android**
- `splash-icon.png` - Splash screen icon (400x400) - **Required for splash**
- `favicon.png` - Web favicon (48x48) - **Required for web**

## 🎨 Design Elements

### Brand Colors
- **Primary Blue**: `#3B82F6` - Main brand color, buttons, headings
- **Background**: `#F8FAFC` - Light gray background
- **White**: `#FFFFFF` - Cards and containers
- **Success Green**: `#22C55E` - Correct feedback
- **Warning Orange**: `#F59E0B` - Partial feedback  
- **Error Red**: `#EF4444` - Incorrect feedback
- **Purple Accent**: `#8B5CF6` - Secondary elements

### Logo Features
- **NumbReX branding** with clean typography
- **Sample digit cells** showing game feedback colors (5, 2, 8, 1)
- **Game mode icons** representing the three modes (🎯, ⚡, 💀)
- **Minimalist design** matching app's clean aesthetic

## 🛠️ Generation Instructions

### Step 1: Convert SVG to PNG
Use any of these tools to convert SVG files to PNG:
- **Online**: [convertio.co](https://convertio.co/svg-png/), [cloudconvert.com](https://cloudconvert.com/svg-to-png)
- **Desktop**: Inkscape, Adobe Illustrator, Figma
- **Command Line**: `rsvg-convert` or `imagemagick`

### Step 2: Required Specifications
```
icon.png          → 1024x1024px (300 DPI)
adaptive-icon.png → 512x512px (300 DPI)  
splash-icon.png   → 400x400px (300 DPI)
favicon.png       → 48x48px (300 DPI)
```

### Step 3: File Placement
Save all PNG files directly in the `/assets` folder with exact filenames shown above.

## 📱 App Store Requirements

### Google Play Store
- **App Icon**: 512x512px (high-res icon)
- **Feature Graphic**: 1024x500px
- **Screenshots**: 1080x1920px (phone), 1920x1080px (tablet)

### iOS App Store  
- **App Icon**: 1024x1024px
- **Screenshots**: Various sizes based on device

## 🚀 Usage in App

### Logo Component
The `Logo.tsx` component uses the design elements programmatically:
```typescript
<Logo size="large" showSubtitle={false} />
```

### App Configuration
Assets are automatically configured in `app.json`:
```json
{
  "icon": "./assets/icon.png",
  "splash": {
    "image": "./assets/splash-icon.png"
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.png"
    }
  }
}
```

## ✅ Checklist

- [x] SVG source files created
- [x] Logo component implemented
- [x] App configuration updated
- [ ] Convert SVG to PNG files
- [ ] Test icons in development
- [ ] Verify Play Store compliance

## 🎯 Next Steps

1. **Generate PNG files** from SVG sources using the tools above
2. **Test the app** with `npx expo start` to verify icons display correctly
3. **Build for production** with `eas build` when ready for app stores
4. **Create additional marketing assets** (feature graphics, screenshots) for store listings

The app is fully configured and ready to use these assets once the PNG files are generated!
