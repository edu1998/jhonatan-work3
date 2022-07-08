import moment from 'moment';
import { Button } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

const UpdateDate = () => {

	const dateNow = () => {
		var dec = moment("2014-12-01T12:00:00Z");
		console.log(dec)
	}
	
	return (
		<span className="home-ultima-actualizacíon">Última actualización : Hoy - 13:22 p.m {' '}<span><Button icon={<SyncOutlined />} /></span></span>
	)
}

export default UpdateDate
