import React from 'react'
import io from 'socket.io-client'

import styles from './dashboard.scss'

// global
const msgType = {
  unknown: 'UNKNOWN',
  error: 'ERROR',
  register: 'REGISTER',
  candidate: 'CANDIDATE',
  offer: 'OFFER',
  anwser: 'ANSWER',
  leave: 'LEAVE',
  reject: 'REJECT',
}

const iceConfig = [
  {
    urls: 'stun:stun.1.google.com:19302'
  },
  {
    url: 'turn:numb.viagenie.ca',
    credential: 'muazkh',
    username: 'webrtc@live.com'
  },
]

export default class Dashboard extends React.Component {

  videoStream = null

  registerName = ''

  connectName = ''

  socket = null

  myPeer = null

  myStream = null

  tmpOffer = null

  state = {
    myId: '',
    connectedUser: '',
    someOneCalling: false,
    isCalling: false,
  }

  componentDidMount() {
    this.getUserWebcam()
    this.socket = io('ws://localhost:8100')
    this.socket.on('message', (message) => {
      const data = JSON.parse(message)
      console.log('get data from soccket', data)
      switch (data.type) {
        case msgType.register:
          this.onRegisterHandler(data.success)
          break;
        case msgType.offer:
          this.onOffer(data.offer, data.name)
          break;
        case msgType.anwser:
          this.onAnswer(data.answer)
          break;
        case msgType.candidate:
          this.onCandidate(data.candidate)
          break;
        case msgType.reject:
          this.onReject()
          break;
        case msgType.leave:
          this.onLeave()
          break;
        default:
          break;
      }
    })
  }

  // socket handler

  onRegisterHandler(success) {
    if (!success) {
      alert('Ooops... try a different id')
    } else {
      this.setState({ myId: this.registerName.value })
      this.myPeer = new RTCPeerConnection({
        iceServers: iceConfig,
      })
      console.log('RTCPeerConnection created')
      // console.log('myPeer', this.myPeer)

      // make stream
      this.myPeer.addStream(this.videoStream)

      this.myPeer.onaddstream = (event) => {
        const remoteVideo = document.getElementById('remote-video')
        try {
          remoteVideo.srcObject = event.stream
        } catch (error) {
          remoteVideo.src = window.URL.createObjectURL(event.stream)
        }
      }

      this.myPeer.onicecandidate = (event) => {
        if (event.candidate) {
          this.sendMessage({
            type: msgType.candidate,
            candidate: event.candidate,
            name: this.state.connectedUser,
          })
        }
      }
    }
  }

  // auto accept call
  onOffer(offer, name) {
    console.log(`got offer from ${name}`)
    this.setState({
      connectedUser: name,
      someOneCalling: true,
    })
    this.tmpOffer = offer
    // this.myPeer.setRemoteDescription(new RTCSessionDescription(offer))

    // this.myPeer.createAnswer((answer) => {
    //   console.log('Anwser')
    //   this.myPeer.setLocalDescription(answer)

    //   this.sendMessage({
    //     type: msgType.anwser,
    //     name,
    //     answer,
    //   })
    // }, () => { alert('Error on anwser') })
  }

  onAnswer(answer) {
    this.setState({ isCalling: false })
    this.setState({ connectedUser: this.connectName.value })
    this.myPeer.setRemoteDescription(new RTCSessionDescription(answer))
  }

  onCandidate(candidate) {
    this.myPeer.addIceCandidate(new RTCIceCandidate(candidate))
  }

  onReject() {
    this.setState({ isCalling: false })
    alert(`${this.state.connectedUser} reject !!!`)
  }

  onLeave() {
    alert(`${this.state.connectedUser} end call`)
    this.setState({
      connectedUser: '',
    })
    const remoteVideo = document.getElementById('remote-video')
    remoteVideo.src = null
    remoteVideo.srcObject = null
  }

  // end socket handler

  sendMessage(message) {
    this.socket.send(JSON.stringify(message))
  }

  gotStream = (stream) => {
    // console.log('stream', stream)
    // console.log('track', stream.getVideoTracks())
    const video = document.getElementById('my-video')
    try {
      video.srcObject = stream
      this.videoStream = stream
    } catch (error) {
      video.src = window.URL.createObjectURL(stream)
    }
  }

  getUserWebcam() {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })
    .then(this.gotStream)
    .catch(() => { alert('Error, can not get your stram') })
  }

  stopStream = () => {
    // if (this.videoStream) {
    //   this.videoStream.getVideoTracks()[0].stop()
    // }
    this.sendMessage({
      type: msgType.leave,
      name: this.state.connectedUser,
    })
  }

  doRegister = () => {
    const name = this.registerName.value
    if (name.length > 0) {
      this.sendMessage({
        type: msgType.register,
        name,
      })
    }
  }

  makeCall = () => {
    const name = this.connectName.value

    if (name.length > 0) {
      this.myPeer.createOffer((offer) => {
        this.sendMessage({
          type: msgType.offer,
          name,
          offer,
        })

        this.myPeer.setLocalDescription(offer)
        this.setState({ isCalling: true })
        console.log('offer', offer)
      }, () => { alert('An orror has occured on makeOffer') })
    }
  }

  doReject = () => {
    this.setState({ someOneCalling: false })
    this.sendMessage({
      type: msgType.reject,
      name: this.state.connectedUser,
    })
  }

  doAccept = () => {
    this.setState({ someOneCalling: false })

    this.myPeer.setRemoteDescription(new RTCSessionDescription(this.tmpOffer))
    this.myPeer.createAnswer((answer) => {
      console.log('Anwser')
      this.myPeer.setLocalDescription(answer)
      this.sendMessage({
        type: msgType.anwser,
        name: this.state.connectedUser,
        answer,
      })
    }, () => { alert('Error on anwser') })
  }

  render() {
    console.log('state', this.state)
    return (
      <div id="dashboard" className={styles.container}>
        <input
          ref={(input) => { this.registerName = input }}
          type='text' />
        <button onClick={this.doRegister}>register</button>
        <h1>Your ID: {this.state.myId}</h1>
        <h1>GetUserMedia</h1>
        <div className="video-wrapper">
          <video
            className="local-video"
            id='my-video'
            autoPlay
          >
          </video>
          <video
            className="remote-video"
            id='remote-video'
            autoPlay
          >
          </video>
          {
            this.state.isCalling ?
            (
              <div style={{
                color: 'white',
                width: '100%',
                textAlign: 'center',
                bottom: '20px',
                position: 'absolute',
              }}>
                Calling...
              </div>
            ) : null
          }
          {
            this.state.someOneCalling ? (
              <div className="button-call-set">
                <button
                  className="call-button"
                  onClick={this.doAccept}
                >
                  <i className="ion-ios-telephone-outline" />
                </button>
                <button
                  className="dism-button"
                  onClick={this.doReject}
                >
                  <i className="ion-nuclear" />
                </button>
              </div>
            ) : null
          }
        </div>
        <input
          ref={(input) => { this.connectName = input }}
          type='text'
        />
        <button onClick={this.makeCall}>Call</button>
        <button type="button" onClick={this.stopStream} >End</button>
      </div>
    )
  }
}
