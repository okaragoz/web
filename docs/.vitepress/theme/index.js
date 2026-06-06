import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
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
}
