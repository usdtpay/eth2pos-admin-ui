/* eslint-disable @typescript-eslint/lines-between-class-members */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/*
 * @Author: bird
 * @Date: 2020-11-02 15:33:51
 * @LastEditors: bird
 * @LastEditTime: 2020-11-04 23:19:01
 * @FilePath: /mtyun-oss-web/src/utils/ipfs.js
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { getIpfs, providers }   from 'ipfs-provider';
import ipfsClient, { CID } from 'ipfs-http-client';
// const { httpClient, jsIpfs } =  providers
import all from 'it-all';
import { join, dirname, basename } from 'path';

import { normalizeFiles } from '@/utils/utils';
import { sortFiles } from '@/utils/sort';


export const IGNORED_FILES = ['.DS_Store', 'thumbs.db', 'desktop.ini'];
class MyIpfs {
  constructor() {
    this.ipfs = null;
    this.provider = null;
    this.apiAddress = null;
    this.init();
  }

  init() {
    try {
      const ipfs = ipfsClient('http://0.0.0.0:5001');
      this.ipfs = ipfs;
    } catch (error) {
      throw Error('Could not connect to the IPFS API', error);
    }
  }

  async savetoIpfs(source, onProgress) {
    const fileDetails = normalizeFiles(source);
    const files = fileDetails
      .filter(($) => !IGNORED_FILES.includes(basename($.path)))
      .map(($) => ($.path[0] === '/' ? { ...$, path: $.path.slice(1) } : $));
    console.log(files);
    try {
      return all(
        this.ipfs.addAll(files, {
          pin: false,
          wrapWithDirectory: false,
          progress: (envet) => onProgress({ percent: envet / 262144 }),
        }),
      );
    } catch (error) {
      console.log(error);
      // return throw(error);
    }
  }
  async dirStats(cid, path) {
    const res = (await all(this.ipfs.ls(cid))) || [];
    const files = [];
    const showStats = res.length < 100;

    // eslint-disable-next-line no-restricted-syntax
    for (const f of res) {
      const absPath = join(path, f.name);
      let file = null;

      if (showStats && (f.type === 'directory' || f.type === 'dir')) {
        // eslint-disable-next-line no-await-in-loop
        file = MyIpfs.fileFromStats({ ...(await this.stat(f.cid)), path: absPath });
      } else {
        file = MyIpfs.fileFromStats({ ...f, path: absPath });
      }
      files.push(file);
    }
    return {
      path,
      fetched: Date.now(),
      type: 'directory',
      cid,
      upper: null,
      content: sortFiles(files),
    };
  }
  async stat(cidOrPath) {
    const hashOrPath = cidOrPath.toString();
    const path = hashOrPath.startsWith('/') ? hashOrPath : `/ipfs/${hashOrPath}`;

    try {
      const stats = await this.ipfs.files.stat(path);
      return { path, ...stats };
    } catch (e) {
      // Discard error and mark DAG as 'unknown' to unblock listing other pins.
      // Clicking on 'unknown' entry will open it in Inspector.
      // No information is lost: if there is an error related
      // to specified hashOrPath user will read it in Inspector.
      const [, , cid] = path.split('/');
      return {
        path: hashOrPath,
        cid: new CID(cid),
        type: 'unknown',
        size: 0,
      };
    }
  }
  static fileFromStats(
    { cumulativeSize, type, size, cid, name, path, pinned, isParent },
    prefix = '/ipfs',
  ) {
    return {
      size: cumulativeSize || size || 0,
      type: type === 'dir' ? 'directory' : type,
      cid,
      name: name || path.split('/').pop() || cid.toString(),
      path: path || `${prefix}/${cid.toString()}`,
      pinned: Boolean(pinned),
      isParent,
    };
  }

  getInstance(name) {
    if (!this.instance) {
      this.instance = new MyIpfs(name);
    }
    return this.instance;
  }
}
export default new MyIpfs();
