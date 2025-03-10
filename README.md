# Xlient App Image Bulder

Generate icons and splash images for Android and iOS apps from a set of template images.

```javascript
import AppImageBuilder from 'app-image-builder'

const builder = new AppImageBuilder({
    // iOS and legacy Android icons
    iconImage: './assets/icon.png',
    iconScale: 1.0,

    // Android adaptive icons
    iconForegroundImage: './assets/icon-foreground.png',
    iconForegroundScale: 1.0,
    iconBackgroundImage: './assets/icon-background.png',
    iconBackgroundColor: '#FFFFFF',

    // Splash screens
    splashImage: './assets/splash.png',
    splashBackgroundColor: '#FFFFFF',
    splashDarkImage: null,
    splashDarkBackgroundColor: null,
    splashFit: 'contain',
    splashPosition: 'center',

    // Logo
    logoImage: './assets/logo.png',
    logoDarkImage: null,
    logoPosition: 'center',
    logoScale: 0.9,
    logoGrow: false,

    ios: {
        idiom: 'universal',

        // Override default iconScale
        iconScale: null,

        // App Store requires a non transparent image
        appIconBackgroundColor: '#FFFFFF',

        // Override default logoScale
        logoScale: null,
        path: 'res/ios',
    },

    android: {
        legacyIcons: false,
        legacySplash: false,
        resourceColors: true,

        // Override default iconScale
        iconScale: null,

        // Override default logoScale
        logoScale: 0.6,
        path: 'res/android',
    },
})

// Generate images
await builder.build()

// Output Cordova config XML
console.log(builder.makeCordovaXml())

// Generate images for each platform individually
await builder.buildIos()
await builder.buildAndroid()

// Output Cordova config XML for each platform individually
console.log(builder.makeIosCordovaXml())
console.log(builder.makeAndroidCordovaXml())
```

## Build Output

Files will be written to a ./res folder.

## Splash and Logo Image

Only one of splash or logo image is required. If both are specified, the logo
image will appear on top of the splash image.

## Grow

If set to true, the app image builder will allow the image to resize to larger
than the original image.

## Fits

cover, contain, and fill

## Positions

center, left, right, top, bottom, left top, left bottom, right top,
right bottom, left center, right center, center top, center bottom, and
center center

## Scale

A number between 0 and 1.

The scale within the bounding box that the icon or logo gets placed in.

## iOS Idioms
universal and device

What size format of splash screens to generate for iOS.

## Android Resource Colors

When true, a colors.xml resources file will be generated with the icon
background color.

## Android Legacy Icons

When true, legacy Android icons will be generated.

## Android Legacy Splash

When true, legacy splash images used by Android 11 and below will be generered.
