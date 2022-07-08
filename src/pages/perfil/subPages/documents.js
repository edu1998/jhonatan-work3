import { PageHeader } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import Documents from '../components/documents'

const DocumentsIndex = () => {

    const history = useHistory();

	return (
		<PageHeader title={' '} onBack={() => { history.push("/") }}>
			<Documents/>
		</PageHeader>
	)
}

export default DocumentsIndex