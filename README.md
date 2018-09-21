# hlsjs-LP-loader
A [livepeer](https://github.com/livepeer/livepeerjs) loader for the
[hls.js](https://github.com/video-dev/hls.js) JavaScript HLS client

based on `hlsjs-ipfs-loader`

This allows you to use any HLS.js enabled player to parse a livepeer
broadcaster address.

```javascript

  const HlsjsLPLoader = require('hlsjs-lp-loader')
  const Hls = require('hls.js')

  const broadcaster = '0x30cc044974d1f408082a41929611f1e40a2eaebe'

  const hls = new Hls({
    pLoader: HlsjsLPLoader,
    lpBoardcaster: boardcaster,
    lpConfig: {
      controllerAddress: '0x37dC71366Ec655093b9930bc816E16e6b587F968',
      provider: 'https://rinkeby.infura.io/srFaWg0SlljdJAoClX3B'
    }
  })

  // TODO , add an example.
  
```


## Example
-----------

```bash
$ npm install

$ npm run demo

# go to localhost:8080/examples/hlsjs.html

```
