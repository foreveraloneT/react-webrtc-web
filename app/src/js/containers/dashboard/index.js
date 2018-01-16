import React from 'react'
import styles from './dashboard.scss'

export default class Dashboard extends React.Component {

  videoStream = null

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

  componentDidMount() {
    this.getUserWebcam()
  }

  render() {
    return (
      <div id="dashboard" className={styles.container}>
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
