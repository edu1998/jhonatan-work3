import React, { useState, useEffect } from 'react';


import { Modal, Button, Form, Input, Select } from 'antd';
import {
    PrinterFilled
} from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';
import { getErrorMessage } from '../../../api/api';
import { openNotification } from '../../../components/Toastr';
import fulfillmentApi from '../../../api/fulfillmentInbound';
import { useTranslation } from 'react-i18next';

const pageTypes = [

    { value: "PackageLabel_Letter_2", label: "Two labels per US Letter label sheet. This is the only valid value for Amazon-partnered shipments in the US that use United Parcel Service (UPS) as the carrier. Supported in Canada and the US." },
    { value: "PackageLabel_Letter_4", label: "Four labels per US Letter label sheet. This is the only valid value for non-Amazon-partnered shipments in the US. Supported in Canada and the US." },
    { value: "PackageLabel_Letter_6", label: "Six labels per US Letter label sheet. This is the only valid value for non-Amazon-partnered shipments in the US. Supported in Canada and the US." },
    { value: "PackageLabel_Letter_6_CarrierLeft", label: "PackageLabel_Letter_6_CarrierLeft" },
    { value: "PackageLabel_A4_2", label: "Two labels per A4 label sheet." },
    { value: "PackageLabel_A4_4", label: "Four labels per A4 label sheet." },
    { value: "PackageLabel_Plain_Paper", label: "One label per sheet of US Letter paper. Only for non-Amazon-partnered shipments." },
    { value: "PackageLabel_Plain_Paper_CarrierBottom", label: "PackageLabel_Plain_Paper_CarrierBottom" },
    { value: "PackageLabel_Thermal", label: "For use of a thermal printer. Supports Amazon-partnered shipments with UPS." },
    { value: "PackageLabel_Thermal_Unified", label: "For use of a thermal printer. Supports shipments with ATS." },
    { value: "PackageLabel_Thermal_NonPCP", label: "For use of a thermal printer. Supports non-Amazon-partnered shipments." },
    { value: "PackageLabel_Thermal_No_Carrier_Rotation", label: "For use of a thermal printer. Supports Amazon-partnered shipments with DHL." },

]

const labelTypes = [
    { value: "BARCODE_2D", label: "This option is provided only for shipments where 2D Barcodes will be applied to all packages. Amazon strongly recommends using the UNIQUE option to get package labels instead of the BARCODE_2D option." },
    { value: "UNIQUE", label: "Document data for printing unique shipping labels and carrier labels for an inbound shipment." },
    { value: "PALLET", label: "Document data for printing pallet labels for a Less Than Truckload/Full Truckload (LTL/FTL) inbound shipment." },
]

export default ({ boxes, pallets, shippingId, clientId }) => {

    const [form] = useForm();
    const [showModal, setShowModal] = useState(false)
    const [printingLabels, setPrintingLabels] = useState(false)
    const { t } = useTranslation();

    useEffect(() => {
        if(showModal){
            form.resetFields();
        }
    }, [showModal])

    const doPrintLabels = async (values) => {
        setPrintingLabels(true);

        const vals = {
            shippingId: values.shippingId,
            clientId: clientId,
            pallets: pallets,
            pageType: values.pageType,
            labelType: values.labelType,
            boxes: boxes,
            packages: values.packages,
            marketplace: "amazon"
        }
        await fulfillmentApi.findShipmentLabels(vals)
            .then((response) => {
                if (response.data != null && response.data != undefined) window.location.href = response.data;
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            })
        setPrintingLabels(false);
    }

    const printLabels = () => {
        form.submit();
    }

    return (
        <>
            <Button type="text" loading={printingLabels} onClick={() => { setShowModal(true) }} icon={<PrinterFilled height="15" width="15" />} />
            <Modal
                title={"Imprimir etiquetas"}
                centered
                width={1000}
                visible={showModal}
                onOk={printLabels}
                onCancel={() => setShowModal(false)}
                cancelText={t('orders.newOrder.table.modal.buttonCancel')}
                okText={"Imprimir"}
                okButtonProps={{ loading: printingLabels }}
            >   
                <Form layout="vertical" form={form} preserve={false} onFinish={doPrintLabels}>
                    {shippingId.includes(',') ? 
                    <Form.Item name="shippingId" label="Amazon Shipment Id" rules={[{required:true}]}>
                        <Select options={shippingId.split(',').map((sId)=> {return {label:sId, value:sId}})}></Select>
                    </Form.Item>
                    :
                    <Form.Item name="shippingId" disabled={true} initialValue={shippingId} label="Amazon Shipment Id" rules={[{required:true}]}>
                        <Input disabled={true} initialValue={shippingId}></Input>
                    </Form.Item>
                    }
                    <Form.Item name="pageType" label="Tipo de página" rules={[{required:true}]}>
                        <Select options={pageTypes}></Select>
                    </Form.Item>
                    <Form.Item name="labelType" label="Tipo de label" rules={[{required:true}]}>
                        <Select options={labelTypes}></Select>
                    </Form.Item>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, curValues) =>
                            prevValues.labelType !== curValues.labelType
                        }
                    >
                        {() => {
                            let labelType = form.getFieldValue('labelType');
                            if (labelType === 'BARCODE_2D') {
                                return (<Form.Item label="Cajas" name="boxes" initialValue={boxes}><Input type="number" disabled></Input></Form.Item>);
                            }
                            if (labelType === 'PALLET') {
                                return (<Form.Item label="Pallets" name="pallets" initialValue={pallets}><Input disabled></Input></Form.Item>);
                            }
                            if (labelType === 'UNIQUE') {
                                return (<Form.Item label="Package Ids" name="packages" rules={[{required:true}]}><Input></Input></Form.Item>);
                            }

                            return <></>
                        }
                        }
                    </Form.Item>
                </Form>
            </Modal>
        </>

    );


}