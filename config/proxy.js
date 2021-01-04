/*
 * @Author: bird
 * @Date: 2020-11-09 21:24:36
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-11-09 22:56:53
 * @FilePath: /mtyun-oss-web/config/proxy.js
 */
/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    context: ['/lizswap/','/api/'],
    // target: 'http://10.0.0.3:8040',
    target: 'http://127.0.0.1:8086',
    changeOrigin: true,
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
};
