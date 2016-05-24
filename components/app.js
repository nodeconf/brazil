'use strict'

import Vue from 'vue'
import Vuei18n from 'vue-i18n'
import browserLocale from 'browser-locale'
import $ from 'jquery'
import _ from 'lodash'

Vue.use(Vuei18n)

let locales = {
  en: {
    page: require('./locales/en/page').default,
    speakers: require('./locales/en/speakers').default
  },
  pt: {
    page: require('./locales/pt/page').default,
    speakers: require('./locales/pt/speakers').default,
    talks: require('./locales/pt/talks').default
  }
}

// Install locales
Object.keys(locales).forEach((lang) => Vue.locale(lang, locales[lang]))

// Set the locale or fallback to portuguese
if (browserLocale()) {
  let locale = browserLocale().split('-').shift()

  // Check if the locale is supported
  // TODO include en when the locale is supported
  if (['en', 'pt'].includes(locale)) {
    Vue.config.lang = locale
  } else {
    Vue.config.lang = 'pt'
  }
} else {
  Vue.config.lang = 'pt'
}

Vue.filter('dashed', (value) => {
  return value
    .toLowerCase()
    .replace(' ', '-')
})

let vm = new Vue({ // eslint-disable-line no-new
  el: 'body',
  data () {
    return {
      speakers: mergeSpeakers(locales[this.lang()].speakers),
      talks: mergeTalks(locales[this.lang()].talks, 'day1')
    }
  },
  methods: {
    lang () {
      return this.$lang.lang
    },
    modal (id) {
      let scrollPosition = document.body.scrollTop

      // Prevent top scrolling
      $(`#${id}`).modal('toggle')
      .on('hide.bs.modal', () => {
        document.body.scrollTop = scrollPosition
      })
    },
    toggleLocale (lang) {
      Vue.config.lang = Vue.config.lang === 'pt' ? 'en' : 'pt'
    },
    showDay (dayNumber) {
      vm.talks = mergeTalks(locales[vm.lang()].talks, 'day'+dayNumber) 
    }
  }
})

vm.$lang.$watch('lang', (lang) => {
  vm.speakers = mergeSpeakers(locales[vm.lang()].speakers)
  vm.talks = mergeTalks(locales[vm.lang()].talks, 'day1')
})

/**
 * returns all speakers and replace those who have translations
 * @param {array} translated an array with translated speakers
 * @return {array} a new array with every speaker replacing those who have translation
 */
function mergeSpeakers (translated) {
  let speakers = locales.pt.speakers
  return _.chain(speakers)
  .clone(speakers)
  .map((speaker) => _.find(translated, {
    slug: speaker.slug
  }) || _.find(speakers, { slug: speaker.slug }))
  .shuffle()
  .value()
}

/**
 * returns all talks and replace those who have translations
 * @param {array} translated an array with translated talks 
 * @return {array} a new array with every talk replacing those who have translation
 */
function mergeTalks (translated, day) {
  console.log(Vue.config.day)
  let talks = locales.pt.talks[day]
  return _.chain(talks)
  .clone(talks)
  .map((talk) => _.find(translated, {
    time: talk.time
  }) || _.find(talks, { time: talk.time }))
  .value()
}

// Enable hot reloading
if (module && module.hot) {
  module.hot.accept()
}

