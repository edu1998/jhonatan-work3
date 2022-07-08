import { PageHeader } from 'antd';
import OrderSales from './components/OrderSales'
import { Link, useHistory } from 'react-router-dom';

const Pedidos = () => {

	const history = useHistory();

	return (
			<PageHeader title={' '} onBack={() => { history.push("/") }}>
				<OrderSales />
			</PageHeader>
	)
}

export default Pedidos