import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Alert } from 'antd';
import 'antd/dist/antd.css';

export const AlertIssues = ({ issues, sku }) => {

    const [details, setDetails] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        if (issues, sku)
            setDetails(issues.find(issue => issue.sku === `${sku}`))
    }, [issues, sku]);

    return (
        <>
            {details &&
                <Row style={{ margin: 10 }}>
                    <Col span={24}>
                        <Alert closable showIcon type={details?.status === 'INVALID' ? "error" : "success"}
                            message={details?.status === 'INVALID' ? `${sku} no válido` : `${sku} válido`}
                            onClose={() => setShowDetails(false)}
                            action={details?.status === 'INVALID' && <Button size="small" danger onClick={() => setShowDetails(!showDetails)}>Detalle</Button>}
                        />
                    </Col>
                    {showDetails && details.issues.length > 0 &&
                        <Col span={24}>
                            <Alert type="error"
                                description={details.issues[0]?.attributeName ?
                                    `Debe completar los siguientes atributos: ${details.issues?.map(item => { return item?.attributeName?.replace(/_/g, " ") + ' ' })}` :
                                    details.issues[0].message}
                            />
                        </Col>
                    }
                </Row>
            }
        </>
    )
}
