import { PageHeader } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import Clients from './components/Clients';

const ClientsIndex = () => {

    const history = useHistory();

	return (
		<PageHeader title={' '} onBack={() => { history.push("/") }}>
			<Clients/>
		</PageHeader>
	)
}

export default ClientsIndex