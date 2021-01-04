
import { stringify } from 'querystring';
import { history } from 'umi';
import { userAccountLogin, userRegister } from '@/services/login';
import { setAuthority, setDataToken } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(userAccountLogin, payload);
      if (response.success) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            remember: payload.remember,
            ...response,
            status: true,
          },
        }); // Login successfully



        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        history.replace(redirect || '/');
      }
    },
    *register({ payload }, { call, put }) {
      const response = yield call(userRegister, payload)
      if (response.success) {
        message.info('注册成功')
        history.push('/user/login')
      }

    },
    logout() {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note
      localStorage.clear()
      sessionStorage.clear()

      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
        window.location.reload()
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      setDataToken(payload.token.body, payload.remember)
      return { ...state, status: payload.status };
    },
  },
};
export default Model;
