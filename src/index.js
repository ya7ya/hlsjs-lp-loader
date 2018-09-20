'use strict'
global.Buffer = global.Buffer || require('buffer').Buffer

const { EventEmitter } = require('events')
const debug = require('debug')('lp:hlsjs')
const LivepeerSDK = require('@livepeer/sdk').default
const XhrLoader = require('./xhr-loader').default

const MAX_BLOCKS_AGO = 50000

export default class HlsjsLPLoader extends XhrLoader {
  constructor (config) {
    super(config)
    this.gateway = config.gateway || 'http://localhost:8935'
    this.emitter = config.emitter || new EventEmitter()
    this.lpConfig = config.lpConfig
    this.broadcaster = config.lpBroadcaster

    console.info('hlsjs-LP-loader ready ', config)

    var load = this.load.bind(this)
    this.load = (context, config, callbacks) => {
      console.log('config: ', config)
      if (context.type === 'manifest' && !this.playlist) {
        this.getRPC((err, rpc) => {
          if (err) throw err
          console.log('broadcaster to find: ', this.broadcaster)
          this.getBroadcasterJobs(this.broadcaster, (err, jobs) => {
            if (err) throw err
            for (let i  = 0; i < jobs.length ; i++) {
              if (jobs[i].broadcaster === this.broadcaster) {
                let url = this.parseManifestUrl(jobs[0])
                if (!url) {
                  throw new Error(`couldn't parse URL for job ${jobs[0].streamId}`)
                }
                debug('broadcaster jobs: ', jobs[i])
                this.playlist = url
                context.url = url
                load(context, config, callbacks)
                break
              } else {
                debug('other broadcaster jobs: ', jobs[i])
              }
            }
          })
        })
      } else {
        load(context, config, callbacks)
      }
    }
  }

  getRPC (callback) {
    // if (!callback) callback = () => {}
    if (this.rpc) {
      return callback(null, this.rpc)
    }

    debug('lpConfig: ', this.lpConfig)
    LivepeerSDK(this.lpConfig).then((sdk) => {
      this.sdk = sdk
      const { rpc } = sdk
      this.rpc = rpc

      return callback(null, rpc)
    }).catch((e) => {
      if (e) return callback(e)
    })
  }

  getBroadcasterJobs (broadcaster, callback) {
    if (!this.rpc) {
      // this.getRPC((err, rpc) => {
      //   this.getJob(broadcaster, callback)
      // })
      return callback(new Error(`Livepeer RPC is not available`))
    }

    this.rpc.getJobs({
      broadcaster,
      to: 'latest',
      blocksAgo: MAX_BLOCKS_AGO
    }).then((jobs) => {
      return callback(null, jobs)
    }).catch((e) => {
      return callback(e)
    })
  }

  parseManifestUrl (job) {
    if (job && job.streamId) {
      let manifestId = job.streamId.substr(0, 68 + 64)
      let url = `${this.gateway}/stream/${manifestId}.m3u8`
      return url
    } else {
      return null
    }
  }
}
