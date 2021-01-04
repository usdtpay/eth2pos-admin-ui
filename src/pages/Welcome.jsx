import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography, Upload, message, Button } from 'antd';
import MyIpfs,{IGNORED_FILES} from '@/utils/ipfs';
import { InboxOutlined } from '@ant-design/icons';

import styles from './Welcome.less';

const { Dragger } = Upload;
(async () => {
   const result = await MyIpfs.dirStats(
      'QmUR8ZoQVXzYpKaWBMmBwETQ5cxxbxoVK4wJmxJpUyVPCJ',
      '/ipfs/QmUR8ZoQVXzYpKaWBMmBwETQ5cxxbxoVK4wJmxJpUyVPCJ',
   );

})()

export default () => {
  const [fileList, updateFileList] = useState([]);
  const props = {
    directory: true,
    multiple: true,
    fileList,
    beforeUpload:  (file, fileList) => {
      // return false;
      // const result = await MyIpfs.savetoIpfs(fileList); const uploadSize =
      // fileList.reduce((prev, { size }) => prev + size, 0); // Just estimate
      // download size to be around 10% of upload size. const downloadSize =
      // (uploadSize * 10) / 100; const totalSize = uploadSize + downloadSize;
      //  return false;
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
    },
    onRemove() {
      return false;
    },
    // onProgress(percent) {  }
    showUploadList: {
      showDownloadIcon: false,
      showRemoveIcon: false,
    },

    customRequest({ file, onError, onProgress, onSuccess }) {
      MyIpfs.savetoIpfs([file], onProgress)
        .then((res) => {

          onSuccess(res, file);
        })
        .catch(onError);

      // MyIpfs.savetoIpfs(fileList)
    },
    onChange(info) {
      updateFileList(info.fileList.filter(file => !IGNORED_FILES.includes(file.name)))
      const { status } = info.file;
      console.log(info.file);
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <PageContainer>
      <Card>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from uploading company data or
            other band files
          </p>
        </Dragger>
      </Card>
    </PageContainer>
  );
};
