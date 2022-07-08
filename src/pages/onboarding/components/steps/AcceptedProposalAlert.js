import React from 'react';
import { Button } from 'antd';
import { CheckCircleFilled, RightOutlined, SyncOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const AcceptedProposalAlert = ({ nextStep }) => {

    const { t } = useTranslation();

    return (
        <div className="accepted-proposal-container">
            <CheckCircleFilled className="accepted-proposal-icon" />
            <div className="accepted-proposal-text-container">
                <span className="accepted-proposal-text-accept">{t('onboarding.acceptedProposal.title')}</span>
                <span>{t('onboarding.acceptedProposal.description')}</span>
            </div>
            <div className="accepted-proposal-buttons-container">
                <Button icon={<RightOutlined />} className="btn-basic-green" onClick={nextStep}>{t('onboarding.acceptedProposal.nextStep')}</Button>
                {/* <Button icon={<SyncOutlined />} className="accepted-proposal-button-remake">{t('onboarding.acceptedProposal.remake')}</Button> */}
            </div>
        </div>
    );
}

export default AcceptedProposalAlert;