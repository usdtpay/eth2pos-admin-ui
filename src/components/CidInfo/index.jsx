/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import Buffer from 'buffer';
import { decodeCid } from './decode-cid';

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => (`00${  x.toString(16)}`).slice(-2)).join('');
}

function extractInfo  (cid) {
  const cidInfo = decodeCid(cid);

  const hashFn = cidInfo.multihash.name;
  const hashFnCode = cidInfo.multihash.code.toString('16');
  const hashLengthCode = cidInfo.multihash.length.toString('16');
  const hashLengthInBits = cidInfo.multihash.length * 8;
  const hashValue = buf2hex(cidInfo.multihash.digest.buffer)

  const hashValueIn32CharChunks = hashValue.split('').reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / 32);
    if (!resultArray[chunkIndex]) {
      // eslint-disable-next-line no-param-reassign
      resultArray[chunkIndex] = []; // start a new chunk
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);

  const humanReadable = `${cidInfo.multibase.name} - cidv${cidInfo.cid.version} - ${cidInfo.cid.codec} - ${hashFn}-${hashLengthInBits}-${hashValue}`;
  return {
    hashFn,
    hashFnCode,
    hashLengthCode,
    hashLengthInBits,
    hashValue,
    hashValueIn32CharChunks,
    humanReadable,
  };
};

export const CidInfo = ({ tReady, cid, className, ...props }) => {
  let cidErr = null;
  let cidInfo = null;
  try {
    cidInfo = cid ? extractInfo(cid) : null;
  } catch (err) {
    cidErr = err;
  }
  console.log(cid);
  return !cid ? null : (
    <section className={`ph3 pv4 sans-serif ${className}`} {...props}>
      <label className="db pb2">
        <a
          className="tracked ttu f5 fw2 teal-muted hover-aqua link"
          href="https://docs.ipfs.io/guides/concepts/cid/"
        >
          CID 信息
        </a>
      </label>
      {!cidInfo ? null : (
        <div>
          <div className="f7 monospace fw4 ma0 pb2 truncate gray">{cid}</div>
          <div className="f6 sans-serif fw4 ma0 pb2 truncate" id="CidInfo-human-readable-cid">
            {cidInfo.humanReadable}
          </div>
          <label htmlFor="CidInfo-human-readable-cid" className="db fw2 ma0 gray ttu f7 tracked">
            基点 - 版本 - 编解码 - 聚合哈希
          </label>
          <a
            href="https://github.com/multiformats/multihash#visual-examples"
            className="dib tracked ttu f6 fw2 teal-muted hover-aqua link mt4"
          >
            聚合哈希
          </a>
          <div>
            <div className="dib monospace f6 pt2 tr dark-gray lh-title ph2">
              <code className="gray">0x</code>
              <span className="orange">{cidInfo.hashFnCode}</span>
              <span className="green">{cidInfo.hashLengthCode}</span>
              <span id="CidInfo-multihash">
                {cidInfo.hashValueIn32CharChunks.map((chunk) => (
                  <span key={chunk.join('')}>
                    {chunk.join('')}
                    <br />
                  </span>
                ))}
              </span>
              <label htmlFor="CidInfo-multihash" className="sans-serif fw2 ma0 gray ttu f7 tracked">
                哈希摘要
              </label>
              <div className="tl lh-copy">
                <a
                  className="db link orange pt2"
                  href="https://github.com/multiformats/multicodec/blob/master/table.csv"
                >
                  <code className="gray">0x</code>
                  <code>{cidInfo.hashFnCode}</code> = {cidInfo.hashFn}
                </a>
                <div id="CidInfo-multihash" className="green">
                  <code className="gray">0x</code>
                  <code>{cidInfo.hashLengthCode}</code> = {cidInfo.hashLengthInBits} bits
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {!cidErr ? null : (
        <div>
          <div className="f5 sans-serif fw5 ma0 pv2 truncate navy">{cid}</div>
          <div className="red fw2 ma0 f7">{cidErr.message}</div>
        </div>
      )}
    </section>
  );
};

export default CidInfo;
