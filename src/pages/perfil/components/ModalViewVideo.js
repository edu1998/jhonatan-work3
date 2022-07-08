import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';

const ModalViewVideo = (props) => {
  const [showVideo, setShowVideo] = useState(true)
  console.log(props.data)

  const handleOk = () => {
    setShowVideo(false)
  };

  const handleCancel = () => {
    setShowVideo(false)
  };

  const close = () => {
      props.setIsModalVisible(false);
  }

  useEffect(() => {
    console.log(props.data)
    if(!showVideo){
      props.setIsModalVisible(false);
      setShowVideo(true)
    }
  }, [showVideo])

  const ContentShowVideo = () => {
    return (
      <>
        {
          props.data.data ?
            <iframe
              className="contentVideo"
              src={`${props.data.data.documentType === 'video' ? `https://www.youtube.com/embed/${props.code}` : props.data.data.link }`}
              frameborder="0"
              allow="accelerometer
              autoplay
              encrypted-media
              gyroscope
              picture-in-picture"
              allowfullscreen></iframe>
          :
            <></>
        }
      </>
    )
  }

  return (
    <>
      <Modal title={props.data.data ? props.data.data.name : ''} visible={props.isModalVisible} onOk={handleOk} onCancel={handleCancel} width={800}>
      {
        showVideo ?
          ContentShowVideo()
        :
          <></>
      }
      </Modal>
    </>
  );
};

export default ModalViewVideo