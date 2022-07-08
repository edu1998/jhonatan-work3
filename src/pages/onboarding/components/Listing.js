import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Button, Card, Spin, Tooltip, Space, Popconfirm, Dropdown, Menu } from "antd";
import {
  PlusOutlined,
  UnorderedListOutlined, RedoOutlined, CloseCircleOutlined, DashOutlined
} from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";
import partnerApi from "../../../api/partner";
import listingApi from "../../../api/listing";
import { TableListing } from "./TableListing";
import { openNotification } from "../../../components/Toastr";
import xlsx from "xlsx";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "../../../api/api";
import moment from 'moment';

const antIcon = <RedoOutlined spin />;

const Listing = ({ profileCompleted }) => {
  const [loadingCreateListing, setLoadingCreateListing] = useState(false);
  const [getListings, setGetListings] = useState(false);
  const [loadingGetListingsFromMarketplaces, setLoadingGetListingsFromMarketplaces] = useState();
  const [loadingSyncStock, setLoadingSyncStock] = useState(false);
  const [loadingUnlinkMatchesFBA, setLoadingUnlinkMatchesFBA] = useState(false);
  const [syncStatus, setSyncStatus] = useState();

  const history = useHistory();
  const { t } = useTranslation()

  const session = useSelector((store) => store.Session.session);

  useEffect(() => {
    getSyncStatus();
  }, []);

  const getSyncStatus = async () => {
    setLoadingGetListingsFromMarketplaces(true);
    try {
      const { data } = await listingApi.getSyncStatus(session.userInfo.commercial_partner_id[0]);
      setLoadingGetListingsFromMarketplaces(!data.finished);
      setSyncStatus(data);
      if (!data.finished) {
        setTimeout(() => {
          getSyncStatus();
        }, 60000); //every 30 seconds
      }
    } catch (error) {
      setLoadingGetListingsFromMarketplaces(false);
    }
  }

  const getListingsFromMarkteplaces = async () => {
    setLoadingGetListingsFromMarketplaces(true);
    try {
      const { data } = await listingApi.getAllFromMkts(session.userInfo.commercial_partner_id[0]);
      setGetListings(true);
      setLoadingGetListingsFromMarketplaces(false);
      getSyncStatus();
      openNotification({ status: true, content: "Los listings estan siendo sincronizados desde los marketplaces, en unos minutos estarán disponibles" });
    } catch (error) {
      openNotification({ status: false, content: error?.response?.data?.message || t('home.listing.error') });
      setLoadingGetListingsFromMarketplaces(false);

    }
  }

  const cancelSyncListingsFromMarkteplaces = async () => {
    setLoadingGetListingsFromMarketplaces(true);
    try {
      const { data } = await listingApi.cancelSyncListings(session.userInfo.commercial_partner_id[0]);
      setGetListings(true);
      setLoadingGetListingsFromMarketplaces(false);
      getSyncStatus();
      openNotification({ status: true, content: "Se canceló el proceso de sincronización" });
    } catch (error) {
      openNotification({ status: false, content: error?.response?.data?.message || t('home.listing.error') });
      setLoadingGetListingsFromMarketplaces(false);

    }
  }

  const SyncTooltip = () => {
    return (
      <Space direction="vertical" size="small">
        <span>{t('home.listing.tooltipSyncListings')}</span>
        {syncStatus && syncStatus.createdAt ? <span>
          {syncStatus.finished ? 'Última sincronizacion: ' + moment(syncStatus.finishedAt).fromNow() : 'Última sincronizacion iniciada: ' + moment(syncStatus.createdAt).fromNow()}
        </span> : null}
      </Space>);
  }

  const handleNewListing = async () => {
    setLoadingCreateListing(true);
    await partnerApi
      .insertListing(session.userInfo.partner_id[0])
      .then((res) => {
        const listingId = res.data;
        setLoadingCreateListing(false);
        history.push(`onboarding/${listingId}`);
      })
      .catch((error) => {
        setLoadingCreateListing(false);
        openNotification({
          status: false,
          content: "Error al crear un nuevo listing",
        });
      });
  };

  const syncFbaStockByPartner = async () => {
    const values = {
      partnerId: session?.userInfo?.partner_id[0],
    }
    setLoadingSyncStock(true);
    await listingApi.syncFbaStock(values)
      .then((result) => {
        openNotification({ status: true, content: 'Sincronización de stock con FBA de manera exitosa' });
        setGetListings(true);
      })
      .catch((error) => {
        openNotification({ status: false, content: getErrorMessage(error) });
      });
    setLoadingSyncStock(false);
  }

  const unlinkMatchesFBA = async () => {
    const values = { commercial_partner_id: session?.userInfo?.commercial_partner_id[0] };
    setLoadingUnlinkMatchesFBA(true);
    await listingApi.unlinkMatchesFBA(values)
      .then((result) => {
        openNotification({ status: true, content: 'Se desvincularon los productos matcheados para FBA' });
        setGetListings(true);
      })
      .catch((error) => {
        openNotification({ status: false, content: getErrorMessage(error) });
      });
    setLoadingUnlinkMatchesFBA(false);
  }

  const handleExport = async () => {
    const res = await listingApi.getDocument(session.userInfo.partner_id[0]);
    const wb = xlsx.read(res.data.data, { type: "buffer" });
    xlsx.writeFile(wb, "listings.xlsx");
  };

  return (
    <Spin spinning={loadingCreateListing}>
      <Row className="home-listing-main-row listings-main">
        <Col span={24} xs={24} sm={24} md={24}>
          <Card className="home-listing-card">
            <Row >
              <Col span={syncStatus && !syncStatus.finished ? 5 : 8} md={6} >
                <div className="home-listing-card-content">
                  <Col>
                    <div className="home-listing-card-content">
                      <div style={{ textAlign: 'left' }}>
                        <span className="home-listing-title" style={{ fontSize: '22px', marginTop: '10px' }} >
                          <UnorderedListOutlined className="btn-primary home-listing-title-icon" />
                          <span style={{ marginLeft: 10 }}>Listing</span>
                        </span>
                      </div>
                      <span className="home-listing-title-description">
                        {t('home.listing.subTitle')}
                      </span>
                    </div>
                  </Col>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={0} sm={8} md={10} />
              <Col
                xs={24}
                sm={16}
                md={14}
                className=" text-align-right"
              >
                {syncStatus && syncStatus.createdAt && !syncStatus.finished &&
                  <Popconfirm placement="top" title={'¿Está seguro de cancelar el proceso de sincronización?'} onConfirm={cancelSyncListingsFromMarkteplaces} okText="Sí" cancelText="No">
                    <Button
                      icon={<CloseCircleOutlined />}
                      danger
                      className="margin-left-10"
                      disabled={!session.userInfo.x_can_publish}
                    >
                      Cancelar sincronización
                    </Button>

                  </Popconfirm>
                }
                <Button style={{ marginRight: 10 }}
                  icon={<PlusOutlined />}
                  className={profileCompleted ? "btn-link-filled margin-left-10" : "margin-left-10"}
                  disabled={!profileCompleted}
                  onClick={handleNewListing}
                >
                  {t('home.listing.add')}
                </Button>
                <Tooltip placement="topLeft" title={<SyncTooltip />}>
                  <Button
                    loading={loadingGetListingsFromMarketplaces}
                    icon={loadingGetListingsFromMarketplaces ? null : <RedoOutlined />}
                    className="btn-primary margin-left-10"
                    disabled={(session.userInfo.x_can_publish && session.userInfo.sellerAccountStatus) ? null : true}
                    onClick={getListingsFromMarkteplaces}
                  >
                    {' '}{t('home.listing.syncListings')}
                  </Button>
                </Tooltip>
                <Tooltip placement="topLeft" title={t('home.listing.tooltipSyncStockFBA')}>
                  <Button
                    icon={loadingSyncStock ? <Spin indicator={antIcon} /> : <RedoOutlined />}
                    className="btn-primary margin-left-10"
                    disabled={(session.userInfo.x_can_publish && session.userInfo.sellerAccountStatus) ? null : true}
                    onClick={syncFbaStockByPartner}
                  >
                    {' '}{t('home.listing.syncStockFBA')}
                  </Button>
                </Tooltip>
                <Tooltip placement="topLeft" title={t('home.listing.tooltipUnlinkMatchesFBA')}>
                  <Button
                    icon={loadingUnlinkMatchesFBA ? <Spin indicator={antIcon} /> : <RedoOutlined />}
                    className="btn-primary margin-left-10"
                    disabled={(session.userInfo.x_can_publish && session.userInfo.sellerAccountStatus) ? null : true}
                    onClick={unlinkMatchesFBA}
                  >
                    {' '}{t('home.listing.unlinkMatchesFBA')}
                  </Button>
                </Tooltip>
              </Col>
            </Row>
            <Row className="home-listing-table-parent">
              <Col xs={24} sm={24} md={24}>
                <TableListing
                  profileCompleted={profileCompleted}
                  partnerId={session && session.userInfo.commercial_partner_id[0]}
                  selectable={true} getListings={getListings} setGetListings={setGetListings}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Spin>
  )
};

export default React.memo(Listing);
