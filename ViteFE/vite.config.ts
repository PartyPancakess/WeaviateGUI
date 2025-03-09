import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html';
import { resolve } from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig(({}) => {
    return {
      resolve: {
        alias: {
          '@': resolve(__dirname, './src'),
        },
      },
      css: {
        preprocessorOptions: {
          scss: {
            api: 'modern-compiler',
          },
        },
      },
      build: {
        rollupOptions: {
          output: {
            assetFileNames: 'assets/[hash][extname]',
            chunkFileNames: '[hash].js',
            entryFileNames: '[name].js',
          },
        },
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: false,
            drop_debugger: true,
            pure_funcs: ['console.log'],
          },
          format: {
            comments: false,
          },
        },
      },
      plugins: [
        vue(),
        vueJsx({}),
        AutoImport({
          imports: [
            'vue',
            'vue-router',
            'vue-i18n',
            'date-fns',
            {
              'naive-ui': [
                'useDialog',
                'useMessage',
                'useNotification',
                'useLoadingBar',
                'useModal',
                'createDiscreteApi',
                'useThemeVars',
              ],
            },
          ],
          defaultExportByFilename: false,
          resolvers: [],
          dts: true,
        }),
        Components({
          dts: true,
          types: [
            {
              from: 'vue-router',
              names: ['RouterLink', 'RouterView'],
            },
          ],
          resolvers: [NaiveUiResolver()],
        }),
        createHtmlPlugin({
          minify: true,
          inject: {
            data: {
              title: "WeaviateGUI",
            },
          },
        }),
      ],
    };
  });
