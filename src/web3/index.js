import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import {
  buldSendAbi
} from './abi';
import {
  erc20Abi
} from './erc20Abi';

export const GetQueryString = (name) => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};
// const buldSendAbiAddr = '0x6742025AD3EBe6f252de70A80AF28B184e8ADC08';
// const buldSendAbiAddr = '0xD6493D2e9662390963089DE027e8a55d5199bd52'; //只有send eth版
// const buldSendAbiAddr = '0x260adEE2F0E253bfF43Fe4caFB65e957b77975E6';   //send()
// export const buldSendAbiAddr = '0x8f16a0E3A602d7DBC197C34E95a458EaB8869Ce9';   //send()+send2() 测试
export const buldSendAbiAddr = '0x9548c495AFD48593C3C5100E2B41b5f30c021FC8'; //正式


let web3;
const desiredNetwork = GetQueryString('nw') || 1;

if (typeof window.ethereum === 'undefined') {
  alert('Looks like you need a Dapp browser to get started.');
  alert('Consider installing MetaMask!');
} else {
  // In the case the user has MetaMask installed, you can easily ask them to sign
  /* in and reveal their accounts: */
  // eslint-disable-next-line no-undef
  ethereum.autoRefreshOnNetworkChange = false;
  ethereum
    .enable()
    // 记住处理他们拒绝请求的案例：
    .catch((reason) => {
      if (reason === 'User rejected provider access') {
        // 用户拒绝访问程序 用户不想登录
      } else {
        // This shouldn't happen, so you might want to log this...
      }
    })

    // 如果他们批准了登录请求，您将收到他们的帐户：
    .then((accounts) => {
      /* 您还应验证用户是否在正确的网络上： */
      // eslint-disable-next-line no-undef
      // eslint-disable-next-line eqeqeq
      if (ethereum.networkVersion != desiredNetwork) {
        console.log('当前网络', ethereum.networkVersion);
        console.log('当前网络', desiredNetwork);
        // eslint-disable-next-line eqeqeq
        console.log('当前网络', ethereum.networkVersion == desiredNetwork);
        // alert('注意：当前为测试网络!');

        // We plan to provide an API to make this request in the near future.
        // https://github.com/MetaMask/metamask-extension/issues/3663
      }

      // 一旦您有了对用户帐户的引用， 您可以建议交易和签名：
      const defaultAccount = accounts[0];
      // window.location.reload();
      console.log(defaultAccount);
      // ethereum.on('networkChanged', (networkIDstring) => {
      //   console.log(networkIDstring);
      //   // if()
      //   window.location.reload();
      // });
    });
}

if (typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined') {
  // Web3 browser user detected. You can now use the provider.
  const provider = window.ethereum || window.web3.currentProvider;
  web3 = new Web3(provider);
}

try {
  window.web33 = web3.utils;
} catch (e) {
  layer.open({
    content: 'open MetaMask',
    skin: 'msg',
    time: 2, // 2秒后自动关闭
  });
}
const sendContract = new web3.eth.Contract(buldSendAbi, buldSendAbiAddr);


// eslint-disable-next-line max-len
export const getAddress = () => {
  let a;
  try {
    a = ethereum.selectedAddress || web3.eth.defaultAccount || web3.currentProvider.selectedAddress;
  } catch (e) {
    // TODO handle the exception
    console.log(e);
  }
  return a;
};
export const getUserBalance = () => web3.eth.getBalance(getAddress());

export const getErc20Balance = (tokenAddress, userAddr) => {
  if(!userAddr){
    userAddr = getAddress();
  }
  const tokenInst = new web3.eth.Contract(erc20Abi, tokenAddress);
  return tokenInst.methods.balanceOf(userAddr).call();
};

export const transferErc20Balance = (tokenAddress, value) => {
  // if(!toAddr){
  //   toAddr = getAddress();
  // }
  const tokenInst = new web3.eth.Contract(erc20Abi, tokenAddress);
  return tokenInst.methods.transfer(buldSendAbiAddr, value).send({ from: getAddress() });
};

export const getErc20Allowance = (tokenAddress) => {
  const tokenInst = new web3.eth.Contract(erc20Abi, tokenAddress);
  return tokenInst.methods.allowance(getAddress(),buldSendAbiAddr).call();
};

export const setErc20Approve = (tokenAddress, value) => {
  const tokenInst = new web3.eth.Contract(erc20Abi, tokenAddress);
  return tokenInst.methods.approve(buldSendAbiAddr, value).send({ from: getAddress() });
};


export const buklSend = (amount, addrs, values) => sendContract.methods.bulksend(addrs,values).send({ from: getAddress(), value: amount });
export const multiSendToken = (tokenAddr, addrs, values) => sendContract.methods.multisendToken2(tokenAddr,addrs,values).send({ from: getAddress() });


