'use strict'

import Vue from 'vue'
import Vuei18n from 'vue-i18n'
import browserLocale from 'browser-locale'
import $ from 'jquery'
import _ from 'lodash'
import schedule from './schedule'

Vue.use(Vuei18n)

let locales = {
  en: {
    page: require('./locales/en/page').default,
    speakers: require('./locales/en/speakers').default
  },
  pt: {
    page: require('./locales/pt/page').default,
    speakers: require('./locales/pt/speakers').default
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
    let speakers = mergeSpeakers(locales[this.lang()].speakers)

    return {
      speakers,
      schedule: {
        day: 1,
        data: buildSchedule(schedule, speakers)
      }
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
    }
  }
})

vm.$lang.$watch('lang', (lang) => {
  vm.speakers = mergeSpeakers(locales[vm.lang()].speakers)
  vm.schedule.data = buildSchedule(vm.schedule.data, vm.speakers)
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
  .map((speaker) => _.merge(
    speaker,
    _.find(translated, {
      slug: speaker.slug
    })
  ))
  .shuffle()
  .value()
}

/**
 * Inserts each speaker into the proper schedule item
 * @param {Array} schedule An array containing the schedule items
 * @param {Array} speakers An array containing the speakers
 * @return {Array} An array with the modified schedule containing the speaker
 */
function buildSchedule (schedule, speakers) {
  return schedule
  .map((data) => {
    if (data.speaker_slug) {
      data.speaker = _.find(speakers, { slug: data.speaker_slug })
    }

    return data
  })
}

// Enable hot reloading
if (module && module.hot) {
  module.hot.accept()
}

