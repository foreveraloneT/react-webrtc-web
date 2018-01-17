import React from 'react'
import io from 'socket.io-client'

import styles from './dashboard.scss'

export default class Dashboard extends React.Component {

  videoStream = null

  registerName = ''

  socket = null

  componentDidMount() {
    this.getUserWebcam()
    this.socket = io('ws://localhost:8100')
    this.socket.on('message', (data) => {
      console.log('socket', data)
    })
  }

  sendMessage(message) {
    this.socket.send(JSON.stringify(message))
  }

  gotStream = (stream) => {
    console.log('stream', stream)
    console.log('track', stream.getVideoTracks())
    const video = document.getElementById('my-video')
    try {
      video.srcObject = stream
      this.videoStream = stream
    } catch (error) {
      video.src = URL.createObjectURL(stream)
    }
  }

  getUserWebcam() {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    })
    .then(this.gotStream)
  }

  stopStream = () => {
    if (this.videoStream) {
      this.videoStream.getVideoTracks()[0].stop()
    }
  }

  doRegister = () => {
    const name = this.registerName.value
    if (name.length > 0) {
      this.sendMessage({
        type: 'REGISTER',
        name,
      })
    }
  }

  render() {
    return (
      <div id="dashboard" className={styles.container}>
        <input
          ref={(input) => { this.registerName = input }}
          type='text' />
        <button onClick={this.doRegister}>register</button>
        <h1>GetUserMedia</h1>
        <video
          id='my-video'
          style={{ width: '800px' }}
          autoPlay
        >
        </video>
        <button type="button" onClick={this.stopStream} >Stop</button>
      </div>
    )
  }
}
