import { useRouter } from 'next/router'

import { FOUR_OH_FOUR_SLUG, HOME_SLUG } from '@/data'
import { getPagePathBySlug } from '@/utils'

const useCurrentPage = () => {
  const router = useRouter()
  const currentPath = router.asPath.split('?')[0]
  const isHome = currentPath === getPagePathBySlug(HOME_SLUG) || currentPath === ''
  const is404 = router.pathname === `/${FOUR_OH_FOUR_SLUG}`

  let currentPageSlug = typeof router.query.slug === 'string' ? router.query.slug : ''
  if (isHome) currentPageSlug = HOME_SLUG
  if (is404) currentPageSlug = FOUR_OH_FOUR_SLUG

  return { isHome, currentPath, currentPageSlug, is404 }
}

useCurrentPage.displayName = 'useCurrentPage'

export default useCurrentPage
