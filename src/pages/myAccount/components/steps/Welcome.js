
import { EVENT_SP_CALENDLY, EVENT_WELCOME_CALENDLY, URL_CALENDLY, USER_CALENDLY } from '../../../../utils/const';
import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Card, Modal, Space } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Calendly } from '../../../../components/Calendly';
import { useDispatch, useSelector } from 'react-redux';

export const Welcome = ({ setSelected, selected }) => {
    const session = useSelector(store => store.Session.session);
    const { t } = useTranslation();
    const [showCalendly, setShowCalendly] = useState(false);

    const handleCalendly = () => {
        setShowCalendly(!showCalendly);
    }

    return (
        <div id="welcome">
            <Row>
                <Col className="text-align-left">
                    <h2 className="title-primary">{t('myAccount.title4')}</h2>
                    <span className="text-color-gray">{t('myAccount.subtitle4')} </span>
                </Col>
            </Row>
            <br/>
            <Row>
                <Col className="text-align-left" span={24}>
                    <Card >
                        <Row>
                            <Col span={2}><CalendarOutlined /></Col>
                            <Col span={15}>
                                <h3>{t('myAccount.sellerAccount.card3')}</h3>
                                <span>{t('myAccount.sellerAccount.card3Description')}</span>
                            </Col>
                            <Col span={7}>
                                <Button type="primary" className="btn-link-filled"
                                    onClick={() => handleCalendly()}
                                >{t('myAccount.selectDate')}</Button>

                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <Row>
                {selected === 3 && (
                    <Col span={24} className="flex-margin-top">
                        <Button className="btn-primary"
                            onClick={() => {session?.userInfo?.isAdmin || session?.userInfo?.x_can_publish ? setSelected(selected - 1) : setSelected(selected - 3)}}
                        >{t('myAccount.return')}</Button>                        
                        <Link to="/" >
                            <Button className="btn-primary ms-1"
                                onClick={() => setSelected(selected + 1)}>
                                {t('myAccount.finish')}
                            </Button>
                        </Link>
                    </Col>
                )}
            </Row>

            <Calendly
                show={showCalendly} setShow={setShowCalendly}
                calendlyUser={USER_CALENDLY} calendlyEvent={EVENT_SP_CALENDLY} />
        </div>
    )
}