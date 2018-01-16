import React from 'react'
import styles from './dashboard.scss'

export default class Dashboard extends React.Component {

  gotStream = (stream) => {
    const video = document.getElementById('my-video')
    try {
      video.srcObject = stream
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
      </div>
    )
  }
}
