'use strict'

import Jimp from 'jimp'
import defaultOptions from './options.js'
import fs from 'fs'

export const ANDROID_ICON_SIZES = {
    'ldpi': 36,
    'mdpi': 48,
    'hdpi': 72,
    'xhdpi': 96,
    'xxhdpi': 144,
    'xxxhdpi': 192
}

export const ANDROID_SPLASH_SIZES = {
    'port-ldpi': [200, 300],
    'port-mdpi': [320, 480],
    'port-hdpi': [480, 800],
    'port-xhdpi': [720, 1280],
    'port-xxhdpi': [960, 1600],
    'port-xxxhdpi': [1280, 1920],

    'land-ldpi': [300, 200],
    'land-mdpi': [480, 320],
    'land-hdpi': [800, 480],
    'land-xhdpi': [1280, 720],
    'land-xxhdpi': [1600, 960],
    'land-xxxhdpi': [1920, 1280],

    'splash-icon': [2732, 2732],
}

export const IOS_ICON_SIZES = {
    'icon-60@3x': 180,
    'icon-60': 60,
    'icon-60@2x': 120,
    'icon-76': 76,
    'icon-76@2x': 152,
    'icon-40': 40,
    'icon-40@2x': 80,
    'icon': 57,
    'icon@2x': 114,
    'icon-72': 72,
    'icon-72@2x': 144,
    'icon-167': 167,
    'icon-small': 29,
    'icon-small@2x': 58,
    'icon-small@3x': 87,
    'icon-50': 50,
    'icon-50@2x': 100,
    'icon-1024': 1024,
}

export const IOS_SPLASH_SIZES_DEVICE = {
    'Default@2x~iphone~anyany': [1334, 1334],
    'Default@2x~iphone~comany': [750, 1334],
    'Default@2x~iphone~comcom': [1334, 750],
    'Default@3x~iphone~anyany': [2208, 2208],
    'Default@3x~iphone~anycom': [2208, 1242],
    'Default@3x~iphone~comany': [1242, 2208],
    'Default@2x~ipad~anyany': [2732, 2732],
    'Default@2x~ipad~comany': [1278, 2732],
}

export const IOS_SPLASH_SIZES_UNIVERSAL = {
    'Default@2x~universal~anyany': [2732, 2732],
    'Default@2x~universal~comany': [1278, 2732],
    'Default@2x~universal~comcom': [1334, 750],
    'Default@3x~universal~anyany': [2208, 2208],
    'Default@3x~universal~anycom': [2208, 1242],
    'Default@3x~universal~comany': [1242, 2208],
}

export default class {
    constructor(options = {}) {
        this._options = defaultOptions(options)
    }

    async build() {
        await this.buildIosIcons()
        await this.buildAndroidIcons()

        await this.buildIosSplash()
        await this.buildAndroidSplash()
    }

    async buildIosIcons() {
        if (this._options.iconImage === null) {
            return
        }

        if (!fs.existsSync('./res/ios/icon')) {
            fs.mkdirSync('./res/ios/icon', {recursive: true})
        }

        const image = await Jimp.read(this._options.iconImage)

        for (const [key, value] of Object.entries(IOS_ICON_SIZES)) {
            const icon = image.clone()
            icon.resize(value, value, Jimp.RESIZE_BICUBIC)
            await icon.writeAsync('res/ios/icon/' + key + '.png')
        }
    }

    async buildAndroidIcons() {
        if (this._options.iconImage === null) {
            return
        }

        if (!fs.existsSync('./res/android/icon')) {
            fs.mkdirSync('./res/android/icon', {recursive: true})
        }

        const image = await Jimp.read(this._options.iconImage)

        for (const [key, value] of Object.entries(ANDROID_ICON_SIZES)) {
            const icon = image.clone()
            icon.resize(value, value, Jimp.RESIZE_BICUBIC)
            await icon.writeAsync('res/android/icon/' + key + '.png')
        }

        await this._buildAndroidAdaptiveIcons()
    }

    async _buildAndroidAdaptiveIcons() {
        if (this._options.iconForegroundImage === null) {
            return
        }

        if (!fs.existsSync('./res/android/icon')) {
            fs.mkdirSync('./res/android/icon', {recursive: true})
        }

        const image = await Jimp.read(this._options.iconForegroundImage)

        for (const [key, value] of Object.entries(ANDROID_ICON_SIZES)) {
            const icon = image.clone()
            icon.resize(value, value, Jimp.RESIZE_BICUBIC)
            await icon.writeAsync('res/android/icon/' + key + '-foreground.png')
        }

        if (this._options.iconBackgroundImage !== null) {
            const backImage = await Jimp.read(this._options.iconBackgroundImage)

            for (const [key, value] of Object.entries(ANDROID_ICON_SIZES)) {
                const icon = backImage.clone()
                icon.resize(value, value, Jimp.RESIZE_BICUBIC)
                await icon.writeAsync('res/android/icon/' + key + '-background.png')
            }
        } else if (this._options.android.resourceColors === false) {
            const backImage = await this._newImage(1024, 1024, this._options.iconBackgroundColor)

            for (const [key, value] of Object.entries(ANDROID_ICON_SIZES)) {
                const icon = backImage.clone()
                icon.resize(value, value, Jimp.RESIZE_BICUBIC)
                await icon.writeAsync('res/android/icon/' + key + '-background.png')
            }
        } else {
            if (!fs.existsSync('./res/android/values')) {
                fs.mkdirSync('./res/android/values', {recursive: true})
            }

            const colorsXml = `<?xml version="1.0" encoding="utf-8"?>\n` +
                `<resources>\n` +
                `    <color name="background">${this._options.iconBackgroundColor}</color>\n` +
                `</resources>`

            await fs.promises.writeFile('res/android/values/colors.xml', colorsXml)
        }
    }

    async buildIosSplash() {
        if (this._options.splashImage === null && this._options.logoImage === null) {
            return
        }

        if (!fs.existsSync('./res/ios/splash')) {
            fs.mkdirSync('./res/ios/splash', {recursive: true})
        }

        if (this._options.splashDarkImage !== null || this._options.logoDarkImage !== null) {
            if (this._options.ios.idiom === 'device') {
                await this._buildIosSplash(
                    this._options.splashImage,
                    this._options.splashBackgroundColor,
                    this._options.logoImage,
                    IOS_SPLASH_SIZES_DEVICE,
                    'light',
                )

                await this._buildIosSplash(
                    this._options.splashDarkImage || this._options.splashImage,
                    this._options.splashDarkBackgroundColor || this._options.splashBackgroundColor,
                    this._options.logoDarkImage || this._options.logoImage,
                    IOS_SPLASH_SIZES_DEVICE,
                    'dark',
                )
            } else {
                await this._buildIosSplash(
                    this._options.splashImage,
                    this._options.splashBackgroundColor,
                    this._options.logoImage,
                    IOS_SPLASH_SIZES_UNIVERSAL,
                    'light',
                )

                await this._buildIosSplash(
                    this._options.splashDarkImage || this._options.splashImage,
                    this._options.splashDarkBackgroundColor || this._options.splashBackgroundColor,
                    this._options.logoDarkImage || this._options.logoImage,
                    IOS_SPLASH_SIZES_UNIVERSAL,
                    'dark',
                )
            }
        } else {
            if (this._options.ios.idiom === 'device') {
                await this._buildIosSplash(
                    this._options.splashImage,
                    this._options.splashBackgroundColor,
                    this._options.logoImage,
                    IOS_SPLASH_SIZES_DEVICE,
                    null,
                )
            } else {
                await this._buildIosSplash(
                    this._options.splashImage,
                    this._options.splashBackgroundColor,
                    this._options.logoImage,
                    IOS_SPLASH_SIZES_UNIVERSAL,
                    null,
                )
            }
        }
    }

    async _buildIosSplash(
        splashImage,
        splashBackgroundColor,
        logoImage,
        sizes,
        theme
    ) {
        if (this._options.splashImage !== null) {
            splashImage = await Jimp.read(splashImage)
        }

        if (this._options.logoImage !== null) {
            logoImage = await Jimp.read(logoImage)
        }

        for (const [key, value] of Object.entries(sizes)) {
            const splash = await this._newImage(
                value[0],
                value[1],
                splashBackgroundColor
            )

            if (this._options.splashImage !== null) {
                this._blitImage(
                    splashImage,
                    splash,
                    this._options.splashFit,
                    this._options.splashPosition,
                    [1, 1],
                    true
                )
            }

            let scale = [
                this._options.ios.logoScale || this._options.logoScale,
                this._options.ios.logoScale || this._options.logoScale,
            ]

            if (key.indexOf('anyany') !== -1) {
                scale[0] /= 2
                scale[1] /= 2
            } else if (key.indexOf('anycom') !== -1) {
                scale[0] /= 2
            } else if (key.indexOf('comany') !== -1) {
                scale[1] /= 2
            }

            if (this._options.logoImage !== null) {
                this._blitImage(
                    logoImage,
                    splash,
                    'contain',
                    this._options.logoPosition,
                    scale,
                    this._options.logoGrow
                )
            }

            if (theme) {
                await splash.writeAsync('res/ios/splash/' + key + '~' + theme + '.png')
            } else {
                await splash.writeAsync('res/ios/splash/' + key + '.png')
            }
        }
    }

    async buildAndroidSplash() {
        if (this._options.splashImage === null && this._options.logoImage === null) {
            return
        }

        if (!fs.existsSync('./res/android/splash')) {
            fs.mkdirSync('./res/android/splash', {recursive: true})
        }

        await this._buildAndroidSplash(
            this._options.splashImage,
            this._options.splashBackgroundColor,
            this._options.logoImage,
        )

        if (this._options.splashDarkImage !== null || this._options.logoDarkImage !== null) {
            await this._buildAndroidSplash(
                this._options.splashDarkImage || this._options.splashImage,
                this._options.splashDarkBackgroundColor || this._options.splashBackgroundColor,
                this._options.logoDarkImage || this._options.logoImage,
            )
        }
    }

    async _buildAndroidSplash(
        splashImage,
        splashBackgroundColor,
        logoImage,
        dark
    ) {
        if (this._options.splashImage !== null) {
            splashImage = await Jimp.read(splashImage)
        }

        if (this._options.logoImage !== null) {
            logoImage = await Jimp.read(logoImage)
        }

        for (const [key, value] of Object.entries(ANDROID_SPLASH_SIZES)) {
            if (!this._options.android.legacySplash && key !== 'splash-icon') {
                continue
            }

            if (key === 'splash-icon' && dark) {
                continue;
            }

            const splash = await this._newImage(
                value[0],
                value[1],
                splashBackgroundColor
            )

            if (this._options.splashImage !== null) {
                this._blitImage(
                    splashImage,
                    splash,
                    this._options.splashFit,
                    this._options.splashPosition,
                    [1, 1],
                    true
                )
            }

            let scale = [
                this._options.android.logoScale || this._options.logoScale,
                this._options.android.logoScale || this._options.logoScale,
            ]

            if (this._options.logoImage !== null) {
                this._blitImage(
                    logoImage,
                    splash,
                    'contain',
                    this._options.logoPosition,
                    scale,
                    this._options.logoGrow
                )
            }

            if (dark) {
                key = key.replace('land-', 'land-night-')
                key = key.replace('port-', 'port-night-')
            }

            await splash.writeAsync('res/android/splash/' + key + '.png')
        }
    }

    _blitImage(srcImage, destImage, fit, position, scale, grow) {
        let width = destImage.getWidth(),
            height = destImage.getHeight(),
            size

        width *= scale[0]
        height *= scale[1]

        if (fit === 'contain') {
            size = this._getContainImageSize(
                width,
                height,
                srcImage.getWidth(),
                srcImage.getHeight(),
            )
        } else if (fit === 'cover') {
            size = this._getCoverImageSize(
                width,
                height,
                srcImage.getWidth(),
                srcImage.getHeight(),
            )
        } else { // Fill
            size = {
                width: destImage.getWidth(),
                height: destImage.getHeight()
            }
        }

        if (!grow) {
            if (size.width > srcImage.getWidth() ||
                size.height > srcImage.getHeight()
            ) {
                size = {
                    width: srcImage.getWidth(),
                    height: srcImage.getHeight()
                }
            }
        }

        srcImage = srcImage.clone()
        srcImage.resize(size.width, size.height)

        position = this._getImagePosition(
            destImage.getWidth(),
            destImage.getHeight(),
            size.width,
            size.height,
            position
        )

        destImage.blit(
            srcImage,
            position.x,
            position.y,
            0,
            0,
            size.width,
            size.height
        )
    }

    _getContainImageSize(containerWidth, containerHeight, imageWidth, imageHeight) {
        let aspectRatio = imageWidth / imageHeight
        let width, height

        if (containerWidth / aspectRatio <= containerHeight) {
            width = containerWidth
            height = width / aspectRatio
        } else {
            height = containerHeight
            width = height * aspectRatio
        }

        return {width: width, height: height}
    }

    _getCoverImageSize(containerWidth, containerHeight, imageWidth, imageHeight) {
        let aspectRatio = imageWidth / imageHeight
        let width, height

        if (containerWidth / containerHeight > aspectRatio) {
            width = containerWidth
            height = width / aspectRatio
        } else {
            height = containerHeight
            width = height * aspectRatio
        }

        return {width: width, height: height}
    }

    _getImagePosition(containerWidth, containerHeight, imageWidth, imageHeight, position) {
        let x, y

        const positions = position.split(' ')
        const horizontal = positions[0]
        const vertical = positions[1]

        if (horizontal === "left") {
            x = 0
        } else if (horizontal === "center") {
            x = (containerWidth - imageWidth) / 2
        } else if (horizontal === "right") {
            x = containerWidth - imageWidth
        }

        if (vertical === "top") {
            y = 0
        } else if (vertical === "center") {
            y = (containerHeight - imageHeight) / 2
        } else if (vertical === "bottom") {
            y = containerHeight - imageHeight
        }

        return {x: x, y: y}
    }

    async _newImage (width, height, color) {
        return new Promise((resolve, reject) => {
            new Jimp(width, height, color, (err, image) => {
                if (err) {
                    reject(err)
                }

                resolve(image)
            })
        })
    }

    makeCordovaXml() {
        return this.makeIosCordovaXml(true) + '\n' +
            this.makeAndroidCordovaXml(true)
    }

    makeIosCordovaXml(platformNode) {
        let xml = ''

        if (platformNode) {
            xml += '<platform name="ios">\n'
        }

        if (this._options.iconImage !== null) {
            for (const [key, value] of Object.entries(IOS_ICON_SIZES)) {
                xml += '    <icon src="res/ios/icon/' + key + '.png" width="' + value + '" height="' + value + '" />\n'
            }
        }

        if (this._options.splashImage !== null || this._options.logoImage !== null) {
            if (this._options.iconImage !== null) {
                xml += '\n'
            }

            if (this._options.splashDarkImage !== null || this._options.logoDarkImage !== null) {
                if (this._options.ios.idiom === 'device') {
                    for (const key of Object.keys(IOS_SPLASH_SIZES_DEVICE)) {
                        xml += '    <splash src="res/ios/splash/' + key + '~light.png" />\n'
                    }
                } else{
                    for (const key of Object.keys(IOS_SPLASH_SIZES_UNIVERSAL)) {
                        xml += '    <splash src="res/ios/splash/' + key + '~light.png" />\n'
                    }
                }

                xml += '\n'

                if (this._options.ios.idiom === 'device') {
                    for (const key of Object.keys(IOS_SPLASH_SIZES_DEVICE)) {
                        xml += '    <splash src="res/ios/splash/' + key + '~dark.png" />\n'
                    }
                } else{
                    for (const key of Object.keys(IOS_SPLASH_SIZES_UNIVERSAL)) {
                        xml += '    <splash src="res/ios/splash/' + key + '~dark.png" />\n'
                    }
                }
            } else {
                if (this._options.ios.idiom === 'device') {
                    for (const key of Object.keys(IOS_SPLASH_SIZES_DEVICE)) {
                        xml += '    <splash src="res/ios/splash/' + key + '.png" />\n'
                    }
                } else{
                    for (const key of Object.keys(IOS_SPLASH_SIZES_UNIVERSAL)) {
                        xml += '    <splash src="res/ios/splash/' + key + '.png" />\n'
                    }
                }
            }
        }

        if (platformNode) {
            xml += '</platform>\n'
        }

        return xml
    }
    makeAndroidCordovaXml(platformNode) {
        let xml = ''

        if (platformNode) {
            xml += '<platform name="android">\n'
        }

        if (this._options.iconImage !== null) {
            for (const key of Object.keys(ANDROID_ICON_SIZES)) {
                xml += '    <icon src="res/android/icon/' + key + '.png" density="' + key + '" />\n'
            }
        }

        if (this._options.iconForegroundImage !== null) {
            xml += '\n'

            if (this._options.iconBackgroundImage !== null || this._options.android.resourceColors === false) {
                for (const key of Object.keys(ANDROID_ICON_SIZES)) {
                    xml += '    <icon background="res/android/icon/' + key + '-background.png" foreground="res/android/icon/' + key + '-foreground.png" density="' + key + '" />\n'
                }
            } else {
                xml += '    <resource-file src="res/android/values/colors.xml" target="res/values/colors.xml" />\n\n'

                for (const key of Object.keys(ANDROID_ICON_SIZES)) {
                    xml += '    <icon background="@color/background" foreground="res/android/icon/' + key + '-foreground.png" density="' + key + '" />\n'
                }
            }
        }

        if (this._options.splashImage !== null || this._options.logoImage !== null) {
            if (this._options.iconImage !== null) {
                xml += '\n'
            }

            if (this._options.android.legacySplash) {
                for (const key of Object.keys(ANDROID_SPLASH_SIZES)) {
                    if (key === 'splash-icon') {
                        continue
                    }

                    if (key.includes('land')) {
                        continue
                    }

                    xml += '    <splash src="res/android/splash/' + key + '.png" density="' + key.replace('port-', '') + '" />\n'
                }

                xml += '\n'

                let isPort = true
                for (const key of Object.keys(ANDROID_SPLASH_SIZES)) {
                    if (key === 'splash-icon') {
                        continue
                    }

                    if (isPort && key.includes('land-')) {
                        isPort = false
                        xml += '\n'
                    }

                    xml += '    <splash src="res/android/splash/' + key + '.png" density="' + key + '" />\n'
                }

                if (this._options.splashDarkImage !== null || this._options.logoDarkImage !== null) {
                    xml += '\n'

                    isPort = true
                    for (let key of Object.keys(ANDROID_SPLASH_SIZES)) {
                        if (key === 'splash-icon') {
                            continue
                        }

                        if (isPort && key.includes('land-')) {
                            isPort = false
                            xml += '\n'
                        }

                        key = key.replace('land-', 'land-night-')
                        key = key.replace('port-', 'port-night-')

                        xml += '    <splash src="res/android/splash/' + key + '.png" density="' + key + '" />\n'
                    }
                }

                xml += '\n'
            }

            xml += '    <preference name="AndroidWindowSplashScreenAnimatedIcon" value="res/android/splash/splash-icon.png" />\n'
            xml += '    <preference name="AndroidWindowSplashScreenBackground" value="' + this._options.splashBackgroundColor + '" />\n'
        }

        if (platformNode) {
            xml += '</platform>\n'
        }

        return xml
    }
}

// ✝
