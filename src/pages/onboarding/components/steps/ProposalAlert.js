import React from 'react';
import { Button } from 'antd';
import { CheckOutlined, SyncOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const ProposalAlert = ({ onClickAccept, onClickReject }) => {

    const { t } = useTranslation();
    
    return (
        <div className="proposal-container">
            <span className="proposal-text">{t('onboarding.proposal.title')}</span>
            <div className="proposal-buttons-container">
                <Button icon={<CheckOutlined />} className="proposal-accept-button" onClick={onClickAccept}>{t('onboarding.proposal.accept')}</Button>
                <Button icon={<SyncOutlined />} className="proposal-remake-button" onClick={onClickReject}>{t('onboarding.proposal.remake')}</Button>
            </div>
        </div>
    );
}

export default React.memo(ProposalAlert);