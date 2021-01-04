/*
 * @Author: bird
 * @Date: 2020-11-02 22:46:28
 * @LastEditors: bird
 * @LastEditTime: 2020-11-09 22:16:54
 * @FilePath: /mtyun-oss-web/.eslintrc.js
 */
module.exports = {
  root:true,
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
};
