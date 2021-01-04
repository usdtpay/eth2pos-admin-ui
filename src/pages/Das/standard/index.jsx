import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Row, Col, Table, Spin, Icon, Modal ,notification,Form, Input, Button} from 'antd';
import {getUserBalance, buklSend} from '../../../web3';
import {
  saveEth2Amount,
  saveRate,
  getEth2Amount,
  getRate,
  exportPowerList
} from '../services';

const FormItem = Form.Item;

const PriceInput = ({ value = {}, onChange }) => {
  const [number, setNumber] = useState(0);
  const [currency, setCurrency] = useState('rmb');

  const triggerChange = (changedValue) => {
    if (onChange) {
      onChange({
        number,
        ...value,
        ...changedValue,
      });
    }
  };

  const onNumberChange = (e) => {
    const newNumber = parseInt(e.target.value || 0, 10);

    if (Number.isNaN(number)) {
      return;
    }

    if (!('number' in value)) {
      setNumber(newNumber);
    }

    triggerChange({
      number: newNumber,
    });
  };



  return (
    <span>
      <Input
        type="text"
        value={value.number || number}
        onChange={onNumberChange}
        style={{
          width: 400,
        }}
      />
    </span>
  );
};

const columns = [
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
  const [rate, setRate] = useState(0);
  const [eth2Amount, setEth2Amount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [sendAmount, setSendAmount] = useState(10000);
  useEffect(() => {
    getRate().then((res) => {
      if (res.success && res.code === 0) {
        setRate(res.data)
      }
    });

  }, []);

  useEffect(() => {
    getEth2Amount().then((res) => {
      if (res.success && res.code === 0) {
        setEth2Amount(res.data)
      }
    });
  }, []);

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
    setLoading(true);
    exportPowerList(sendAmount).then((res) => {
      setLoading(false);
      console.log('exportPowerList',res);
      setDataList(res.data);
    });
  };

  const doBuklSend = (e)=>{
    const addrs = dataList.map(item => item.addr);
    const values = dataList.map(item => item.value);
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
    buklSend(sendAmount,addrs,values);

  };

  const onChangeRate = (e) => {
    const { value } = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      setRate(value);
    }
  };

  const onChangeEth2Amount = (e) => {
    const { value } = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      setEth2Amount(value);
    }
  };

  const onChangeSendAmount = (e) => {
    const { value } = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      setSendAmount(value);
    }
  };

  const doSaveRate = () => {
    saveRate(rate);
  };

  const doSaveEth2Amount = () => {
    saveEth2Amount(eth2Amount);

  };


  return (
    <div>
      <Row >
        <Col span={6} >
          <FormItem >
            <Input  maxLength="25"value={rate} onChange={onChangeRate}></Input>
          </FormItem>
        </Col>
        <Col span={6} >
          <FormItem >
            <Button
              type="primary"
              htmlType="submit"
              onClick={doSaveRate}
            >
              设置价格调率
            </Button>
          </FormItem>
        </Col>

        <Col span={6} >
          <FormItem >
            <Input  maxLength="25"value={eth2Amount} onChange={onChangeEth2Amount}></Input>
          </FormItem>
        </Col>
        <Col span={6} >
          <FormItem >
            <Button
              type="primary"
              htmlType="submit"
              onClick={doSaveEth2Amount}
            >
              设置ETH2数量
            </Button>
          </FormItem>
        </Col>

      </Row>
    </div>
  );
};


export default Demo;

// (({ files }) => ({
//   filesList: files.filesList,
//   progressList: files.progressList,
//   filepath: files.filepath,
// }))(Demo);
