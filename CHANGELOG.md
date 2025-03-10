# Change Log

## 1.4.0 - 2025-03-10

### Added

- Added iOS appIconBackgroundColor option.

## 1.3.0 - 2025-03-04

### Added

- Added iconScale option.
- Added iconForegroundScale option.
- Added android legacyIcons option.

### Changed

- Android legacy icons are now off by default.

## 1.2.0 - 2025-02-28

### Added

- Added buildAndroid and buildIos functions.
- Added path option for Android and iOS.

### Changed

- Android legacySplash option is now off by default.
- Android logoScale option is now set to 0.8 by default.
- Android adaptive icons now have separate sizing from regular icons (108dp / 66dp for background and foreground).
- Android iconForegroundImage will now fall back to iconImage.
- Android iconForegroundImage no longer requires padding.

## 1.1.2 - 2023-08-09

### Fixed

- Fixed missing .png extension on iOS splash Cordova output.

## 1.1.1 - 2023-07-31

### Fixed

- Fixed Android 'splash-icon' being generated twice in certain situations.
- Fixed 'xhdpi' density being generated as 'xhdp'.

## 1.1.0 - 2023-07-30

### Added

- Added support for iOS ligth/dark splash screens.
- Added support for Android 12+ 'WindowSplashScreenAnimatedIcon' and 'WindowSplashScreenBackground' preferences.
- Added legacySplash option for Android to specify if old style android splash images should still be generated.

## 1.0.0 - 2023-07-27

Initial release.
