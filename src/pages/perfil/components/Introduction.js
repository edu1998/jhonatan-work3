import React from 'react';

import { Col, Card } from 'antd';
import { RightOutlined } from '@ant-design/icons';

const Introduction = ({ }) => {
    return (
        <Col span={8} xs={24} sm={4} md={4}>
            <Card className="home-introduction-card">
                <p className="home-introduction-title" ><RightOutlined className="home-introduction-card-icon btn-primary" />Resources</p>
                <p>En este módulo podrás encontrar todos los archivos compartidos y tutoriales</p>
            </Card>
        </Col>
    );
}

export default React.memo(Introduction);