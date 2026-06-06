import DefaultTheme from 'vitepress/theme'
import { h, onMounted } from 'vue'
import Home from './Home.vue'
import ListCard from './ListCard.vue'
import PostHeader from './PostHeader.vue'
import Footer from './Footer.vue'
import Research from './Research.vue'
import Publications from './Publications.vue'
import CardSlider from './CardSlider.vue'
import BlogList from './BlogList.vue'
import Contact from './Contact.vue'
import PageHero from './PageHero.vue'
import Faq from './Faq.vue'
import AudioPlayer from './AudioPlayer.vue'
import NewsBanner from './NewsBanner.vue'
import NotFound from './NotFound.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(PostHeader),
      'layout-bottom': () => h(Footer),
      'not-found': () => h(NotFound),
    })
  },
  enhanceApp({ app }) {
    app.component('Home', Home)
    app.component('ListCard', ListCard)
    app.component('PostHeader', PostHeader)
    app.component('Footer', Footer)
    app.component('Research', Research)
    app.component('Publications', Publications)
    app.component('CardSlider', CardSlider)
    app.component('BlogList', BlogList)
    app.component('Contact', Contact)
    app.component('PageHero', PageHero)
    app.component('Faq', Faq)
    app.component('NewsBanner', NewsBanner)
    app.component('AudioPlayer', AudioPlayer)
  },
  setup() {
    if (import.meta.env.SSR) return
    onMounted(() => {
      // Click-to-zoom for post body images (event delegation = survives route changes)
      document.addEventListener('click', (e) => {
        const img = e.target
        if (!(img instanceof HTMLImageElement)) return
        if (!img.closest('.vp-doc')) return
        const container = img.closest('.content-container')
        if (!container || !container.querySelector('.ok-posthead')) return

        const overlay = document.createElement('div')
        overlay.className = 'ok-zoom-overlay'
        const big = document.createElement('img')
        big.src = img.currentSrc || img.src
        big.alt = img.alt || ''
        overlay.appendChild(big)
        document.body.appendChild(overlay)
        requestAnimationFrame(() => overlay.classList.add('is-open'))

        const close = () => {
          overlay.classList.remove('is-open')
          setTimeout(() => overlay.remove(), 200)
          document.removeEventListener('keydown', onKey)
        }
        const onKey = (ev) => { if (ev.key === 'Escape') close() }
        overlay.addEventListener('click', close)
        document.addEventListener('keydown', onKey)
      })
    })
  },
}
