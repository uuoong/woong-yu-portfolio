import { forwardRef, useContext } from 'react'
import classnames from 'classnames'
import NextLink from 'next/link'

import { HEADER_ID } from '@/components/Navigation/Navigation'
import useCurrentPage from '@/hooks/use-current-page'

import styles from './Link.module.scss'
import { ScrollContext } from '@/context/Scroll'
import { getUrlFromPageType } from '@/utils'
import useStore from '@/store'

const Link = forwardRef(
  (
    {
      className,
      children,
      link,
      onMouseEnter,
      onMouseLeave,
      linkOnly,
      ariaLabel,
      onClick,
      disableOpenNewTab = false,
      disableThemeAttribute,
      dataTheme,
    },
    ref,
  ) => {
    const { linkType, label, link: url, hash } = link
    const { scroll } = useContext(ScrollContext)
    const { currentPath } = useCurrentPage()
    const setCursorState = useStore(state => state.setCursorState)

    if (linkType === 'disabled') {
      return null
    }

    if (typeof url !== 'string' && linkType === 'external') {
      return null
    }

    if (typeof url !== 'object' && linkType === 'internal') {
      return null
    }

    const handleMouseEnter = event => {
      setCursorState('FOCUS')

      if (onMouseEnter) {
        onMouseEnter(event)
      }
    }

    const handleMouseLeave = event => {
      setCursorState(null)

      if (onMouseLeave) {
        onMouseLeave(event)
      }
    }

    const handleClick = event => {
      if (onClick) {
        onClick(event)
      }
    }

    if (linkType === 'external') {
      return (
        <a
          ref={ref}
          aria-label={ariaLabel}
          {...(ariaLabel && !label && !children && { name: ariaLabel })}
          href={typeof url === 'string' ? url : ''}
          className={classnames(className)}
          target={disableOpenNewTab ? '_self' : '_blank'}
          rel="noreferrer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          data-themed={disableThemeAttribute ? '' : 'color'}
        >
          {label && !children && !linkOnly && <span data-themed="color">{label}</span>}
          {children && children}
        </a>
      )
    } else if (linkType === 'internal') {
      const urlObject = url
      const slug = typeof url === 'object' ? url.slug : ''
      const path = getUrlFromPageType(urlObject?._type, slug)
      const goesToOtherPage = currentPath !== path
      const hasHashOnSamePage = !goesToOtherPage && hash

      const props = {
        'aria-label': ariaLabel,
        ref: ref,
        className: classnames(
          className,
          { [styles.hashLink]: hasHashOnSamePage },
          {
            [styles.inactive]: !hasHashOnSamePage && currentPath === path,
          },
        ),
        onClick: e => {
          if (onClick) {
            onClick(e)
          }

          if (hasHashOnSamePage) {
            e.preventDefault()
            const header = document.getElementById(HEADER_ID)
            const id = document.getElementById(hash)

            if (id && scroll && header) {
              const distance = Math.abs(id?.offsetTop - header.offsetTop)
              const duration = 1 + distance / 20000

              scroll.scrollTo(id, {
                offset: header.offsetHeight * 2 * -1,
                //easeInOutCirc function
                easing: x =>
                  x < 0.5
                    ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
                    : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2,
                // immediate: true,
                duration,
              })
            }
          }
        },
        onMouseEnter: event => {
          setCursorState('FOCUS')

          if (onMouseEnter) {
            onMouseEnter(event)
          }
        },
        onMouseLeave: event => {
          setCursorState(null)

          if (onMouseLeave) {
            onMouseLeave(event)
          }
        },
      }

      if (!disableThemeAttribute) {
        props['data-themed'] = dataTheme || 'color'
      }

      if (hasHashOnSamePage) {
        return (
          <span {...props}>
            {label && !children && <span>{label}</span>}
            {children && children}
          </span>
        )
      }

      props.scroll = false
      props.href = `${path}${hash ? `#${hash}` : ''}`

      return (
        <NextLink {...props}>
          {label && !children && <span>{label}</span>}
          {children && children}
        </NextLink>
      )
    }
  },
)

Link.displayName = 'Link'

export default Link
