'use client'

import Image from 'next/image'
import classnames from 'classnames'
import { useNextSanityImage } from 'next-sanity-image'
import { client as sanityClient } from '@/data/sanity'
import { getImageUrl } from '@/utils'
import styles from './SanityImage.module.scss'
import { useMemo, useState } from 'react'
import scssExports from '@/styles/export-vars.module.scss'

const { mobile, tablet, laptop, desktop, xl } = scssExports

const BREAKPOINTS = {
  xs: 1,
  mobile: parseInt(mobile),
  tablet: parseInt(tablet),
  laptop: parseInt(laptop),
  desktop: parseInt(desktop),
  xl: parseInt(xl),
}

const SanityImage = ({
  className,
  image,
  id,
  onLoad,
  sizes,
  breakpoints,
  unoptimized,
  priority,
  disableLoadedOpacity,
  width,
  height,
}) => {
  const [loaded, setLoaded] = useState(false)
  const dataUri = image?.asset?.metadata?.lqip

  const imageProps = useNextSanityImage(sanityClient, image, {
    imageBuilder: (imageUrlBuilder, options) => {
      return imageUrlBuilder
        .width(options.width || Math.min(options.originalImageDimensions.width, 1920))
        .quality(options.quality || 75)
        .fit('clip')
    },
  })

  if (imageProps) {
    if (dataUri) {
      imageProps.placeholder = 'blur'
      imageProps.blurDataURL = dataUri
    } else {
      imageProps.placeholder = 'empty'
    }
  }

  const imageElement = (
    <Image
      onLoad={() => {
        if (onLoad) onLoad()
        setLoaded(true)
      }}
      {...imageProps}
      width={width || imageProps?.width || 100}
      height={height || imageProps?.height || 100}
      sizes={sizes ? sizes : '75vw'}
      id={id}
      alt={image?.alt || ''}
      className={classnames(
        className,
        [styles.SanityImage],
        { [styles.loaded]: loaded && !disableLoadedOpacity },
        { [styles.hasDataUri]: dataUri },
      )}
      unoptimized={imageProps ? true : unoptimized}
      priority={priority}
    />
  )

  const breakpointsAsArray = useMemo(() => {
    if (!breakpoints) return

    const breakpointOrder = Object.keys(BREAKPOINTS).reverse()
    const asArray = []

    Object.keys(breakpoints).forEach(key => {
      if (!breakpoints[key]) return
      asArray[breakpointOrder.indexOf(key)] = {
        ...breakpoints[key],
        breakpoint: BREAKPOINTS[key],
      }
    })

    return asArray.filter(item => item)
  }, [breakpoints])

  if (breakpoints) {
    return (
      <picture>
        {breakpointsAsArray?.map((item, index) => {
          if (!item.image?.asset?.url || !item.width || !item.breakpoint) {
            return null
          }
          return (
            <source
              srcSet={getImageUrl(item.image, { width: item.width, ...item?.options }) || undefined}
              media={`(min-width: ${item.breakpoint}px)`}
              key={index}
            />
          )
        })}
        {imageElement}
      </picture>
    )
  }

  if (!image) return null

  return imageElement
}

SanityImage.displayName = 'SanityImage'

export default SanityImage
