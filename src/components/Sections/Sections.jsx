import SectionContainer from '@/components/SectionContainer/SectionContainer'
import { buildIdFromText } from '@/utils'

/* INJECT_SECTIONS_IMPORT */
import ProductsInfiniteCarousel from '@/sections/ProductsInfiniteCarousel/ProductsInfiniteCarousel'
import TwoImagesAndText from '@/sections/TwoImagesAndText/TwoImagesAndText'
import ProductHero from '@/sections/ProductHero/ProductHero'
import ProductGrid from '@/sections/ProductGrid/ProductGrid'
import LithLogo from '@/sections/LithLogo/LithLogo'
import ResizingSlider from '@/sections/ResizingSlider/ResizingSlider'
import StandaloneMedia from '@/sections/StandaloneMedia/StandaloneMedia'
import MultiParagraphWithLinks from '@/sections/MultiParagraphWithLinks/MultiParagraphWithLinks'
import LinkBlock from '@/sections/LinkBlock/LinkBlock'
import LogoWithProducts from '@/sections/LogoWithProducts/LogoWithProducts'
import TestComponent from '@/sections/TestComponent/TestComponent'
import FourOhFour from '@/sections/FourOhFour/FourOhFour'
import { Fragment, useContext, useEffect, useMemo } from 'react'
import { ScrollContext } from '@/context/Scroll'
import Footer from '@/sections/Footer/Footer'
import useBreakpoint from '@/hooks/use-breakpoint'

const SECTIONS = {
  /* INJECT_SECTIONS_COMPONENT_TYPE */
  productsInfiniteCarousel: ProductsInfiniteCarousel,
  twoImagesAndText: TwoImagesAndText,
  productHero: ProductHero,
  productGrid: ProductGrid,
  lithLogo: LithLogo,
  resizingSlider: ResizingSlider,
  standaloneMedia: StandaloneMedia,
  multiParagraphWithLinks: MultiParagraphWithLinks,
  linkBlock: LinkBlock,
  logoWithProducts: LogoWithProducts,
  testComponent: TestComponent,
  fourOhFour: FourOhFour,
}

function Sections({ sections, infiniteScroll, hasFooter }) {
  const { initScroll } = useContext(ScrollContext)
  const { isMobile } = useBreakpoint()
  const _hasFooter = hasFooter || isMobile
  const _isInfiniteScroll = infiniteScroll && !isMobile && typeof isMobile === 'boolean'

  const sectionsFiltered = useMemo(() => {
    const _sections = sections?.filter(
      sectionArr => !sectionArr?.section[0]?.cmsSettings?.isHidden && sectionArr?.section,
    )

    if (_isInfiniteScroll) {
      _sections.push(_sections[0])
    }

    return _sections
  }, [sections, _isInfiniteScroll])

  useEffect(() => {
    let isInfinite = Boolean(_isInfiniteScroll)
    if (isMobile) {
      isInfinite = false
    }
    initScroll({ options: { infinite: isInfinite, syncTouch: isInfinite } })
  }, [_isInfiniteScroll, initScroll, isMobile])

  if (!sectionsFiltered?.length) return null

  return (
    <>
      {sectionsFiltered.map((sectionArr, i) => {
        if (!sectionArr?.section) {
          console.warn('No sections tied to data ', sectionArr)
          return null
        }

        const sectionAfter = sectionsFiltered[i + 1]?.section[0]
        const sectionObj = sectionArr?.section[0]

        if (!sectionObj._type) {
          return null
        }

        if (!SECTIONS[sectionObj._type]) {
          console.warn('No section found with type ', sectionObj._type)
          return null
        }

        if (sectionObj?.cmsSettings?.isHidden) {
          return null
        }

        const SectionComponent = SECTIONS[sectionObj._type]

        let sectionTypeAfter = sectionAfter?._type
        if (i === sectionsFiltered.length - 2 && infiniteScroll) {
          sectionTypeAfter = sectionsFiltered[0]?.section[0]?._type
        }

        return (
          <Fragment key={`${i}_${sectionObj._id}_${buildIdFromText(sectionObj?.cmsSettings?.cmsTitle || '')}`}>
            <SectionContainer
              cmsTitle={sectionObj?.cmsSettings?.cmsTitle || ''}
              _type={sectionObj._type}
              sectionsLength={sectionsFiltered.length}
              isInfiniteDuplicate={i === sectionsFiltered.length - 1 && _isInfiniteScroll}
              nextSectionType={sectionTypeAfter}
              hiddenOnMobile={sectionObj?.cmsSettings?.disableOnMobile}
            >
              <SectionComponent {...sectionObj} />
            </SectionContainer>
            {_hasFooter && i === sectionsFiltered.length - 1 && <Footer />}
          </Fragment>
        )
      })}
    </>
  )
}

export default Sections
