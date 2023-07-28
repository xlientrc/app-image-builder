'use strict'

import fs from 'fs'

const defaultOptions = {
    iconImage: null,
    iconForegroundImage: null,
    iconBackgroundImage: null,
    iconBackgroundColor: '#FFFFFF',

    splashImage: null,
    splashBackgroundColor: '#FFFFFF',
    splashFit: 'cover',
    splashPosition: 'center',

    logoImage: null,
    logoPosition: 'center',
    logoScale: 0.9,
    logoGrow: false,

    splashDarkImage: null,
    splashDarkBackgroundColor: null,
    logoDarkImage: null,

    ios: {
        idiom: 'universal', // universal or device
        logoScale: null,
    },

    android: {
        resourceColors: false,
        logoScale: null,
    },
}

function cleanPosition(position) {
    if (position === 'center') {
        position = 'center center'
    } else if (position === 'left') {
        position = 'left center'
    } else if (position === 'right') {
        position = 'right center'
    } else if (position === 'top') {
        position = 'center top'
    } else if (position === 'bottom') {
        position = 'center bottom'
    }

    return position
}

export default function (options) {
    options = {...defaultOptions, ...options}

    options.splashPosition = cleanPosition(options.splashPosition)
    options.logoPosition = cleanPosition(options.logoPosition)

    if (options.iconImage !== null && !fs.existsSync(options.iconImage)) {
        options.iconImage = null
    }

    if (options.iconForegroundImage !== null && !fs.existsSync(options.iconForegroundImage)) {
        options.iconForegroundImage = null
    }

    if (options.iconBackgroundImage !== null && !fs.existsSync(options.iconBackgroundImage)) {
        options.iconBackgroundImage = null
    }

    if (options.splashImage !== null && !fs.existsSync(options.splashImage)) {
        options.splashImage = null
    }

    if (options.logoImage !== null && !fs.existsSync(options.logoImage)) {
        options.logoImage = null
    }

    if (options.splashDarkImage !== null && !fs.existsSync(options.splashDarkImage)) {
        options.splashDarkImage = null
    }

    if (options.logoDarkImage !== null && !fs.existsSync(options.logoDarkImage)) {
        options.logoDarkImage = null
    }

    if ('ios' in options) {
        options.ios = {
            ...defaultOptions.ios,
            ...options.ios,
        }
    }

    if ('android' in options) {
        options.android = {
            ...defaultOptions.android,
            ...options.android,
        }
    }

    return options
}
