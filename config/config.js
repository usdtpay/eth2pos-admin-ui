// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zhCN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  pwa: false,
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path:'/',
      component: '../layouts/BlankLayout',
      routes:[
        {
          path: '/',
          redirect: '/das/standard',
        },
        {
          path: '/index',
          component: './Index',
        },
        {
          path: '/user',
          component: '../layouts/UserLayout',
          routes: [
            {
              name: 'login',
              path: '/user/login',
              component: './user/login',
            },
            {
              name: 'register',
              path: '/user/register',
              component: './user/register/index',
            },
            {
              name: 'setPassword',
              path: '/user/setPassword',
              component: './user/setpassword/index',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/SecurityLayout',
          routes: [
            {
              path: '/',
              component: '../layouts/BasicLayout',
              // authority: ['admin', 'user'],
              routes: [
                {
                  path: '/das',
                  name: '后台管理',
                  icon: 'CloudUploadOutlined',
                  routes: [
                    {
                      name: '价格管理',
                      path: '/das/standard',
                      component: './Das/standard',
                    },
                    {
                      name: '批量打币',
                      path: '/das/bulksend',
                      component: './Das/bulksend',
                    },
                  ],
                },

                {
                  component: './404',
                },
              ],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ]
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
    'menu-dark-submenu-bg': '#18004A',
    'layout-header-background': '#18004A',
    'progress-text-color':'#333333',
    'blue-base':'#5584ff',
      },
  extraBabelPlugins: [
    IS_PROD ? 'transform-remove-console' : ""
  ],

  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // outputPath: '/Volumes/mtyun-oss-web/dist/'
  base: '/eth2admin/',
  publicPath: '/eth2admin/',
});
