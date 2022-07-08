import './TableTop.css';
import Card from "../card/Card";
import CardBody from "../card/cardBody/Card/cardBody";
import CardHeader from "../card/cardHeader/Card/cardHeader";

export const TableTop = ({topData = [], range = [0, 10], title}) => {
    return (
        <Card>
            <CardHeader>
                <h3 className="card-title-custom-title" >{title}</h3>
            </CardHeader>
            <CardBody>
                <div style={{overflow: 'none', height: "335px"}}>
                    <table className="table-top">
                        <tr className="table-top-header">
                            <th>#</th>
                            <th>Nombre del producto - SKU</th>
                            <th>Cantidad</th>
                        </tr>
                        {topData.slice(range[0], range[1]).map((data, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="name-td">{data.name}</td>
                                <td>{new Intl.NumberFormat().format(data.units)}</td>
                            </tr>
                        ))}
                    </table>
                </div>
            </CardBody>
        </Card>
    )
}
