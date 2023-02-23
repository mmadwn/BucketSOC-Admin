import { getDetailPesanan } from "actions/PesananAction";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  FormGroup,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import Swal from "sweetalert2";
import $ from "jquery";
import { TbFileInvoice } from 'react-icons/tb';
import { createInvoice } from "actions/InvoiceAction";

class DetailPesanan extends Component {
  constructor(props) {
    super(props);
    //Deklarasi state atau variable awal
    this.state = {
      id: this.props.match.params.id,
      date: new Date().toLocaleString('id-ID'),
    };
  }

  //Dijalankan ketika nama Kategori diisi
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  componentDidMount() {
    this.props.dispatch(getDetailPesanan(this.props.match.params.id));
  }

  //Jika proses tambah kategori ke firebse database berhasil
  componentDidUpdate(prevProps) {
    const { tambahKategoriResult } = this.props;

    if (
      tambahKategoriResult &&
      prevProps.tambahKategoriResult !== tambahKategoriResult
    ) {
      Swal.fire({
        title: "Sukses",
        text: "Kategori Sukses Ditambahkan!",
        icon: "success",
        confirmButtonColor: "#f69d93",
        confirmButtonText: "OK",
      });
      this.props.history.push("/admin/kategori");
    }
  }

  invoice = () => {
    const {date} = this.state;
    const {dispatch, getDetailPesananResult} = this.props;
    let status_tagihan = '';
    let itemList = [];
    Object.keys(getDetailPesananResult.item).forEach(key => {
      itemList.push({
        name: getDetailPesananResult.item[key].produk.nama,
        quantity: getDetailPesananResult.item[key].jumlah,
        unit_cost: getDetailPesananResult.item[key].produk.harga,
        description: getDetailPesananResult.item[key].catatan ? 'Catatan: ' + getDetailPesananResult.item[key].catatan : null,
      });
    });
    if (getDetailPesananResult.url_midtrans) {
      if (getDetailPesananResult.status_pesanan === 'Menunggu Pembayaran') {
        status_tagihan = 'BELUM DIBAYAR';
      } else if (
        getDetailPesananResult.status_pesanan === 'Selesai (Pembayaran Gagal)' ||
        getDetailPesananResult.status_pesanan === 'Selesai (Dibatalkan Pembeli)' ||
        getDetailPesananResult.status_pesanan === 'Selesai (Dibatalkan Penjual)'
      ) {
        status_tagihan = 'DIBATALKAN';
      } else {
        status_tagihan = 'LUNAS';
      }
    } else {
      if (
        getDetailPesananResult.status_pesanan === 'Selesai (Dibatalkan Pembeli)' ||
        getDetailPesananResult.status_pesanan === 'Selesai (Dibatalkan Penjual)'
      ) {
        status_tagihan = 'DIBATALKAN';
      } else if (
        getDetailPesananResult.status_pesanan === 'Selesai (Pesanan Telah Diterima)'
      ) {
        status_tagihan = 'LUNAS';
      } else {
        status_tagihan = 'BELUM DIBAYAR';
      }
    }

    const data = {
      header: 'Invoice',
      to_title: 'Pelanggan',
      ship_to_title: 'Alamat',
      invoice_number_title: 'ORDER ID #',
      date_title: 'Tanggal Pemesanan',
      quantity_header: 'Jumlah',
      unit_cost_header: 'Harga Satuan',
      amount_header: 'Total Harga',
      shipping_title: 'Total Ongkos Kirim',
      subtotal_title: 'Total Harga Barang',
      total_title: 'Total Pesanan',
      balance_title: 'Total Tagihan',
      notes_title: 'Catatan',
      terms_title: 'Diperbarui pada',
      logo: 'https://i.ibb.co/f0rbMfm/Rounded-Logo-Copy.png',
      number: getDetailPesananResult.order_id,
      from: 'BUCKET SOC',
      to: getDetailPesananResult.user.nama + ' (' + getDetailPesananResult.user.nomerHp + ')',
      ship_to:
      getDetailPesananResult.user.alamat + '. Detail Alamat: ' + getDetailPesananResult.user.detail_alamat,
      currency: 'IDR',
      date: getDetailPesananResult.tanggal_pemesanan,
      items: itemList,
      shipping: getDetailPesananResult.total_ongkir,
      notes:
        'Invoice ini dibuat otomatis oleh sistem. Terimakasih atas pesanan Anda!',
      terms: date,
      custom_fields: [
        {
          name:
          getDetailPesananResult.order_id.slice(-1) === 'A'
              ? 'Tanggal Permintaan Pengiriman'
              : 'Tanggal Permintaan Pengambilan',
          value: getDetailPesananResult.tanggal_pengiriman,
        },
        {
          name: 'Metode Pengiriman dan Pembayaran',
          value: getDetailPesananResult.metode_pengiriman,
        },
        {
          name: 'Status Tagihan',
          value: status_tagihan,
        },
      ],
    };
    dispatch(createInvoice(data));
  }

  render() {
    const { getDetailPesananResult, getDetailPesananLoading, getDetailPesananError } = this.props;
    //initialize datatable
    $(document).ready(function () {
      var table = $("#datatable").DataTable({
        bDestroy: true,
        ordering: false,
        info: false,
        searching: false,
        paging: false,
        scrollX: true,
        language: {
          thousands: ".",
          decimal: ",",
        },
      });
      $('.dataTables_filter input[type="search"]').css({
        width: "320",
        display: "inline-block",
      });
    });
    return (
      <div className="content">
        {getDetailPesananResult ? (
          <div>
            <Row>
              <Col>
                <Link to="/admin/pesanan" className="btn btn-primary">
                  <i className="nc-icon nc-minimal-left" /> Kembali
                </Link>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card>
                  <CardHeader style={{ padding: 15 }}>
                    <Button
                      style={{ margin: 7 }}
                      className="btn btn-primary float-right"
                    >
                      <i className="nc-icon nc-basket" /> Lihat Invoice
                    </Button>

                    <Button
                      style={{ margin: 7 }}
                      className="btn btn-primary float-right"
                      onClick={() => this.invoice()}
                    >
                      <TbFileInvoice size='15px' style={{verticalAlign: 'sub'}} /> Lihat Invoice
                    </Button>
                  </CardHeader>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card>
                  <CardHeader>
                    <CardTitle tag="h5">Detail Pesanan</CardTitle>
                  </CardHeader>
                  <hr style={{ margin: 0 }} />
                  <CardBody>
                    <Col md="11">
                      <FormGroup>
                        <Row>
                          <Col md="6">
                            <Label className="card-subtitle">Status</Label>
                          </Col>
                          <Col>
                            <Label className="status">
                              {getDetailPesananResult.status_pesanan}
                            </Label>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col md="6">
                            <Label className="card-subtitle">Order ID</Label>
                          </Col>
                          <Col>
                            <Label>{getDetailPesananResult.order_id}</Label>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col md="6">
                            <Label className="card-subtitle">Total Harga</Label>
                          </Col>
                          <Col>
                            <Label>
                              Rp
                              {getDetailPesananResult.total_tagihan.toLocaleString(
                                "id-ID"
                              )}
                            </Label>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col md="6">
                            <Label className="card-subtitle">
                              Tanggal Pemesanan
                            </Label>
                          </Col>
                          <Col>
                            <Label>
                              {getDetailPesananResult.tanggal_pemesanan}
                            </Label>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col md="6">
                            <Label className="card-subtitle">
                              Tanggal Permintaan Pengiriman
                            </Label>
                          </Col>
                          <Col>
                            <Label>
                              {getDetailPesananResult.tanggal_pengiriman}
                            </Label>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col md="6">
                            <Label className="card-subtitle">
                              Metode Pengiriman
                            </Label>
                          </Col>
                          <Col>
                            <Label>
                              {getDetailPesananResult.metode_pengiriman}
                            </Label>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col md="6">
                            <Label className="card-subtitle">
                              Asuransi Pengiriman
                            </Label>
                          </Col>
                          <Col>
                            <Label>
                              {getDetailPesananResult.asuransi === true
                                ? "Ya"
                                : "Tidak"}
                            </Label>
                          </Col>
                        </Row>
                      </FormGroup>
                    </Col>
                  </CardBody>
                </Card>
              </Col>
              <Col>
                <Card>
                  <CardHeader>
                    <CardTitle tag="h5">Detail Pelanggan</CardTitle>
                  </CardHeader>
                  <hr style={{ margin: 0 }} />
                  <CardBody>
                    <Col md="11">
                      <FormGroup>
                        <Row>
                          <Col md="5">
                            <Label className="card-subtitle">Nama</Label>
                          </Col>
                          <Col>
                            <Label>{getDetailPesananResult.user.nama}</Label>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col md="5">
                            <Label className="card-subtitle">Email</Label>
                          </Col>
                          <Col>
                            <Label>{getDetailPesananResult.user.email}</Label>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col md="5">
                            <Label className="card-subtitle">
                              Nomor Telepon
                            </Label>
                          </Col>
                          <Col>
                            <Label>{getDetailPesananResult.user.nomerHp}</Label>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col md="5">
                            <Label className="card-subtitle">Alamat</Label>
                          </Col>
                          <Col>
                            <Label>{getDetailPesananResult.user.alamat}</Label>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col md="5">
                            <Label className="card-subtitle">
                              Detail Alamat
                            </Label>
                          </Col>
                          <Col>
                            <Label>
                              {getDetailPesananResult.user.detail_alamat}
                            </Label>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col md="5">
                            <Label className="card-subtitle">Latitude</Label>
                          </Col>
                          <Col>
                            <Label>
                              {getDetailPesananResult.user.latitude}
                            </Label>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col md="5">
                            <Label className="card-subtitle">Longitude</Label>
                          </Col>
                          <Col>
                            <Label>
                              {getDetailPesananResult.user.longitude}
                            </Label>
                          </Col>
                        </Row>
                      </FormGroup>
                    </Col>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card>
                  <CardHeader>
                    <CardTitle tag="h5">Detail Item</CardTitle>
                  </CardHeader>
                  <hr style={{ margin: 0 }} />
                  <CardBody>
                    <table id="datatable" className="display" width="100%">
                      <thead className="text-primary">
                        <tr>
                          <th>Gambar</th>
                          <th>Nama Produk</th>
                          <th>Jumlah</th>
                          <th>Harga Satuan</th>
                          <th>Total Harga</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(getDetailPesananResult.item).map((key) => (
                          <tr key={key}>
                            <td align="center">
                              <div
                                style={{
                                  width: "60px",
                                }}
                              >
                                <img
                                  src={
                                    getDetailPesananResult.item[key].produk
                                      .gambar[0]
                                  }
                                  alt={
                                    getDetailPesananResult.item[key].produk.nama
                                  }
                                />
                              </div>
                            </td>
                            <td>
                              <label
                                style={{
                                  textAlign: "justify",
                                  fontSize: "14px",
                                  width: "500px",
                                }}
                              >
                                {getDetailPesananResult.item[key].produk.nama}
                              </label>
                              {getDetailPesananResult.item[key].catatan ? (
                                <label
                                  style={{
                                    textAlign: "justify",
                                    fontSize: "12px",
                                    width: "500px",
                                  }}
                                >
                                  Catatan :{" "}
                                  {getDetailPesananResult.item[key].catatan}
                                </label>
                              ) : null}
                            </td>
                            <td>
                              <label
                                style={{
                                  textAlign: "justify",
                                  fontSize: "14px",
                                  width: "50px",
                                }}
                              >
                                {getDetailPesananResult.item[key].jumlah}
                              </label>
                            </td>
                            <td>
                              <label
                                style={{
                                  textAlign: "justify",
                                  fontSize: "14px",
                                  width: "150px",
                                }}
                              >
                                Rp
                                {getDetailPesananResult.item[
                                  key
                                ].produk.harga.toLocaleString("id-ID")}
                              </label>
                            </td>
                            <td>
                              <label
                                style={{
                                  textAlign: "justify",
                                  fontSize: "14px",
                                  width: "150px",
                                }}
                              >
                                Rp
                                {getDetailPesananResult.item[
                                  key
                                ].total_harga.toLocaleString("id-ID")}
                              </label>
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>
                            <Label
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                              }}
                            >
                              Subtotal Produk
                            </Label>
                          </td>
                          <td>
                            <Label
                              style={{
                                fontSize: "14px",
                              }}
                            >
                              Rp
                              {getDetailPesananResult.total_harga_barang.toLocaleString(
                                "id-ID"
                              )}
                            </Label>
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>
                            <Label
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                              }}
                            >
                              Ongkos Kirim
                            </Label>
                          </td>
                          <td>
                            <Label
                              style={{
                                fontSize: "14px",
                              }}
                            >
                              Rp
                              {getDetailPesananResult.total_ongkir.toLocaleString(
                                "id-ID"
                              )}
                            </Label>
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>
                            <Label
                              style={{
                                fontSize: "15px",
                                fontWeight: "bold",
                              }}
                            >
                              Total Harga
                            </Label>
                          </td>
                          <td>
                            <Label
                              style={{
                                fontWeight: "bold",
                                color: "#f69d93",
                                fontSize: "15px",
                              }}
                            >
                              Rp
                              {getDetailPesananResult.total_tagihan.toLocaleString(
                                "id-ID"
                              )}
                            </Label>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        ) : getDetailPesananLoading ? (
          <div
            style={{
              justifyContent: "center",
              display: "flex",
              marginBottom: "100px",
              marginTop: "70px",
            }}
          >
            <Spinner color="primary" />
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  getDetailPesananLoading: state.PesananReducer.getDetailPesananLoading,
  getDetailPesananResult: state.PesananReducer.getDetailPesananResult,
  getDetailPesananError: state.PesananReducer.getDetailPesananError,
});

export default connect(mapStateToProps, null)(DetailPesanan);
