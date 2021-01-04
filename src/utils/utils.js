/* eslint-disable no-restricted-syntax */
/*
 * @Author: bird
 * @Date: 2020-11-02 11:02:31
 * @LastEditors: bird
 * @LastEditTime: 2020-11-06 16:45:32
 * @FilePath: /mt_oss/src/utils/utils.js
 */
import { parse } from 'querystring';
import numeral from 'numeral';
import { Modal, message } from 'antd';
import { history } from 'umi';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = (path) => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const normalizeFiles = (files) => {
  const streams = [];

  for (const file of files) {
    streams.push({
      path: file.filepath || file.webkitRelativePath || file.name,
      content: file,
      size: file.size,
    });
  }

  return streams;
};

export const yuan = (val) => `¥ ${numeral(val || 0).format('0,0.00')}`;

const units = {
  DAY: '天',
  MONTH: '月',
  YEAR: '年',
};
export const showConfig = (config) => {
  if (!config) {
    return '';
  }
  let { data, unit } = config;

  if (unit == 'GB' && data >= 1024) {
    unit = 'TB';
    data = numeral(data).divide(1024).format('0.[00]');
  }

  unit = units[unit] ? units[unit] : unit;
  if (!unit) {
    return data;
  }
  return `${data}${unit}`;
};

export const balanceNotEnough = () => {
  document.body.style.overflow='auto'
  Modal.confirm({
    title: '请注意!',
    content: <div>余额不足，请充值</div>,
    okText: '前往充值',
    cancelText: '取消',
    onOk: () => history.push('/usermid/recharge'),
  });
};

const unitsList = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB'];
export const b2ValueUnit = (val, fmt = '0,0.00') => {
  let unit = 'B';
  let value = numeral(val);

  unitsList.forEach((item) => {
    if (value.value() >= 1024) {
      value = value.divide(1024);
      unit = item;
    }
  });
  return [numeral(value).format(fmt), unit];
};

export const b2Show = (val) => {
  const vu = b2ValueUnit(val);
  return `${vu[0]}${vu[1]}`;
};

export const b2humen = (val) => {
  const vu = b2ValueUnit(val, '0,0.[00]');
  return `${vu[0]}${vu[1]}`;
};

export const isUpload = () => {
  return !(JSON.parse(window.sessionStorage.getItem('isUpload')||false) )
}
export const isDownload = () => {
  return !( JSON.parse(window.sessionStorage.getItem('isDownload')||false))
}
export const downloadFile = (url, name) => {
  if (isDownload()) {
    message.info('您没有下载权限！')
    return
  }
  const link = document.createElement('a');
  link.setAttribute('download', name);
  link.setAttribute('href', url);
  Object.assign(link.style, {
    position: 'absolute',
    top: 0,
    opacity: 0,
  });
  document.body.appendChild(link);
  link.click();
  link.remove();
};
