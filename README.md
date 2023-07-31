# Xlient App Image Bulder

Generate icons and splash images for Android and iOS apps from a set of template images.

```javascript
import AppImageBuilder from 'app-image-builder'

const builder = new AppImageBuilder({
    // Icons
    iconImage: './assets/icon.png',
    iconForegroundImage: './assets/icon-foreground.png',
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

        // Override default logoScale.
        logoScale: null,
    },

    android: {
        resourceColors: true,

        // Override default logoScale.
        logoScale: null,
    },
})

// Generate images.
builder.build()

// Output Cordova config XML.
console.log(builder.makeCordovaXml())

// Output Cordova config XML for each platform individually.
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

The scale within the bounding box that the logo gets placed in.

## iOS Idioms
universal and device

What size format of splash screens to generate for iOS.

## Android Resource Colors

When true, a colors.xml resources file will be generated with the icon
background color.
