import { Config } from '../../internal';

export const config: Config = {
  namespace: 'BrowserCompile',

  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
      copy: [
        {
          src: '../node_modules/@highlightjs/cdn-assets/es/highlight.js',
          dest: 'highlight.js',
          warn: true,
        },
        {
          src: '../node_modules/@highlightjs/cdn-assets/es/languages/javascript.min.js',
          dest: 'highlight-javascript.js',
          warn: true,
        },
        {
          src: '../node_modules/@highlightjs/cdn-assets/styles/default.min.css',
          dest: 'highlightjs.css',
          warn: true,
        },
        {
          src: 'preview.html',
          warn: true,
        },
        {
          src: '../node_modules/xterm/css/xterm.css',
          dest: 'xterm.css'
        }
      ],
    },
  ],
  enableCache: false,
};
