import { DOC_TYPES, HOME_SLUG, PRODUCTS_SLUG } from '@/data'

export const wait = (ms = 0) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const lerp = (currentValue, targetValue, ease = 0.1) => {
  return currentValue + (targetValue - currentValue) * ease
}

export const getCssVar = variable => {
  return window.getComputedStyle(document.body).getPropertyValue(`--${variable}`)
}

export const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return { unit: 'Bytes', size: 0 }

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return {
    size: parseFloat((bytes / Math.pow(k, i)).toFixed(dm)),
    unit: sizes[i],
  }
}

export const bytesToMb = bytes => {
  const { size, unit } = formatBytes(bytes)

  let value = size

  if (unit === 'KB') {
    value = value / 1024
  }

  return value
}

export const buildIdFromText = input => {
  return input
    .trim()
    .replace(/[^\w\s+]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
}

export const generateMetadataReturn = ({
  title,
  description,
  shareImageUrl,
  parentData,
  allowCrawlers = true,
  themeColor = '#ffffff',
}) => {
  const shareImagesParent = parentData?.openGraph?.images
  const imageChild = shareImagesParent?.length ? shareImagesParent[0] : null

  return {
    title: title || parentData?.title?.absolute,
    description: description || parentData?.description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || ''),
    themeColor,
    // manifest: '/manifest.webmanifest',
    openGraph: {
      title: title || parentData?.title?.absolute,
      description: description || parentData?.description,
      images: [`${shareImageUrl ? shareImageUrl : imageChild ? imageChild.url : shareImageUrl}`],
    },
    robots: {
      index: allowCrawlers,
      follow: allowCrawlers,
      nocache: !allowCrawlers,
      googleBot: {
        index: allowCrawlers,
        follow: allowCrawlers,
        noimageindex: !allowCrawlers,
      },
    },
  }
}

export const getImageUrl = (
  image,
  { width = null, height = null, fit = null, crop = null, quality = 80, invert = false, fm = 'webp', sat, rect = null },
) => {
  if (!image?.asset?.url) {
    console.warn('No image.asset.url in image object supplied. ', image)
    return null
  }

  let url = image.asset.url

  const params = []
  if (width) params.push(`w=${width}`)
  if (height) params.push(`h=${height}`)
  if (quality) params.push(`q=${quality}`)
  if (invert) params.push(`invert=${invert}`)
  if (fm) params.push(`fm=${fm}`)
  if (sat) params.push(`sat=${sat}`)
  if (rect) params.push(`rect=${rect}`)
  if (fit) params.push(`fit=${fit}`)
  if (crop) params.push(`crop=${crop}`)

  url = `${url}?${params.join('&')}`

  return url
}

export const mergeSiteSettings = (pageData, settingsData) => {
  const settingsMetaData = settingsData?.siteSettingsMetadata
  if (!settingsMetaData) return pageData

  const ignoreNulls = {}
  Object.keys(pageData?.metadata).forEach(key => {
    if (pageData?.metadata[key] !== null) {
      ignoreNulls[key] = pageData?.metadata[key]
    }

    if (key === 'title' && pageData?.metadata?.title && settingsMetaData?.title) {
      ignoreNulls.title = `${pageData.metadata.title} | ${settingsMetaData?.title}`
    }
  })

  const merged = {
    ...settingsMetaData,
    ...ignoreNulls,
  }

  pageData.metadata = merged

  // Global settings
  pageData.globalSettings = {
    navigation: null,
  }

  // Add navigation data
  if (settingsData?.navigation) {
    pageData.globalSettings.navigation = settingsData?.navigation
  }

  return pageData
}

export const formatPageSections = pageData => {
  const newPageData = pageData
  let pageSections = pageData.sections || []

  if (pageData._type === 'product') {
    const firstSection = {
      section: [
        {
          _type: 'productHero',
          _id: 'productHero',
          cmsSettings: {
            isHidden: false,
            cmsTitle: 'Product Hero',
          },
          title: pageData.title,
          ...pageData.productData,
        },
      ],
    }
    pageSections = [firstSection, ...pageSections]
  }

  newPageData.sections = pageSections

  return newPageData
}

export const formatSiteSettingsResponse = response => {
  if (!response) return {}

  const formatted = {}

  response?.forEach(setting => {
    if (!formatted[setting._type]) {
      formatted[setting._type] = setting
    }
  })

  return formatted
}

export const getPagePathBySlug = slug => {
  if (slug === HOME_SLUG) return '/'
  return `/${slug}`
}

export const getDeviceInfo = () => {
  const isBrowser = typeof window !== 'undefined'

  /* eslint-disable */
  const detect = {
    device: {},
    browser: {},
    os: {},
    bots: {},
    isTouchDevice: isBrowser && ('ontouchstart' in window || navigator.maxTouchPoints > 0),
  }
  if (isBrowser) {
    detect.device = require('@jam3/detect').device
    detect.browser = require('@jam3/detect').browser
    detect.os = require('@jam3/detect').os
    detect.bots = require('@jam3/detect').bots
  }

  /* eslint-disable */

  return detect
}

export const deviceInfo = getDeviceInfo()

export const simpleImagesPreload = ({ urls, onComplete, onProgress }) => {
  let loadedCounter = 0
  const toBeLoadedNumber = urls.length

  urls.forEach(function (url) {
    preloadImage(url, function () {
      loadedCounter++
      if (onProgress) {
        onProgress(loadedCounter / toBeLoadedNumber, url)
      }
      if (loadedCounter === toBeLoadedNumber) {
        if (onComplete) onComplete()
      }
    })
  })

  function preloadImage(url, anImageLoadedCallback) {
    const img = new Image()
    img.onload = anImageLoadedCallback
    img.src = url
  }
}

export const getCropOptions = (productImageOrientation, desiredOrentation, imageOptions) => {
  if (!productImageOrientation || !desiredOrentation) return {}

  let options = {}

  switch (productImageOrientation) {
    case 'square':
      if (desiredOrentation === 'portrait' || desiredOrentation === 'wide') {
        options = { fit: 'crop' }
      }
      break
    case 'portrait':
      if (desiredOrentation === 'square' || desiredOrentation === 'wide') {
        options = { fit: 'crop' }
      }
      break
    case 'wide':
      if (desiredOrentation === 'square' || desiredOrentation === 'portrait') {
        options = { fit: 'crop', crop: 'top,left' }
      } else if (desiredOrentation === 'wide') {
        options = { fit: 'crop' }
      }
      break
    default:
      break
  }

  options = {
    ...options,
    ...imageOptions,
  }

  return options
}

export const getCropHeightFromWidth = (desiredOrentation, width) => {
  if (desiredOrentation === 'portrait') {
    return Math.floor(width * 1.359)
  } else if (desiredOrentation === 'square') {
    return width
  } else if (desiredOrentation === 'wide') {
    return Math.floor(width * 0.6613)
  }

  return width
}

export const getUrlFromPageType = (pageType, slug) => {
  if (pageType === DOC_TYPES.PAGE && slug === 'home') return `/`
  if (pageType === DOC_TYPES.PAGE) return `/${slug}`
  if (pageType === DOC_TYPES.PRODUCT) return `/${PRODUCTS_SLUG}/${slug}`
}

export const getImageBackgroundFromAsset = imageObject => {
  return imageObject?.asset?.metadata?.palette?.darkVibrant?.background
}
