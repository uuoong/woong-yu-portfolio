import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export const useStore = create(
  subscribeWithSelector(set => ({
    // Global Settings
    theme: 'dark',
    setTheme: theme => set({ theme }),
    globalData: null,
    setGlobalData: globalData => set({ globalData }),
    pageIsTransitioning: false,
    setPageIsTransitioning: pageIsTransitioning => set({ pageIsTransitioning }),
    enableInteraction: true,
    setEnableInteraction: enableInteraction => set({ enableInteraction }),
    remValueCalculated: false,
    setRemValueCalculated: remValueCalculated => set({ remValueCalculated }),
    bodyHeightChangeKey: null,
    setBodyHeightChangeKey: bodyHeightChangeKey => set({ bodyHeightChangeKey }),

    // Preloader
    loaderAnimationComplete: false,
    setLoaderAnimationComplete: loaderAnimationComplete => set({ loaderAnimationComplete }),
    showMainContent: false,
    setShowMainContent: showMainContent => set({ showMainContent }),
    capContentHeight: true,
    setCapContentHeight: capContentHeight => set({ capContentHeight }),

    // Navigation
    navigationIsOpen: false,
    setNavigationIsOpen: navigationIsOpen => set({ navigationIsOpen }),

    // Product Grid
    productGridProducts: [],
    setProductGridProducts: productGridProducts => set({ productGridProducts }),
    productGridActiveProductIndex: null,
    setProductGridActiveProductIndex: productGridActiveProductIndex => set({ productGridActiveProductIndex }),
    productGridHeaderContent: { title: '', count: '' },
    setProductGridHeaderContent: productGridHeaderContent => set({ productGridHeaderContent }),
    productHovering: null,
    setProductHovering: productHovering => set({ productHovering }),

    // Product Zoom
    productZoomImage: null,
    setProductZoomImage: productZoomImage => set({ productZoomImage }),

    // Cursor
    cursorState: null, // null, 'FOCUS', 'FOCUS_EXPLORE', 'FOCUS_DBL_CLICK_CLOSE', 'FOCUS_DBL_CLICK_EXPAND'
    setCursorState: cursorState => set({ cursorState }),
  })),
)

export default useStore
