import { userInfo } from '@/services/user';
import { history } from 'umi'
const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {"username":"退出"},
  },
  effects: {
    // *fetchCurrent(_, { call, put }) {
    //   let response = yield call(userInfo);
    //   response = {"success":true,"code":0,"msg":"success","data":{"username":"cuijian","mobile":"178****1935","type":2},"total":0}
    //   yield put({
    //     type: 'saveCurrentUser',
    //     payload: response.data,
    //   });
    // },
  },
  reducers: {
    saveCurrentUser(state, action) {
      // console.log(action)
      const status = action.payload.status;
      if ((1 & status) === 0) {
        history.push('/user/login')
        return null;
      }
      window.sessionStorage.setItem('isDownload', (2 & status) != 0);
      window.sessionStorage.setItem('isUpload', (4 & status) != 0);
      return { ...state, currentUser: action.payload || {} };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
