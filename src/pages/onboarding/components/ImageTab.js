import React, { useEffect, useState } from 'react';
import { Row, Col, Divider, Form, Input, Button, Alert, Space, Typography, Tabs, Collapse, Modal, Card } from 'antd';
import { maxLength2000, descriptionImagesForMarkets, imageSectionEnum, listingStates, formItemLayout, sellerMarketplaces } from '../../../utils/const';
import { InfoCircleOutlined, DownloadOutlined, CloseOutlined } from '@ant-design/icons';
import AcceptedProposalAlert from './steps/AcceptedProposalAlert';
import { marketsWithVideos } from '../../../utils/const';
import { canEdit } from '../../../utils/functions';
import ProposalAlert from './steps/ProposalAlert';
import { useTranslation } from 'react-i18next';
import { useForm } from 'antd/lib/form/Form';
import { useSelector } from 'react-redux';
import UploadImage from './UploadImage';
import Pending from './steps/Pending';
import produce from 'immer';
import '../onboarding.css';
import 'antd/dist/antd.css';

const { Item } = Form;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Link, Title } = Typography;

export const ImagesTab = ({ setSavingDraft, onClickAcceptProposal, onClickRejectProposal, selected, setSelected, updateStep, form, step, tab, isLap, images, setImages }) => {

    const { t } = useTranslation()
    const session = useSelector(store => store.Session.session);
    const marketplaces = images ? Object.keys(images[tab]) : [];
    const [showModalVariant, setShowModalVariant] = useState(false);
    const [variant, setVariant] = useState();
    const [variantForm] = useForm();
    const [selectedMarketplace, setSelectedMarketplace] = useState();
    const [acceptedProposal, setAcceptedProposal] = useState(false);

    const DescriptionPerMarketplace = ({ marketplace, images }) => (
        <Collapse style={{ marginBottom: 24 }} bordered={false} defaultActiveKey={['1', '3']}>
            <Panel header={'Manual de imágenes'} key="1" styles={{ textAlign: 'left' }}>
                <Row>
                    <Col span={24}>
                        {marketplace && <span dangerouslySetInnerHTML={{ __html: descriptionImagesForMarkets[marketplace.split(' ')[0]] }} />}
                    </Col>
                    <Col span={24}>
                        <Button icon={<DownloadOutlined />} target="_blank">
                            <Link style={{ color: '#FFFF' }}
                                href={'https://lapmarketplace.com/files/Manual%20de%20Fotos%20Listings%20-%20LAP.pdf'}
                                target="_blank" > Descargar</Link>
                        </Button>
                    </Col>
                </Row>
            </Panel>
            {marketplace == 'Walmart' && images?.LAP?.Walmart?.product?.attributes?.notFound ?
                <Panel key="3" header={'Error de sincronización desde Walmart'}>
                    <Row>
                        <Col span={24}>
                            <Alert
                                message="Error de sincronización desde Walmart"
                                showIcon
                                description="El proceso de sincronización no pudo obtener más información del producto correspondiente al SKU. 
      Por favor, verifique que el SKU/UPC/GTIN es correcto en los sistemas de Walmart, sincronice nuevamente. Si el mensaje persiste, por favor contacte al equipo de soporte de Walmart en https://sellerhelp.walmart.com/s indicando que el producto no puede ser obtenido."
                                type="error"
                                action={
                                    <Button size="small" target="_blank" href="https://sellerhelp.walmart.com/s" danger>
                                        Contactar a soporte
                                    </Button>
                                }
                            />
                        </Col>
                    </Row>
                </Panel>
                : null}
        </Collapse>
    );

    const showVariant = (vari, marketplace) => {
        setVariant(vari);
        setShowModalVariant(true);
        setSelectedMarketplace(marketplace);
        variantForm.setFieldsValue(vari);
    }

    const saveVariant = () => {
        let values = variantForm.getFieldsValue();
        let idx = images.Client[selectedMarketplace].variants.findIndex((v) => { return v.id === variant.id });
        const newImages = produce(images, draft => {
            if (idx > -1) {
                draft.Client[selectedMarketplace].variants[idx].video = values.video;
            }
            return draft;
        })
        setImages(newImages);
        form.setFieldsValue(newImages);
        setShowModalVariant(false);
    }

    useEffect(() => {
        if (step && step.state === listingStates.COMPLETED)
            setAcceptedProposal(true);
    }, [step]);

    return (
        <>
            {!acceptedProposal
                && !session.userInfo.isAdmin
                && step?.state === listingStates.PENDING_ACKNOWLEDGE
                && <ProposalAlert onClickAccept={() => { onClickAcceptProposal(); setAcceptedProposal(true); }} onClickReject={onClickRejectProposal} />
            }
            {
                acceptedProposal
                && <AcceptedProposalAlert nextStep={() => setSelected(selected + 1)} />
            }
            {
                !session.userInfo.isAdmin
                    && step?.state === listingStates.PENDING_LAP ?
                    <Pending /> :
                    <>
                        {session.userInfo.isAdmin ? step?.state === listingStates.PENDING_LAP && (
                            step.clientComment && <Card className="text-align-left">
                                <Row>
                                    <Col span={6}>
                                        <p style={{ fontWeight: 'bold' }}>Comentarios Cliente</p>
                                    </Col>
                                    <Col span={18}>
                                        <p style={{ fontStyle: 'italic' }}>{step.clientComment}</p>
                                    </Col>
                                </Row>
                            </Card>
                        ) : [listingStates.PENDING_ACKNOWLEDGE, listingStates.COMPLETED].includes(step?.state) && (
                            step.lapComment && <Card className="text-align-left">
                                <Row>
                                    <Col span={6}>
                                        <p style={{ fontWeight: 'bold' }}>Comentarios LAP</p>
                                    </Col>
                                    <Col span={18}>
                                        <p style={{ fontStyle: 'italic' }}>{step.lapComment}</p>
                                    </Col>
                                </Row>
                            </Card>
                        )}

                        <Row>
                            <Col span={24} align="left">
                                <Tabs defaultActiveKey="Amazon" >
                                    {marketplaces.length > 0 && marketplaces?.map(marketplace => (
                                        <TabPane key={marketplace} tab={marketplace} >
                                            <Row>
                                                <Col span={24} align="left">
                                                    <DescriptionPerMarketplace images={images} marketplace={marketplace} />
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col xs={24} sm={24} md={24}>
                                                    <Item label={t('onboarding.images.input1')} className="input-form-margin-bottom"
                                                        tooltip={{
                                                            title: t('onboarding.images.input1Description'),
                                                            icon: <InfoCircleOutlined />,
                                                        }}>
                                                        <UploadImage isLap={isLap} productId={images['Client'][marketplace].product.id} setSavingDraft={setSavingDraft} form={form}
                                                            type={'categoryImages'} limit={10} step={step} tab={'Client'} marketplace={marketplace} group={0} currentTab={tab}
                                                            setImages={setImages} images={images} session={session} requiresValidation={false} />
                                                    </Item>
                                                </Col>
                                                <Divider className="divider-margin" />
                                                <Col xs={24} sm={24} md={24}>
                                                    <Item label={t('onboarding.images.input2')} className="input-form-margin-bottom" tooltip={{
                                                        title: t('onboarding.images.input2Description'),
                                                        icon: <InfoCircleOutlined />,
                                                    }}>
                                                        <UploadImage isLap={isLap} productId={images['Client'][marketplace].product.id} setSavingDraft={setSavingDraft} form={form}
                                                            type={'mainImages'} step={step} tab={'Client'} marketplace={marketplace} group={0} currentTab={tab}
                                                            setImages={setImages} images={images} session={session} requiresValidation={true} />
                                                    </Item>
                                                </Col>
                                                <Divider className="divider-margin" />
                                                {[...Array(6)].map((c, index) => (
                                                    <Col xs={24} sm={24} md={24}>
                                                        <Item label={`${t('onboarding.images.input3')} N° ${index + 1}`} className="input-form-margin-bottom" tooltip={{
                                                            title: t('onboarding.images.input3Description'),
                                                            icon: <InfoCircleOutlined />,
                                                        }}>
                                                            <UploadImage isLap={isLap} productId={images['Client'][marketplace].product.id} setSavingDraft={setSavingDraft} form={form}
                                                                type={'productImages'} step={step} tab={'Client'} marketplace={marketplace} group={index} currentTab={tab}
                                                                setImages={setImages} images={images} session={session} requiresValidation={true} />
                                                        </Item>
                                                    </Col>
                                                ))}
                                                <Divider orientation="left" />
                                                {marketsWithVideos[marketplace] &&
                                                    <>
                                                        <Col span={24} align="left" >
                                                            <h3 className="title-primary">{t('onboarding.images.formTitle2')}</h3>
                                                        </Col>
                                                        <Col span={24} align="left" >
                                                            <span className="text-color-gray">{t(`onboarding.images.formSubtitle`)} </span>
                                                        </Col>
                                                        <Col xs={24} sm={24} md={24}>
                                                            <Item label={t('onboarding.images.input6')} className="input-form-margin-bottom" name={['Client', marketplace, "product", "video"]}
                                                                rules={[{ required: false, message: "Ingrese una URL válida", pattern: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/ }]}
                                                                tooltip={{
                                                                    title: t('onboarding.images.input6Description'),
                                                                    icon: <InfoCircleOutlined />,
                                                                }}>
                                                                <Input
                                                                    name="video"
                                                                    placeholder={t('documents.link')}
                                                                    disabled={!canEdit(session, tab, step?.state)}
                                                                />
                                                            </Item>
                                                        </Col>
                                                        <Divider />
                                                    </>
                                                }
                                            </Row>
                                            {images['Client'][marketplace].variants.length > 0 &&
                                                <>
                                                    <Row>
                                                        <Col span={24} align="left" >
                                                            <h3 className="title-primary">{t('onboarding.images.formTitle3')}</h3>
                                                        </Col>
                                                        <Divider className="divider-margin" />
                                                        <Col span={24}>

                                                            {images['Client'][marketplace].variants.map((variant, idx) =>
                                                            (
                                                                <Col key={variant.defaultCode} span={24} align="left" style={{ marginBottom: 5 }} >
                                                                    <Item hidden={true} name={['Client', marketplace, "variants", idx, "id"]}>
                                                                        <Input />
                                                                    </Item>
                                                                    <Item hidden={true} name={['Client', marketplace, "variants", idx, "video"]}>
                                                                        <Input />
                                                                    </Item>
                                                                    <Row>
                                                                        <Col span={4}>
                                                                            <Title level={5}>{variant?.defaultCode}</Title>
                                                                        </Col>
                                                                        <Col span={4}>
                                                                            <span className="text-color-gray">
                                                                                <Button type="primary" onClick={() => { showVariant(variant, marketplace) }}>Ver imágenes</Button>
                                                                            </span>
                                                                        </Col>
                                                                        <Col span={16} />
                                                                    </Row>
                                                                </Col>
                                                            ))}
                                                        </Col>
                                                    </Row>
                                                </>
                                            }
                                        </TabPane>
                                    ))}
                                </Tabs>
                            </Col>
                        </Row>
                        {session.userInfo.isAdmin && tab === 'LAP' && (
                            <>
                                <Divider className="divider-margin" />
                                <Row>
                                    <Col xs={24} sm={24} md={24}>
                                        <Item label={t('onboarding.measuresAndPrices.LAPComment')} name={"lapComment"} rules={[{ required: false }, { max: maxLength2000 }]}
                                            tooltip={{
                                                title: t('onboarding.measuresAndPrices.LAPCommentDescription'),
                                                icon: <InfoCircleOutlined />,
                                            }}>
                                            <Input.TextArea
                                                rows={10}
                                                name="lapComment"
                                                maxLength={maxLength2000}
                                                showCount={true}
                                                disabled={!canEdit(session, tab, step?.state)} />
                                        </Item>
                                    </Col>
                                </Row>
                            </>
                        )
                        }
                        {variant && selectedMarketplace && <Modal
                            width={'90%'}
                            closable={false}
                            style={{ top: 20 }}
                            visible={showModalVariant}
                            onCancel={() => {
                                setShowModalVariant(false)
                            }}
                            okButtonProps={{ style: { display: 'none' } }}
                            cancelButtonProps={{ style: { display: 'none' } }}
                        >
                            <Alert message={`${variant.defaultCode}`} action={
                                <Space>
                                    <Button size="small" type="link" icon={<CloseOutlined />}
                                        onClick={() => setShowModalVariant(false)}>
                                        Cerrar
                                    </Button>
                                    <Button type="primary" onClick={() => {
                                        saveVariant();
                                    }}>
                                        {t('onboarding.modalVariantsButtonSave')}
                                    </Button>
                                </Space>
                            } />
                            <Form form={variantForm} name="formulario" {...formItemLayout} className="text-align-left form-padding-top">
                                <Row >
                                    <Col xs={24} sm={24} md={24}>
                                        <Item label={t('onboarding.images.input1')} className="input-form-margin-bottom" name={imageSectionEnum.CATEGORY}
                                            tooltip={{
                                                title: t('onboarding.images.input1Description'),
                                                icon: <InfoCircleOutlined />,
                                            }}>
                                            <UploadImage isVariant={true} isLap={isLap} productId={variant.id} setSavingDraft={setSavingDraft} form={form}
                                                type={'categoryImages'} limit={10} step={step} tab={'Client'} marketplace={selectedMarketplace} group={0} currentTab={tab}
                                                setImages={setImages} images={images} session={session} requiresValidation={false} />
                                        </Item>
                                    </Col>
                                    <Divider className="divider-margin" />
                                    <Col xs={24} sm={24} md={24}>
                                        <Item label={t('onboarding.images.input2')} className="input-form-margin-bottom" name={imageSectionEnum.MAIN}
                                            tooltip={{
                                                title: t('onboarding.images.input2Description'),
                                                icon: <InfoCircleOutlined />,
                                            }}>
                                            <UploadImage isVariant={true} isLap={isLap} productId={variant.id} setSavingDraft={setSavingDraft} form={form}
                                                type={'mainImages'} step={step} tab={'Client'} marketplace={selectedMarketplace} group={0} currentTab={tab}
                                                setImages={setImages} images={images} session={session} requiresValidation={true} />
                                        </Item>
                                    </Col>
                                    <Divider className="divider-margin" />
                                    {[...Array(6)].map((c, index) => (
                                        <Col xs={24} sm={24} md={24}>
                                            <Item label={`${t('onboarding.images.input3')} N° ${index + 1}`} className="input-form-margin-bottom" name={imageSectionEnum.PRODUCT}
                                                tooltip={{
                                                    title: t('onboarding.images.input3Description'),
                                                    icon: <InfoCircleOutlined />,
                                                }}>
                                                <UploadImage isVariant={true} isLap={isLap} productId={variant.id} setSavingDraft={setSavingDraft} form={form}
                                                    type={'productImages'} step={step} tab={'Client'} marketplace={selectedMarketplace} group={index} currentTab={tab}
                                                    setImages={setImages} images={images} session={session} requiresValidation={true} />
                                            </Item>
                                        </Col>
                                    ))}
                                    <Divider className="divider-margin" />
                                    <Col xs={24} sm={24} md={24}>
                                        <Item label={t('onboarding.images.input6')} className="input-form-margin-bottom" name="video"
                                            rules={[{ required: false, message: "Ingrese una URL válida", pattern: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/ }]}
                                            tooltip={{
                                                title: t('onboarding.images.input6Description'),
                                                icon: <InfoCircleOutlined />,
                                            }}>
                                            <Input name="video" placeholder={t('documents.link')}
                                                disabled={!canEdit(session, isLap ? 'LAP' : tab, step?.state)}
                                                maxLength={maxLength2000}
                                            />
                                        </Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Modal>
                        }
                    </>
            }
        </>
    )
}