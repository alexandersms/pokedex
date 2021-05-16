import { NuxtConfig } from '@nuxt/types';
import { ProvidePlugin, NormalModuleReplacementPlugin } from 'webpack';
import axios from 'axios';
import { Pokemon } from '@/model/pokemon';

const config: NuxtConfig = {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'pokedex',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  css: [
    '@/assets/styles/main.scss',
  ],

  plugins: [
    '@/plugins/axios.ts',
  ],

  components: true,
  buildModules: [
    '@nuxt/typescript-build',
    'nuxt-typed-vuex',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa'
  ],

  axios: {},

  pwa: {
    meta: {
      name: 'Comptalib-Pokédex',
      nativeUI: true,
    },
    manifest: {
      name: 'Comptalib-Pokédex',
      short_name: 'Comptalib-Pokédex',
      description: 'The Pokédex contains detailed stats for every creature from the Pokémon games',
      lang: 'en',
    },
    con: {
      source: 'static/icon.png',
      fileName: 'app-icon.png'
    },
  },
  build: {
    transpile: [
      /typed-vuex/,
    ],
    extend(config, ctx) {
      if (process.env.NODE_ENV === 'production') {
        config.plugins?.push(new NormalModuleReplacementPlugin(
          /environment\/defaults\.json/,
          '@/environment/defaults.prod.json'
        ));
      }
    },
    plugins: [
      new ProvidePlugin({
        '_': 'lodash',
      }),
    ],
  },
  colorMode: {
    preference: 'light',
    fallback: 'system',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode',
  },
  generate: {
    routes: () => {
      return axios.get('https://pokeapi.co/api/v2/pokemon?limit=1118')
      .then((response) => {
        return response.data.results.map((post: Pokemon) => {
          return '/' + post.name;
        });
      })
    },
  },
}

export default config;
