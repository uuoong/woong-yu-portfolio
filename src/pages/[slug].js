import Sections from '@/components/Sections/Sections'
import { FOUR_OH_FOUR_SLUG, HOME_SLUG } from '@/data'
import { getAllPages, getPage } from '@/data/sanity'

export default function Product({ slug, _type, sections, infiniteScrollingEnabled, hasFooter }) {
  return (
    <Sections
      pageType={_type}
      pageSlug={slug.current}
      sections={sections}
      hasFooter={hasFooter}
      infiniteScroll={infiniteScrollingEnabled}
    />
  )
}

export const getStaticPaths = async () => {
  const pages = await getAllPages('page')

  if (!pages?.length) return null

  const paths = pages
    .map(page => {
      if (page.slug.current === HOME_SLUG || page.slug.current === FOUR_OH_FOUR_SLUG) {
        return null
      }
      return {
        params: { slug: page.slug.current },
      }
    })
    .filter(n => n)

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps = async context => {
  const { params } = context
  const slug = params?.slug?.toString()

  if (slug === HOME_SLUG || !slug) {
    return {
      notFound: true,
    }
  }

  const data = await getPage(slug, 'page', Boolean(context.preview))

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      ...data,
    },
    revalidate: parseInt(process.env.REVALIDATE || '60'),
  }
}
