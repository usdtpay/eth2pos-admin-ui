/*
 * @Author: bird
 * @Date: 2020-11-05 21:29:32
 * @LastEditors: bird
 * @LastEditTime: 2020-11-05 23:00:14
 * @FilePath: /mtyun-oss-web/src/components/CidInfo/decode-cid.js
 */
import CID from 'cids';
import multihash from 'multihashes';
import multibaseConstants from 'multibase/src/constants';
import mutlicodecVarintTable from 'multicodec/src/varint-table';

export function decodeCid(value) {
  const cid = new CID(value).toJSON();
  if (cid.version === 0) {
    return decodeCidV0(value, cid);
  }
  if (cid.version === 1) {
    return decodeCidV1(value, cid);
  }
  throw new Error('Unknown CID version', cid.version, cid);
}

// cidv0 ::= <multihash-content-address>
// QmRds34t1KFiatDY6yJFj8U9VPTLvSMsR63y7qdUV3RMmT
export function decodeCidV0(value, cid) {
  return {
    cid,
    multibase: {
      name: 'base58btc',
      code: 'implicit',
    },
    multicodec: {
      name: cid.codec,
      code: 'implicit',
    },
    multihash: multihash.decode(cid.hash),
  };
}

// <cidv1> ::= <multibase-prefix><cid-version><multicodec-content-type><multihash-content-address>
// zb2rhiVd5G2DSpnbYtty8NhYHeDvNkPxjSqA7YbDPuhdihj9L
export function decodeCidV1(value, cid) {
  return {
    cid,
    multibase: multibaseConstants.codes[value.substring(0, 1)],
    multicodec: {
      name: cid.codec,
      code: '0x' + mutlicodecVarintTable[cid.codec].toString('hex'),
    },
    multihash: multihash.decode(cid.hash),
  };
}
