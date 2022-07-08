import { SmileOutlined, FrownOutlined } from '@ant-design/icons';
import { notification } from 'antd';

export const openNotification = ({ info, content, status, duration }) => {
    status ?
        (notification.success({
            style: { zIndex: 'inherit' },
            duration: duration || 4.5,
            message: info ? info : 'Éxito',
            description: content ? content : 'Petición completada correctamente.',
            icon: <SmileOutlined style={{ color: '#389e0d' }} />
        })) :
        (notification.error({
            style: { zIndex: 'inherit' },
            duration: duration || 4.5,
            message: info ? info : 'Error',
            description: content ? content : 'No se pudo completar la petición.',
            icon: <FrownOutlined style={{ color: '#F81D22' }} />
        }))
}