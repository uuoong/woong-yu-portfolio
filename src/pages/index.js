import Sections from '@/components/Sections/Sections'
import { HOME_SLUG } from '@/data'
import { getPage } from '@/data/sanity'

export default function IndexPage({ sections, hasFooter, infiniteScrollingEnabled }) {
  return (
    <Sections
      pageType="page"
      pageSlug={HOME_SLUG}
      sections={sections}
      hasFooter={hasFooter}
      infiniteScroll={infiniteScrollingEnabled}
    />
  )
}

export async function getStaticProps(context) {
  const data = await getPage(HOME_SLUG, 'page', Boolean(context.preview))

  return {
    props: data,
    revalidate: parseInt(process.env.REVALIDATE || '60'),
  }
}
