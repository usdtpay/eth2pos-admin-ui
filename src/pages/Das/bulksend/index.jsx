import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Row, Col, Table, Spin, Icon, Modal ,notification,Form, Input, Button,Popconfirm} from 'antd';
import {buldSendAbiAddr,getUserBalance,getErc20Balance, getErc20Allowance,setErc20Approve, buklSend, multiSendToken, transferErc20Balance} from '../../../web3';
import {
  saveEth2Amount,
  saveRate,
  getEth2Amount,
  getRate,
  exportPowerList
} from '../services';

const FormItem = Form.Item;

const decimal = 18;

const columns = [
  {
    title: '序号',
    render: (text, record, index) => `${index + 1}`,
    width:20,
  },
  {
    title: '地址',
    dataIndex: 'addr',
    width:100,
  },
  {
    title: '算力',
    dataIndex: 'power',
    width:100,
  },
  {
    title: '总算力',
    dataIndex: 'totalPower',
    width:100,
  },
  {
    title: '分币',
    dataIndex: 'value',
    width:100,
  },
];

const Demo = () => {
  // const [tokenAddr, setTokenAddr] = useState("0xa7A071b40c91e70B7Fd88eBf1ecfaAcFc9bE9928"); //测试网
  const [tokenAddr, setTokenAddr] = useState("0x0698DDA3c390FF92722f9EeD766D8b1727621Df9"); //正式网
  const [approveValue, setApproveValue] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [sendAmount, setSendAmount] = useState(1);
  const [scanHeightStr, setScanHeightStr] = useState('');
  const [confirmStr, setConfirmStr] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);


  useEffect(() => {
    getUserBalance().then((res) => {
      console.log('getUserBalance',res)
    });
  }, []);
  //
  // useEffect(() => {
  //   doExportPowerList();
  // }, []);

  const doExportPowerList = (e)=>{
    const val = Math.pow(10,decimal)*sendAmount;
    console.log('sendAmount = ',val);

    setLoading(true);
    exportPowerList(val).then((res) => {
      setLoading(false);
      console.log('exportPowerList',res);
      if(res.data == null){
        notification.error("读取失败，请重试");
        return;
      }

      setDataList(res.data.list);
      setScanHeightStr(`当前扫描高度: ${res.data.scanHeight}`);
    },(err)=>{
      setLoading(false);
      notification.error(err);
    });
  };

  const onSendClick = () =>{
    const selected = dataList.filter(item=>{
      return selectedRowKeys.find(subItem=>item.addr === subItem);
    });
    // const sum = selected.reduce(( acc, cur ) => {
    //   return acc.value + cur.value
    // }, 0);

    // let sum = 0;
    // selected.map(item => sum = sum+item.value);
    //共${sum}个token
    setConfirmStr(`确定给${selected.length}个账号发交易？`);
    setConfirmVisible(true);
  };
  const doBuklSend = (e)=>{
    setConfirmVisible(false);
    const selected = dataList.filter(item=>{
      return selectedRowKeys.find(subItem=>item.addr === subItem);
    });

    const addrs = selected.map(item => item.addr);
    const values = selected.map(item => ""+item.value);
    if(addrs.length === 0){
      notification.error({
        message: `未获取算力`,
      });
      return;
    }
    if(addrs.length > 200){
      notification.error({
        message: `单次交易不能超过200个地址`,
      });
      return;
    }
    setSendLoading(true);
    multiSendToken(tokenAddr,addrs,values).then((res)=>{
      notification.success({
        message: `发送成功`,
      });
      const left = dataList.filter(item=>{
        return !selectedRowKeys.find(subItem=>item.addr === subItem);
      });
      setDataList(left);
      setSelectedRowKeys([]);
      setSendLoading(false);
    },(err)=>{
      setSendLoading(false);
      notification.error(err);
    });

  };

  const onChangeTokenAddr = (e) => {
    const { value } = e.target;
    setTokenAddr(value);
  };

  const onChangeEth2Amount = (e) => {
    const { value } = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      setApproveValue(value);
    }
  };

  const onChangeSendAmount = (e) => {
    const { value } = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      setSendAmount(value);
    }
  };

  const doSetTokenAddr = () => {
    getErc20Balance(tokenAddr,buldSendAbiAddr).then((res)=>{
      console.log("getErc20Balance", res);
      // setApproveValue(res);
      const val =  res/Math.pow(10,decimal);
      setTokenBalance(val);
    });

    // getErc20Allowance(tokenAddr).then((res)=>{
    //   console.log("getErc20Allowance", res);
    //   setApproveValue(res);
    // });
  };

  const doApprove = () => {
    setApproveLoading(true);

    const val = Math.pow(10,decimal)*approveValue;
    console.log('approveValue = ',val);


    transferErc20Balance(tokenAddr,''+val).then((res)=>{
      console.log("setErc20Approve", res);
      notification.success({
        message: `预存成功`,
      });
      setApproveLoading(false);
    }, (err)=>{
      setApproveLoading(false);
      notification.error({
        message: `预存失败: ${err.message}`,
      });
    });

    // setErc20Approve(tokenAddr,approveValue).then((res)=>{
    //   console.log("setErc20Approve", res);
    //   notification.success({
    //     message: `预授权成功`,
    //   });
    //   setApproveLoading(false);
    // }, (err)=>{
    //   setApproveLoading(false);
    //   notification.error({
    //     message: `预授权失败${err}`,
    //   });
    // });
  };

  // const onSelectChange = selectedRowKeys => {
  //   console.log('selectedRowKeys changed: ', selectedRowKeys);
  //   this.setState({ selectedRowKeys });
  // };

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div>
      <Row >
        <Col span={10} >
          <FormItem >
            <Input  maxLength="44"value={tokenAddr} onChange={onChangeTokenAddr} ></Input>
          </FormItem>
        </Col>
        <Col span={2} >
          <FormItem >
            <Button
              type="primary"
              htmlType="submit"
              onClick={doSetTokenAddr}
            >
              设置token
            </Button>
          </FormItem>
        </Col>
      </Row>

      <Row >
        <Col span={10} >
          {`注意合约余额:${tokenBalance}`}
        </Col>
        <Col span={2} >

        </Col>
      </Row>

      <Row >
        <Col span={10} >
          <FormItem >
            <Input  maxLength="25"value={approveValue} onChange={onChangeEth2Amount}></Input>
          </FormItem>
        </Col>
        <Col span={2} >
          <FormItem >
            <Button
              type="primary"
              htmlType="submit"
              loading={approveLoading}
              onClick={doApprove}
            >
              预存token
            </Button>
          </FormItem>
        </Col>

      </Row>
      <Row>
        <Col span={10} >
          <Input  maxLength="32" value={sendAmount} onChange={onChangeSendAmount}></Input>
        </Col>
        <Col span={4}>
          <Button type=""   onClick={doExportPowerList} loading={loading}>
            获取算力
          </Button>
        </Col>
        <Col span={4} >
          <Popconfirm
            title={confirmStr}
            visible={confirmVisible}
            onConfirm={doBuklSend}
            onCancel={()=>{setConfirmVisible(false)}}
            okText="确定"
            cancelText="取消"
          >
            <Button type="primary"  onClick={onSendClick} loading={sendLoading}>
              发送交易
            </Button>
          </Popconfirm>
        </Col>
      </Row>
      <div >
        {scanHeightStr}
      </div>
      <Spin spinning={loading} tip="正在读取数据中...">
        <Table
          rowSelection={rowSelection}
          rowKey={record => record.addr}
          dataSource={dataList}
          columns={columns}
          bordered
          pagination={false}
          size="small"
        />
      </Spin>


    </div>
  );
};


export default Demo;

// (({ files }) => ({
//   filesList: files.filesList,
//   progressList: files.progressList,
//   filepath: files.filepath,
// }))(Demo);
