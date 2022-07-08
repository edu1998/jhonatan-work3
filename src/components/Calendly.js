import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { URL_CALENDLY } from '../utils/const';
export const Calendly = ({ show, setShow, calendlyUser, calendlyEvent }) => {
    const [showModal, setShowModal] = useState(show);

    const handleShow = () => {
        setShowModal(!showModal);
        setShow(!showModal);
    }

    useEffect(() => {
        setShowModal(show);
    }, [show])

    useEffect(() => {
        const head = document.querySelector('head');
        const script = document.createElement('script');
        script.setAttribute('src', URL_CALENDLY);
        head.appendChild(script);
    }, [])

    return (
        <Modal
            visible={showModal}
            onOk={handleShow}
            onCancel={handleShow}
            cancelText="Cancelar"
            width={900}
            okButtonProps={{ style: { display: 'none' } }}
            className="calendly-iframe"
        >
            <iframe
                src={`https://calendly.com/onboardinglap/welcome?hide_event_type_details=1&hide_gdpr_banner=1`}
                width="100%"
                height="600px"
                frameBorder="0"
                id="calendly-iframe"
            ></iframe>
        </Modal>
    )
}