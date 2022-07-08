import React, { useState } from 'react';
import { Divider, Button, Card, Modal, Tabs, Row, Col, Image } from 'antd';
import { marketplaceCurrency } from '../../../../../utils/const';
import AmazonPreviewModal from './AmazonPreviewModal'
import WalmartPreviewModal from './WalmartPreviewModal';
import ShopifyPreviewModal from './ShopifyPreviewModal';
import EbayPreviewModal from './EbayPreviewModal';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const { TabPane } = Tabs;

const draftPreviewByMarketplace = {
    "Amazon": AmazonPreviewModal,
    "Amazon Mexico": AmazonPreviewModal,
    "Amazon Canada": AmazonPreviewModal,
    "Amazon Brazil": AmazonPreviewModal,
    "Ebay": EbayPreviewModal,
    "Ebay Canada": EbayPreviewModal,
    "Ebay Spain": EbayPreviewModal,
    "Ebay Germany": EbayPreviewModal,
    "Walmart": WalmartPreviewModal,
    "Shopify": ShopifyPreviewModal
}

const DraftPreviewByMarketplace = (props) => {
    let Comp = draftPreviewByMarketplace[props.marketplace];
    return <Comp {...props}></Comp>
}

export default ({ draft, marketplace, loadingCreateListing, handleNewListing, createListing, exportExcel }) => {

    const { t } = useTranslation();
    const session = useSelector(store => store.Session.session);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [currentTab, setCurrentTab] = useState('');

    const getBrand = {
        "Amazon": (item) => { return item?.attributes[0]?.brand?.value || item?.attributes?.brand?.value },
        "Amazon Mexico": (item) => { return item?.attributes[0]?.brand?.value || item?.attributes?.brand?.value },
        "Amazon Canada": (item) => { return item?.attributes[0]?.brand?.value || item?.attributes?.brand?.value },
        "Amazon Brazil": (item) => { return item?.attributes[0]?.brand?.value || item?.attributes?.brand?.value },
        "Ebay": (item) => { return item.attributes?.Brand },
        "Ebay Canada": (item) => { return item.attributes?.Brand },
        "Ebay Spain": (item) => { return item.attributes?.Brand },
        "Ebay Germany": (item) => { return item.attributes?.Brand },
        "Walmart": (item) => { return item.attributes?.productIdentifiers?.brand },
        "Shopify": (item) => { return item.attributes?.vendor },
    }

    return (
        draft ?
            <>
                <Modal visible={previewVisible} width={marketplace === 'Ebay' ? "80%" : "fit-content"} footer={null} onCancel={() => setPreviewVisible(false)} title={<span style={{ fontSize: '20px' }}>{marketplace}</span>}>
                    <DraftPreviewByMarketplace draft={draft} marketplace={marketplace} />
                </Modal>
                <div className="draft-container">
                    <Tabs onChange={(e) => setCurrentTab(e.key)}>
                        {draft?.variants?.length > 0 ?
                            draft?.variants?.map((variant, index) => (
                                <TabPane key={variant.defaultCode} tab={variant.defaultCode}>
                                    <div style={{ width: "100%" }}>
                                        {draft &&
                                            <div className="draft-card-container">
                                                <Col span={18}>
                                                    <Card className="draft-card">
                                                        <div className="draft-text-image">
                                                            <div className="draft-text-left-image">
                                                                <div className="draft-text-container">
                                                                    <span className="draft-text-label">{t('onboarding.draft.name')}</span>
                                                                    <span className="draft-text-value">{variant.title}</span>
                                                                </div>
                                                                <Divider orientation="left" />
                                                                <div className="draft-text-container">
                                                                    <span className="draft-text-label">{t('onboarding.draft.brand')}</span>
                                                                    <span className="draft-text-value">{getBrand[marketplace](variant)}</span>
                                                                </div>
                                                                <Divider orientation="left" />
                                                                <div className="draft-text-container">
                                                                    <span className="draft-text-label">{t('onboarding.draft.sku')}</span>
                                                                    <span className="draft-text-value">{variant.defaultCode}</span>
                                                                </div>
                                                            </div>
                                                            <div className="draft-image" style={{ backgroundImage: `url(${variant.mainImages[0]?.url})` }} />
                                                        </div>
                                                        <Divider orientation="left" />
                                                        <div className="draft-text-container">
                                                            <span className="draft-text-label">{t('onboarding.draft.measures')}</span>
                                                            <div className="draft-measures-container">
                                                                <div>
                                                                    <span className="draft-text-label">{`${t('onboarding.draft.width')}: `}</span>
                                                                    <span className="draft-text-value draft-measure-value">{`${variant.width} ${variant.measureUnity}`}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="draft-text-label">{`${t('onboarding.draft.height')}: `}</span>
                                                                    <span className="draft-text-value draft-measure-value">{`${variant.height} ${variant.measureUnity}`}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="draft-text-label">{`${t('onboarding.draft.length')}: `}</span>
                                                                    <span className="draft-text-value draft-measure-value">{`${variant.length} ${variant.measureUnity}`}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Divider orientation="left" />
                                                        <div className="draft-rest-container">
                                                            <div className="draft-text-container">
                                                                <span className="draft-text-label">{t('onboarding.draft.weight')}</span>
                                                                <span className="draft-text-value">{`${variant.weight} ${variant.weightUnity}`}</span>
                                                            </div>
                                                            <Divider orientation="left" />
                                                            <div className="draft-text-container">
                                                                <span className="draft-text-label">{t('onboarding.draft.images')}</span>
                                                                <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', overflow: 'auto', maxWidth: '1000px' }}>
                                                                    {[...variant.mainImages, ...variant.productImages].map((image, index) => (
                                                                        <div key={index} className="draft-tiny-image" style={{ backgroundImage: `url(${image.url})` }} />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <Divider orientation="left" />
                                                            <div className="draft-text-container">
                                                                <span className="draft-text-label">{t('onboarding.draft.preferredPrice')}</span>
                                                                <span className="draft-text-value">{`${marketplaceCurrency[marketplace]} ${variant.price}`}</span>
                                                            </div>
                                                        </div>
                                                        <Divider orientation="left" />
                                                    </Card>
                                                </Col>
                                                <Col span={6} style={{ alignSelf: 'center' }}>
                                                    <Row>
                                                        <div className="draft-buttons-container">
                                                            <span className="draft-buttons-title">{t('onboarding.draft.ready')}</span>
                                                            {session?.userInfo?.role === 'Admin' &&
                                                                <Button loading={loadingCreateListing} className="draft-buttons btn-basic-green" onClick={exportExcel}>{t('onboarding.draft.exportExcel')}</Button>
                                                            }

                                                            <Button className="draft-buttons btn-basic-green" onClick={() => setPreviewVisible(true)}>{t('onboarding.draft.preview')}</Button>
                                                            {session.userInfo.role === 'Admin' ? (
                                                                <>
                                                                    <Button className="draft-buttons btn-basic-green" onClick={createListing}
                                                                        disabled={marketplace === 'Amazon' && draft?.product?.externalId}>
                                                                        {marketplace !== 'Amazon' ? t('onboarding.draft.createUpdateNewListing') : t('onboarding.draft.createNewListing')}</Button>
                                                                    <Button className="draft-buttons btn-basic-green" >{t('onboarding.draft.createOrder')}</Button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {/* <Button className="draft-buttons btn-basic-green" onClick={createListing} disabled={marketplace === 'Amazon'}>
                                                                    {marketplace === 'Ebay' ? t('onboarding.draft.createNewListingEbay') : t('onboarding.draft.createNewListing')}</Button> */}
                                                                    <Button loading={loadingCreateListing} className="draft-buttons btn-basic-white" onClick={handleNewListing}>{t('onboarding.draft.createAnotherListing')}</Button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </Row>
                                                </Col>
                                            </div>}
                                    </div>
                                </TabPane>
                            ))
                            :
                            <TabPane tab={`${draft?.product.defaultCode}`} key={`${draft?.product.defaultCode}`}>
                                <div style={{ width: "100%" }}>
                                    {draft ?
                                        <div className="draft-card-container">
                                            <Col span={18}>
                                                <Card className="draft-card">
                                                    <div className="draft-text-image">
                                                        <div className="draft-text-left-image">
                                                            <div className="draft-text-container">
                                                                <span className="draft-text-label">{t('onboarding.draft.name')}</span>
                                                                <span className="draft-text-value">{draft.product.title}</span>
                                                            </div>
                                                            <Divider orientation="left" />
                                                            <div className="draft-text-container">
                                                                <span className="draft-text-label">{t('onboarding.draft.brand')}</span>
                                                                <span className="draft-text-value">{getBrand[marketplace](draft.product)}</span>
                                                            </div>
                                                            <Divider orientation="left" />
                                                            <div className="draft-text-container">
                                                                <span className="draft-text-label">{t('onboarding.draft.sku')}</span>
                                                                <span className="draft-text-value">{draft.product.defaultCode}</span>
                                                            </div>
                                                        </div>
                                                        {draft.product.mainImages?.length > 0 ?
                                                            <div className="draft-image" style={{ backgroundImage: `url(${draft.product.mainImages[0]?.url})` }} />
                                                            : <Image width={250} height={250} src="error" fallback="data:image/png;base64,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" />}
                                                    </div>
                                                    <Divider orientation="left" />
                                                    <div className="draft-text-container">
                                                        <span className="draft-text-label">{t('onboarding.draft.measures')}</span>
                                                        <div className="draft-measures-container">
                                                            <div>
                                                                <span className="draft-text-label">{`${t('onboarding.draft.width')}: `}</span>
                                                                <span className="draft-text-value draft-measure-value">{`${draft.product.width} ${draft.product.measureUnity || ''}`}</span>
                                                            </div>
                                                            <div>
                                                                <span className="draft-text-label">{`${t('onboarding.draft.height')}: `}</span>
                                                                <span className="draft-text-value draft-measure-value">{`${draft.product.height} ${draft.product.measureUnity || ''}`}</span>
                                                            </div>
                                                            <div>
                                                                <span className="draft-text-label">{`${t('onboarding.draft.length')}: `}</span>
                                                                <span className="draft-text-value draft-measure-value">{`${draft.product.length} ${draft.product.measureUnity || ''}`}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Divider orientation="left" />
                                                    <div className="draft-rest-container">
                                                        <div className="draft-text-container">
                                                            <span className="draft-text-label">{t('onboarding.draft.weight')}</span>
                                                            <span className="draft-text-value">{`${draft.product.weight} ${draft.product.weightUnity || ''}`}</span>
                                                        </div>
                                                        <Divider orientation="left" />
                                                        <div className="draft-text-container">
                                                            <span className="draft-text-label">{t('onboarding.draft.images')}</span>
                                                            <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', overflow: 'auto', maxWidth: '1000px' }}>
                                                                {[...draft.product.mainImages, ...draft.product.productImages].map((image, index) => (
                                                                    <div key={index} className="draft-tiny-image" style={{ backgroundImage: `url(${image.url})` }} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <Divider orientation="left" />
                                                        <div className="draft-text-container">
                                                            <span className="draft-text-label">{t('onboarding.draft.preferredPrice')}</span>
                                                            <span className="draft-text-value">{`${marketplaceCurrency[marketplace]} ${draft.product.price}`}</span>
                                                            {/* <span className="draft-text-value">{currencyFormatter(currency, draft.product.price)}</span> */}
                                                        </div>
                                                    </div>
                                                    <Divider orientation="left" />
                                                </Card>
                                            </Col>
                                            <Col span={6} style={{ alignSelf: 'center' }}>
                                                <Row>
                                                    <div className="draft-buttons-container">
                                                        <span className="draft-buttons-title">{t('onboarding.draft.ready')}</span>
                                                        {session?.userInfo?.role === 'Admin' &&
                                                            <Button loading={loadingCreateListing} className="draft-buttons btn-basic-green" onClick={exportExcel}>{t('onboarding.draft.exportExcel')}</Button>
                                                        }

                                                        <Button className="draft-buttons btn-basic-green" onClick={() => setPreviewVisible(true)}>{t('onboarding.draft.preview')}</Button>
                                                        {session.userInfo.role === 'Admin' ? (
                                                            <>
                                                                <Button className="draft-buttons btn-basic-green" onClick={createListing}
                                                                    disabled={marketplace === 'Amazon' && draft?.product?.externalId}>
                                                                    {marketplace !== 'Amazon' ? t('onboarding.draft.createUpdateNewListing') : t('onboarding.draft.createNewListing')}</Button>
                                                                <Button className="draft-buttons btn-basic-green" >{t('onboarding.draft.createOrder')}</Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {/* <Button className="draft-buttons draft-buttons-2" type="primary" onClick={createListing} disabled={marketplace === 'Amazon'}>
                                                                {marketplace === 'Ebay' ? t('onboarding.draft.createNewListingEbay') : t('onboarding.draft.createNewListing')}</Button> */}
                                                                <Button loading={loadingCreateListing} className="draft-buttons btn-basic-white" onClick={handleNewListing}>{t('onboarding.draft.createAnotherListing')}</Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </Row>
                                            </Col>
                                        </div>
                                        : null}
                                </div>
                            </TabPane>
                        }

                    </Tabs>
                </div>
            </>
            : null
    );
}