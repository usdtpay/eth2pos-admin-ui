import { message } from 'antd';

const validateTrigger = 'onBlur'

export const regMobile = {
  pattern: /^1\d{10}$/,
  message: '请输入正确的手机号',
  validateTrigger
}

export const regUserName = {
  pattern: /^.{3,30}$/,
  message: '请输入3-30位的用户名',
  validateTrigger
}

export const regPassword = {
  pattern: /^.{6,30}$/,
  message: '请输入6-30位的密码',
  validateTrigger
}

export const regCaptcha = {
  pattern: /^\d{6}$/,
  message: '请输入6位数字验证码',
  validateTrigger
}

// 不合法的用户名（或密码），仅支持字母、数字、特殊符号_或-
export const regChar = {
  pattern: /^[a-zA-Z0-9_-]{3,30}$/,
  message: '不合法的用户名（或密码），仅支持字母、数字、特殊符号_或-',
  validateTrigger
}

export const isMobile = (value) => {
  return regMobile.pattern.test(value) || errorText(regMobile.message)
}

export const isUserName = (value) => {
  return regUserName.pattern.test(value) || errorText(regUserName.message)
}

export const isPassword = (value) => {
  return regPassword.pattern.test(value) || errorText(regPassword.message)
}

export const isCaptcha = (value) => {
  return regCaptcha.pattern.test(value) || errorText(regCaptcha.message)
}

const errorText = description => {
  message.error(description)
  return false;
}
