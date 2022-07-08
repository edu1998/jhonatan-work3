import React from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const Pending = ({ }) =>  {

    const { t } = useTranslation();
    
    return (
        <div className="pending-container">
            <ClockCircleOutlined className="pending-icon" />
            <div className="pending-text-container">
                <span className="pending-text-title">{t('onboarding.pending.title')}</span>
                <span className="pending-text-description">{t('onboarding.pending.description')}</span>
            </div>
        </div>
    );
}

export default React.memo(Pending);