import React, { useEffect, useState, useReducer } from 'react';
import {
    Row, Col, Divider, Input, Button, Spin, Tabs, Alert, Space, Popconfirm, Modal, Form, Select,
    InputNumber, Table, Tooltip, Switch, DatePicker, Card, Affix
} from 'antd';
import {
    LoadingOutlined, DownloadOutlined, EditOutlined, SendOutlined, PlusOutlined,
    WarningOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, DeleteFilled
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import 'antd/dist/antd.css';
import '../../../onboarding/onboarding.css';
import { useTranslation } from 'react-i18next';
import { maxLength2000, shippingTypes, validateMessages } from '../../../../utils/const';
import { openNotification } from '../../../../components/Toastr';
import { getErrorMessage } from '../../../../api/api';
import orderDocumentsApi from '../../../../api/order-documents';
import orderSalesApi from '../../../../api/order-sales';

import orderApi from '../../../../api/order';
import partnerApi from '../../../../api/partner';
import { Attachments } from '../Attachments';
import moment from 'moment';
import { orderSteps, orderStates, orderGeneralStates } from '../../../../utils/const';
import ModalRejectProposal from '../../../onboarding/components/steps/ModalRejectProposal';
import ProposalAlert from '../../../onboarding/components/steps/ProposalAlert';
import AcceptedProposalAlert from '../../../onboarding/components/steps/AcceptedProposalAlert';
import Pending from '../../../onboarding/components/steps/Pending';
import { canEdit } from '../../../../utils/functions';
import Notes from '../Notes';
import AMDocumentModal from '../AMDocumentModal';

const { Item } = Form;
const { TabPane } = Tabs;
const { Option } = Select;
const antIcon = <LoadingOutlined style={{ fontSize: 14 }} spin />;

export const Contents = ({ orderId, redirected, setRedirected, setSelected, selected, setSteps }) => {

    const { t } = useTranslation();
    const [form] = Form.useForm()

    const [tab, setTabs] = useState('LAP');
    const [save, setSave] = useState(false);
    const [saveDraft, setSaveDraft] = useState(false);
    const [cancelForm, setCancelForm] = useState(false);
    const [canSave, setCanSave] = useState(true);
    const [isLoadingForm, setIsLoadingForm] = useState(false);
    const [loadingContent, setLoadingContent] = useState(true);
    const [contentReceived, setContentReceived] = useState();
    const [partners, setPartners] = useState();
    const [selectedPartner, setSelectedPartner] = useState();
    const [loadingPartners, setLoadingPartners] = useState(false);
    const [listingsAndProducts, setListingsAndProducts] = useState();
    const [products, setProducts] = useState();
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loadingListingsAndProducts, setLoadingListingsAndProducts] = useState(false);
    const [loadingSend, setLoadingSend] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [loadingAcceptProposal, setLoadingAcceptProposal] = useState(false);
    const [acceptedProposal, setAcceptedProposal] = useState(false);
    const [remakeModalVisible, setRemakeModalVisible] = useState(false);
    const [sellingUnities, setSellingUnities] = useState(0);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingDocuments, setLoadingDocuments] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState();
    const [amDocumentModalVisible, setAMDocumentModalVisible] = useState(false);
    const [create, setCreate] = useState(false);
    const [successfullyEndDocuments, setSuccessfullyEndDocuments] = useState(false);
    const [loadingDeleteDocument, setLoadingDeleteDocument] = useState(false);

    const [dataLisitngs, setDataLisitngs] = useState([]);
    const [stateCodes, setStateCodes] = useState([]);
    const [loadingStateCodes, setLoadingStateCodes] = useState(false);

    const session = useSelector(store => store.Session.session);
    const loading = useSelector(store => store.Partner.loading);

    const handleChangeTabs = (key) => setTabs(key);

    const step = contentReceived?.steps.find(step => step.step === orderSteps.CONTENIDO);
    const state = contentReceived?.state;

    useEffect(() => {
        getAllPartners();
        getAllDocuments();
    }, []);

    useEffect(() => {

        if (contentReceived && Object.entries(contentReceived).length > 0) {

            if (!redirected) {
                const boxStep = contentReceived?.steps.find(step => step.step === orderSteps.CAJAS);
                setRedirected(true);
                if (boxStep.state != orderStates.PENDING) {
                    if (boxStep.state != orderStates.PENDING_ACKNOWLEDGE)
                        if (boxStep.state != orderStates.COMPLETED) {
                            setSelected(1);
                        } else {
                            setSelected(2);
                        }
                    else {
                        onClickAcceptProposal(boxStep.state)
                    }
                }
            }

            const contentToUse = contentReceived.owners.Client;
            setSelectedProducts(contentToUse.products.map(product => ({
                id: product.product.id,
                name: product.product.title,
                pack: product.product.title.toLowerCase().includes('pack'),
                price: product.product.price,
                sku: product.product.defaultCode,
                quantity: product.quantity,
                key: new Date()
            })));
            const productsForm = {};
            contentReceived.owners.Client.products.forEach((product) => {
                productsForm[`quantity-${product.product.id}`] = product.quantity;
                productsForm[`expiration_date-${product.product.id}`] = moment(product.expirationDate);
            });
            if (contentReceived.steps.find(step => step.step === orderSteps.CONTENIDO).state === orderStates.COMPLETED) {
                setAcceptedProposal(true);
            }
            const lapComment = step.LAPComment;
            setSelectedPartner(contentToUse.clientId);
            const document = documents.find(doc => doc.id == contentToUse.shippingDocId);
            setSelectedDocument(document);
            if(contentToUse.originAddress?.countryCode) {
                handleCountryCode(contentToUse.originAddress?.countryCode);
            }
            form.setFieldsValue({
                ...productsForm,
                account_id: contentToUse.clientId,
                originAddress: contentToUse.originAddress,
                destination: contentToUse.destination,
                shipping_type: contentToUse.shippingType,
                lapId: contentToUse.lapId,
                document_id: document?.shippingDocId,
                pallets: contentToUse.palletCount,
                price: contentToUse.shippingAmount,
                notes: contentToUse.shippingNote,
                commentLAP: lapComment
            });
        }
    }, [loadingContent]);

    useEffect(() => {
        if (selectedPartner) {
            getListingsByPartner(selectedPartner);
        }
    }, [selectedPartner]);

    useEffect(() => {
        if (successfullyEndDocuments) {
            setSelectedDocument(null);
            form.setFieldsValue({
                document_id: ''
            });
            getAllDocuments();
            setSuccessfullyEndDocuments(false);
        }
    }, [successfullyEndDocuments]);

    useEffect(() => {
        if (selectedDocument) {
            form.setFieldsValue({
                shipping_type: selectedDocument.shippingType,
                document_link: selectedDocument.shippingDocLink,
                container: selectedDocument.containerId
            });
        } else {
            form.setFieldsValue({
                shipping_type: null,
                document_link: null,
                container: null
            });
        }
    }, [selectedDocument]);


    const getAllPartners = async () => {
        setLoadingPartners(true);
        await partnerApi.findAllForAdmin()
            .then((response) => {
                setPartners(response.data);
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingPartners(false);
    }

    const getAllDocuments = async () => {
        setLoadingDocuments(true);
        await orderDocumentsApi.findAll()
            .then((response) => {
                setDocuments(response.data);
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingDocuments(false);
        if (!contentReceived) {
            getContent();
        }
    }

    const handlePartnerChange = (partnerId, value) => {
        setSelectedPartner(partnerId);
    }

    const handleListingChange = (listingId, value) => {
        if (listingId) {
            let prods = listingsAndProducts.find(listingWProduct => listingWProduct.id === listingId).products;
            setProducts(prods);
            let prds = [...selectedProducts];
            prods.map((prod) => {
                if (!selectedProducts.find((pr) => { return pr.id == prod.id })) {
                    prds.push({ ...prod, key: prod.id + '-' + new Date() });
                }
            })
            setSelectedProducts(prds);
        }
    }

    const clearSelectedProducts = () => {
        setSelectedProducts([]);
    }

    const getListingsByPartner = async (partnerId) => {
        setLoadingListingsAndProducts(true);
        await partnerApi.listingsAndProducts(partnerId, true)
            .then((response) => {
                setListingsAndProducts(response.data);
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingListingsAndProducts(false);
    }

    const getContent = async () => {
        await orderApi.getContent(orderId)
            .then((res) => {
                setContentReceived(res.data);
                setSteps(res.data.steps);
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingContent(false);
    }

    const handleSelectedProduct = (value, index) => {
        const selected = products.find((product) => product.sku === value);
        setSelectedProducts((prevState) => {
            prevState[index] = {
                key: prevState[index].key,
                ...selected
            };
            return [...prevState];
        })
    }

    if (selectedProducts) {
        let count = 0;
        selectedProducts.forEach((product) => {
            const quantity = form.getFieldValue(`quantity-${product.id}`);
            if (quantity) {
                count = count + quantity;
            }
        })
        if (count != sellingUnities) {
            setSellingUnities(count);
        }
    }

    const handleCancelForm = async () => {
        setLoadingDelete(true);
        await orderApi.goBack(orderId)
            .then((response) => {
                window.location = '/orders';
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
                setLoadingDelete(false);
            })
    }

    const onClickAcceptProposal = async (status) => {
        // NEXT STEP API
        setLoadingAcceptProposal(true);
        await orderApi.acceptProposal(orderId)
            .then((response) => {
                setContentReceived((prevState) => {
                    const otherSteps = prevState.steps.filter((step) => step.step !== orderSteps.CONTENIDO);
                    return {
                        ...prevState,
                        steps: [
                            ...otherSteps,
                            {
                                step: orderSteps.CONTENIDO,
                                state: orderStates.COMPLETED
                            }
                        ]
                    }
                })
                setAcceptedProposal(true);
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingAcceptProposal(false);
        setAcceptedProposal(true);
        console.log(status, 'PROBANDO')
        if (status === orderStates.PENDING_ACKNOWLEDGE) {
            setSelected(2);
        } else {
            setSelected(1);
        }
    };

    const onClickRejectProposal = () => {
        setRemakeModalVisible(true);
    }

    const formItemLayout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    }

    const quantityChanged = () => {
        let count = 0;
        selectedProducts.forEach((product) => {
            const quantity = form.getFieldValue(`quantity-${product.id}`);
            if (quantity) {
                count = count + quantity;
            }
        })
        if (count != sellingUnities) {
            setSellingUnities(count);
        }
    }

    const listingsColumns = [
        {
            title: 'ASIN',
            dataIndex: 'asin',
            key: 'asin',
            render: text => <span>{text}</span>,
        },
        {
            title: 'FNSKU',
            dataIndex: 'fnsku',
            key: 'fnsku',
            render: text => <span>{text}</span>,
        },
        {
            title: 'SKU',
            dataIndex: 'sku',
            key: 'sku',
            render: (text, object, index) =>
                <Select defaultValue={selectedProducts[index]?.sku} placeholder="Seleccione un producto..." onChange={(value) => handleSelectedProduct(value, index)} disabled={true}>
                    {remainingProducts?.map((product) => (
                        <Option key={product.id} value={product.sku}>{product.sku}</Option>
                    ))}
                </Select>
        },
        {
            title: 'PRODUCT BRAND',
            dataIndex: 'brand',
            key: 'brand',
            render: (text, object, index) => (
                <div style={{ display: 'flex', flexDirection: ' column' }}>
                    <span>{selectedProducts[index]?.name?.replace(/[\u{0080}-\u{FFFF}]/gu, "")}</span>
                    <span className="text-color-gray">{selectedProducts[index]?.brand}</span>
                </div>
            )
        },
        {
            title: 'UNIDADES DE VENTA',
            width: 100,
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text, object, index) =>
                <Item onChange={quantityChanged} label="" className="input-form-margin-bottom" name={`quantity-${object.id}`} rules={[{ required: true }]}>
                    <InputNumber style={{ width: '100%', minWidth: '50px' }} disabled={!canEdit(session, tab, step.state) || state !== orderGeneralStates.DRAFT}
                        name="quantity" name={`quantity-${object.id}`} min={0}
                        defaultValue={selectedProducts[index]?.quantity}
                    />
                </Item>
        },
        {
            title: 'PRICE',
            width: 120,
            dataIndex: 'price',
            key: 'price',
            render: (text, object, index) => <InputNumber value={selectedProducts[index]?.price} precision={2} style={{ width: '100%' }} disabled={true} bordered={false} />,
        },
        {
            title: '',
            key: 'actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <>
                    {record?.key &&
                        <Tooltip title="Eliminar">
                            <Button type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => handleDeleteRowListing(record?.key)} disabled={!canEdit(session, tab, step.state) || state !== orderGeneralStates.DRAFT} />
                        </Tooltip>
                    }
                </>
            ),
        },
    ];

    const handleDocumentSelect = (text, value) => {
        setSelectedDocument(documents.find(doc => doc.shippingDocId === text));
    }

    const handleDeleteDocument = async () => {
        setLoadingDeleteDocument(true);
        await orderDocumentsApi.delete(selectedDocument.id)
            .then(res => {
                setSelectedDocument(null);
                form.setFieldsValue({
                    document_id: ''
                });
                getAllDocuments();
                openNotification({ status: true, content: 'Eliminado correctamente.' });
            })
            .catch(error => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingDeleteDocument(false);
    }

    const handleAddRowListing = () => {
        setSelectedProducts((prevState) => {
            prevState.push({ key: Date.now() });
            return [...prevState];
        });
    }
    const handleDeleteRowListing = (key) => {
        setSelectedProducts((prevState) => [...prevState.filter(item => item.key !== key)])
    }

    const buildJsonFromForm = (formFields, validate) => {
        const data = {
            clientId: formFields.account_id,
            lapId: formFields.lapId,
            originAddress: formFields.originAddress,
            destination: formFields.destination,
            documentId: selectedDocument?.id,
            container: formFields.container,
            documentLink: formFields.document_link,
            shippingType: formFields.shipping_type,
            palletCount: formFields.pallets,
            shippingAmount: formFields.price,
            shippingNote: formFields.notes,
            listingId: formFields.listing,
            products: selectedProducts.map((product) => {
                return {
                    ...product,
                    quantity: formFields[`quantity-${product.id}`],
                    expirationDate: formFields[`expiration_date-${product.id}`]?.toDate().toISOString()
                }
            })
        };
        if (validate && !validateFields(data)) {
            return null;
        }
        const jsonToSend = {
            id: orderId,
            owners: [
                {
                    owner: 'Client',
                    ...data
                },
                {
                    owner: 'LAP',
                    ...data
                }
            ],
            steps: [
                ...contentReceived.steps.filter((step) => step.step !== orderSteps.CONTENIDO),
                {
                    ...step,
                    LAPComment: formFields.commentLAP
                }
            ]
        }
        return jsonToSend;
    }

    const validateFields = (data) => {
        const { clientId, originAddress, destination, lapId, listingId, products } = data;
        if (!clientId || !originAddress || !originAddress.name || !destination || !lapId || (!listingId && products.length === 0) ||
            !products || products.length === 0) {
            // COMPLETE REQUIRED FIELDS
            openNotification({ status: false, content: 'Please complete every required field.' });
            return false;
        }

        return true;
    }

    const handleSaveDraft = async () => {
        const formFields = form.getFieldsValue();
        setLoadingUpdate(true);
        await orderApi.updateContent(orderId, buildJsonFromForm(formFields, false))
            .then(res => {
                openNotification({ status: true, content: t('onboarding.draftSavedSuccessfully') });
            })
            .catch(error => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingUpdate(false);
    }

    const handleSendContent = async (formFields) => {
        const jsonToSend = buildJsonFromForm(formFields, true);
        if (!jsonToSend) {
            return;
        }
        setLoadingSend(true);
        await orderApi.sendContent(orderId, jsonToSend)
            .then(res => {
                openNotification({ status: true, content: t('onboarding.sentSuccessfully') });
                setContentReceived((prevState) => {
                    const otherSteps = prevState.steps.filter((step) => step.step !== orderSteps.CONTENIDO);
                    return {
                        ...prevState,
                        steps: [
                            ...otherSteps,
                            {
                                step: orderSteps.CONTENIDO,
                                state: session.userInfo.isAdmin ? orderStates.PENDING_ACKNOWLEDGE : orderStates.PENDING_LAP
                            }
                        ]
                    }
                })
            })
            .catch(error => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingSend(false);
    }

    const updateStep = (updatedSteps) => {
        let newSteps = [...contentReceived.steps];
        for (const stp of newSteps) {
            let updated = updatedSteps.find((updatedStep) => { return updatedStep.step === stp.step });
            if (updated) {
                stp.state = updated.state;
            }
        }
        setSteps(newSteps);
    }

    const remainingProducts = products?.filter(product => !selectedProducts.map((selected) => selected.id).includes(product.id));

    const handleCountryCode = (value) => {
        setLoadingStateCodes(true);
        orderSalesApi.getStateOrProvinceCode(value).then((res) => {
            setStateCodes(res.data);
            setLoadingStateCodes(false);
        }).catch((error) => {
            setLoadingStateCodes(false);
        });
    }


    return (
        <Spin spinning={loadingPartners || loadingContent || loadingUpdate || loadingSend || loadingAcceptProposal || loadingDelete}>
            {step && contentReceived &&
                <div id="contents">
                    <Row>
                        <Col span={14} xs={24} sm={12} md={12} className="text-align-left">
                            <h2 className="title-primary">{t('orders.newOrder.contents.title')}</h2>
                            <span className="text-color-gray">{t('orders.newOrder.contents.titleDescription')} </span>
                        </Col>
                    </Row>
                    <Divider orientation="left" />
                    {!acceptedProposal && state === orderGeneralStates.DRAFT && !session.userInfo.isAdmin && step.state === orderStates.PENDING_ACKNOWLEDGE && <ProposalAlert onClickAccept={onClickAcceptProposal} onClickReject={onClickRejectProposal} />}
                    {acceptedProposal && state === orderGeneralStates.DRAFT && <AcceptedProposalAlert nextStep={() => setSelected(selected + 1)} />}
                    {!session.userInfo.isAdmin && state === orderGeneralStates.DRAFT && step.state === orderStates.PENDING_LAP ? (
                        <Pending />
                    ) : (
                        <>
                            {(canEdit(session, tab, step.state) && state === orderGeneralStates.DRAFT &&
                                <Affix offsetTop={10}>
                                    <Alert className="sticky-alert-message"
                                        action={
                                            <Space>
                                                <Popconfirm
                                                    title={t('orders.confirmDelete')}
                                                    onConfirm={handleCancelForm}
                                                    onCancel={() => { }}
                                                    icon={<WarningOutlined />}
                                                    okText={t('yes')}
                                                    cancelText={t('no')}
                                                    okButtonProps={{ style: { backgroundColor: '#5365E3' } }}
                                                >
                                                    <Button size="small" type="link" icon={<CloseOutlined />} disabled={!canSave}>
                                                        {t('orders.alertButtonClose')}</Button>
                                                </Popconfirm>
                                                <Button className="btn-primary" icon={<DownloadOutlined />} disabled={!canSave} onClick={handleSaveDraft}>
                                                    {t('orders.alertButtonSave')}  </Button>
                                                <Button className="btn-link-filled" icon={<SendOutlined />} onClick={() => form.submit()} disabled={!canSave}>
                                                    {t('orders.alertButtonSend')}</Button>
                                            </Space>
                                        }
                                    />
                                </Affix>


                            )}
                            {session.userInfo.isAdmin && step.state === orderStates.PENDING_LAP ? (
                                <Card className="text-align-left">
                                    <Row>
                                        <Col span={6}>
                                            <p style={{ fontWeight: 'bold' }}>Comentarios Cliente</p>
                                        </Col>
                                        <Col span={18}>
                                            <p style={{ fontStyle: 'italic' }}>{step.clientMessage}</p>
                                        </Col>
                                    </Row>
                                </Card>
                            ) : !session.userInfo.isAdmin && [orderStates.PENDING_ACKNOWLEDGE, orderStates.COMPLETED].includes(step.state) && (
                                <Card className="text-align-left">
                                    <Row>
                                        <Col span={6}>
                                            <p style={{ fontWeight: 'bold' }}>Comentarios LAP</p>
                                        </Col>
                                        <Col span={18}>
                                            <p style={{ fontStyle: 'italic' }}>{step.LAPComment}</p>
                                        </Col>
                                    </Row>
                                </Card>
                            )}
                            <Form name="formulario" form={form} {...formItemLayout}
                                onFinish={handleSendContent}
                                validateMessages={validateMessages} className="text-align-left form-padding-top">
                                <Row>
                                    <Col xs={24} sm={24} md={24}>
                                        <Item label={t('orders.newOrder.contents.input1')} name="account_id" rules={[{ required: true }]}>
                                            <Select showSearch filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            } defaultValue="" style={{ width: '100%' }} name="account_id" onChange={handlePartnerChange} disabled={!canEdit(session, tab, step.state) || state !== orderGeneralStates.DRAFT}>
                                                {partners?.map((partner) => (
                                                    <Option key={partner.id} value={partner.id}>{partner.display_name}</Option>
                                                ))}
                                            </Select>
                                        </Item>
                                    </Col>
                                </Row>
                                <Divider className="divider-margin" orientation="left" />
                                <h2 className="title-primary">{t('orders.newOrder.contents.subtitle1')}</h2>
                                <span className="text-color-gray">{t('orders.newOrder.contents.subtitleDescription1')} </span>
                                <Divider className="divider-margin" orientation="left" />
                                <Row>
                                    <Col xs={24} sm={24} md={24}>
                                        <Item label={"Lap ID"} name="lapId" rules={[{ required: true }]}>
                                            <Input disabled={!canEdit(session, tab, step.state) || state !== orderGeneralStates.DRAFT}></Input>
                                        </Item>
                                    </Col>
                                    <Divider className="divider-margin" orientation="left" />
                                    <Col xs={24} sm={24} md={24}>
                                        <Item label={t('orders.newOrder.contents.input2')} name="shipping_type" rules={[{ required: true }]}>
                                            <Select name="shipping_type" style={{ width: '100%' }} disabled={!canEdit(session, tab, step.state) || state !== orderGeneralStates.DRAFT}>
                                                {Object.entries(shippingTypes).map(entry =>
                                                    <Select.Option key={entry[0]} value={entry[1]}>{entry[1]}</Select.Option>
                                                )}
                                            </Select>
                                        </Item>
                                    </Col>
                                </Row>
                                <Divider className="divider-margin" orientation="left" />
                                <h2 className="title-primary">{t('orders.newOrder.contents.input4')}</h2>
                                <Row>
                                    <Col xs={24} sm={24} md={24}>
                                        <Item label={"Nombre"} name={["originAddress", "name"]} rules={[{ required: true }]}>
                                            <Input disabled={!canEdit(session, tab, step.state) || state !== orderGeneralStates.DRAFT}></Input>
                                        </Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={24} sm={24} md={24}>
                                        <Item label={"Dirección"} name={["originAddress", "address"]} rules={[{ required: true }]}>
                                            <Input disabled={!canEdit(session, tab, step.state) || state !== orderGeneralStates.DRAFT}></Input>
                                        </Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={24} sm={24} md={24}>
                                        <Item label={"Distrito o condado"} name={["originAddress", "districtOrCounty"]} rules={[{ required: false }]}>
                                            <Input disabled={!canEdit(session, tab, step.state) || state !== orderGeneralStates.DRAFT}></Input>
                                        </Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={24} sm={24} md={24}>
                                        <Item label={"Ciudad"} name={["originAddress", "city"]} rules={[{ required: true, max: 30 }]}>
                                            <Input disabled={!canEdit(session, tab, step.state) || state !== orderGeneralStates.DRAFT}></Input>
                                        </Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={24} sm={24} md={24}>
                                        <Item label={"País"} name={["originAddress", "countryCode"]} rules={[{ required: true, max: 30 }]}>
                                            <Select disabled={!canEdit(session, tab, step.state) || state !== orderGeneralStates.DRAFT} defaultValue="US" onChange={handleCountryCode}>
                                                <Option value="CA">Canada</Option>
                                                <Option value="US">United States of America</Option>
                                                <Option value="MX">Mexico</Option>
                                                <Option value="CL">Chile</Option>
                                                <Option value="AR">Argentina</Option>
                                            </Select >
                                        </Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={24}>
                                    <Item label={"Estado o Provincia"} name={["originAddress", "stateOrProvinceCode"]} rules={[{ required: false }]}>
                                        <Select disabled={!canEdit(session, tab, step.state) || state !== orderGeneralStates.DRAFT} loading={loadingStateCodes}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            } showSearch={true}>
                                            {stateCodes?.map((st, index) => (
                                                <Option key={index} value={st?.code}>{st?.state}</Option>
                                            ))}
                                        </Select >
                                        </Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={24} sm={24} md={24}>
                                        <Item label={"Código Postal"} name={["originAddress", "postalCode"]} rules={[{ required: true, max: 30 }]}>
                                            <Input disabled={!canEdit(session, tab, step.state) || state !== orderGeneralStates.DRAFT}></Input>
                                        </Item>
                                    </Col>
                                </Row>


                                <Divider className="divider-margin" orientation="left" />
                                <Row>
                                    <Col xs={24} sm={24} md={24}>
                                        <Item label={t('orders.newOrder.contents.input5')} name="destination" rules={[{ required: true }]}>
                                            <Select disabled={!canEdit(session, tab, step.state) || state !== orderGeneralStates.DRAFT} defaultValue="US" onChange={handleCountryCode}>
                                                <Option value="CA">Canada</Option>
                                                <Option value="US">United States of America</Option>
                                                <Option value="MX">Mexico</Option>
                                                <Option value="BR">Brasil</Option>
                                            </Select >
                                        </Item>
                                    </Col>
                                </Row>

                                <Divider className="divider-margin" orientation="left" />


                                <Divider className="divider-margin" orientation="left" />
                                <Col style={{ alignItems: 'flex-start', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column' }}>
                                    <h2 className="title-primary">{t('orders.newOrder.contents.subtitle2')}</h2>
                                    <span className="text-color-gray">{t('orders.newOrder.contents.subtitleDescription2')} </span>
                                </Col>
                                <Divider className="divider-margin" orientation="left" />
                                <Item label="" name={`listing`} rules={[{ required: selectedProducts.length === 0 }]}>
                                    {selectedPartner ?
                                        <Row>
                                            <Col span={12}>
                                                <Select allowClear={true} loading={loadingListingsAndProducts} style={{ width: '100%' }} showSearch filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                } name={`listing`} defaultValue={"Seleccione un listing..."} onChange={handleListingChange} disabled={!canEdit(session, tab, step.state) || state !== orderGeneralStates.DRAFT}>
                                                    {listingsAndProducts?.map((listing) => {
                                                        return <Option key={listing.id} value={listing.id}>{listing.name?.replace(/[\u{0080}-\u{FFFF}]/gu, "")}</Option>
                                                    })}
                                                </Select>
                                            </Col>
                                            <Col>
                                                <Button type="link" icon={<DeleteOutlined />} disabled={selectedProducts?.length === 0 || !canEdit(session, tab, step.state) || state !== orderGeneralStates.DRAFT} onClick={clearSelectedProducts}>
                                                    Borrar todos</Button>
                                            </Col>
                                        </Row>
                                        : <span>Para seleccionar un listing primero debe elegir una cuenta.</span>
                                    }
                                </Item>
                                <Row>
                                    <Col xs={24} sm={24} md={24}>
                                        <Table columns={listingsColumns} dataSource={selectedProducts}
                                            footer={() =>
                                                <Row>
                                                    <Col xs={12} sm={12} md={12}>
                                                    </Col>
                                                    <Col xs={12} sm={12} md={12} style={{ textAlign: 'right' }}>
                                                        <h1>TOTAL | {sellingUnities} unidades de venta</h1>
                                                    </Col>
                                                </Row>
                                            } />
                                    </Col>
                                </Row>
                            </Form>
                            {
                                /*
    
                                <Divider className="divider-margin" orientation="left" />
                                <Col style={{ alignItems: 'flex-start', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column' }}>
                                    <h2 className="title-primary">{t('orders.newOrder.contents.subtitle4')}</h2>
                                    <span className="text-color-gray">{t('orders.newOrder.contents.subtitleDescription4')} </span>
                                </Col>
                                <Divider className="divider-margin" orientation="left" />
                                <Notes orderId={orderId} tab={tab} step={step} state={state} />
    
                                */

                            }
                        </>
                    )}
                    <Row justify="end" style={{ marginTop: 24 }}>
                        <Col>
                            <Affix offsetBottom={10}>
                                <Alert className="sticky-alert-message"
                                    action={
                                        <Space>
                                            <Popconfirm
                                                title={t('orders.confirmDelete')}
                                                onConfirm={handleCancelForm}
                                                onCancel={() => { }}
                                                icon={<WarningOutlined />}
                                                okText={t('yes')}
                                                cancelText={t('no')}
                                                okButtonProps={{ style: { backgroundColor: '#5365E3' } }}
                                            >
                                                <Button size="small" type="link" icon={<CloseOutlined />} disabled={!canSave}>
                                                    {t('orders.alertButtonClose')}</Button>
                                            </Popconfirm>
                                            <Button className="btn-primary" icon={<DownloadOutlined />} disabled={!canSave} onClick={handleSaveDraft}>
                                                {t('orders.alertButtonSave')}  </Button>
                                            <Button className="btn-link-filled" icon={<SendOutlined />} onClick={() => form.submit()} disabled={!canSave}>
                                                {t('orders.alertButtonSend')}</Button>
                                        </Space>
                                    }
                                />

                            </Affix>

                        </Col>
                    </Row>

                    <ModalRejectProposal updateStep={updateStep} remakeModalVisible={remakeModalVisible} setRemakeModalVisible={setRemakeModalVisible} partnerId={session.userInfo.partner_id[0]} listingId={null} formItemLayout={formItemLayout} setMyOrder={setContentReceived} step={orderSteps.CONTENIDO} orderId={orderId} />
                    <AMDocumentModal amDocumentModalVisible={amDocumentModalVisible} setAMDocumentModalVisible={setAMDocumentModalVisible} create={create} document={selectedDocument} setSuccessfullyEndDocuments={setSuccessfullyEndDocuments} />
                </div>
            }
        </Spin>
    )
}