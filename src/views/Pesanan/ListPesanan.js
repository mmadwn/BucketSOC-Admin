import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import $ from "jquery";
import { getListPesanan } from "actions/PesananAction";
import Item from "components/Item";
import { CSVLink } from "react-csv";

class ListPesanan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      modalData: false,
      csvData: [],
      csvHeaders: [],
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    document.title = "Data Pesanan - Sistem Informasi Admin Bucket SOC";
    this.props.dispatch(getListPesanan());
  }

  componentDidUpdate(prevProps) {
    const { getListPesananResult } = this.props;
    if (
      getListPesananResult &&
      prevProps.getListPesananResult !== getListPesananResult
    ) {
      const csvHeaders = [
        { label: "ID Pesanan", key: "order_id" },
        { label: "Status Pesanan", key: "status_pesanan" },
        { label: "Total Harga", key: "total_tagihan" },
        { label: "Subtotal Produk", key: "total_harga_barang" },
        { label: "Ongkos Kirim", key: "total_ongkir" },
        { label: "Tanggal Pemesanan", key: "tanggal_pemesanan" },
        {
          label: "Tanggal Permintaan Pengiriman / Pengambilan",
          key: "tanggal_pengiriman",
        },
        { label: "Metode Pengiriman", key: "metode_pengiriman" },
        { label: "Asuransi Pengiriman", key: "asuransi" },
        { label: "ID Pengiriman", key: "biteship_id" },
        { label: "URL Pembayaran", key: "url_midtrans" },
        { label: "Nama Pelanggan", key: "nama" },
        { label: "Email Pelanggan", key: "email" },
        { label: "No. Telepon Pelanggan", key: "nomerHp" },
        { label: "Alamat", key: "alamat" },
        { label: "Detail Alamat", key: "detail_alamat" },
        { label: "Latitude", key: "latitude" },
        { label: "Longitude", key: "longitude" },
      ];

      let maxProduk = 0;
      Object.keys(getListPesananResult).forEach((orderKey) => {
        const pesanan = getListPesananResult[orderKey];
        if (pesanan.item && Object.keys(pesanan.item).length > maxProduk) {
          maxProduk = Object.keys(pesanan.item).length;
        }
      });

      for (let i = 0; i < maxProduk; i++) {
        csvHeaders.push({
          label: `Nama Produk ${i + 1}`,
          key: `item[${i}].produk.nama`,
        });
        csvHeaders.push({
          label: `Harga Produk ${i + 1}`,
          key: `item[${i}].produk.harga`,
        });
        csvHeaders.push({
          label: `Kuantitas Produk ${i + 1}`,
          key: `item[${i}].jumlah`,
        });
        csvHeaders.push({
          label: `Total Harga Produk ${i + 1}`,
          key: `item[${i}].total_harga`,
        });
        csvHeaders.push({
          label: `Catatan Produk ${i + 1}`,
          key: `item[${i}].catatan`,
        });
      }

      const csvData = Object.values(getListPesananResult)
        .reverse()
        .map((pesanan) => {
          const namaProduk = [];
          const hargaProduk = [];
          const kuantitasProduk = [];
          const totalHargaProduk = [];
          const catatanProduk = [];
          if (pesanan.item) {
            Object.keys(pesanan.item).forEach((key) => {
              namaProduk.push(pesanan.item[key].produk.nama);
              hargaProduk.push(pesanan.item[key].produk.harga);
              kuantitasProduk.push(pesanan.item[key].jumlah);
              totalHargaProduk.push(pesanan.item[key].total_harga);
              catatanProduk.push(pesanan.item[key].catatan);
            });
          }
          return {
            order_id: pesanan.order_id,
            status_pesanan: pesanan.status_pesanan,
            total_tagihan: pesanan.total_tagihan,
            total_harga_barang: pesanan.total_harga_barang,
            total_ongkir: pesanan.total_ongkir,
            tanggal_pemesanan: pesanan.tanggal_pemesanan,
            tanggal_pengiriman: pesanan.tanggal_pengiriman,
            metode_pengiriman: pesanan.metode_pengiriman,
            asuransi: pesanan.asuransi ? "Ya" : "Tidak",
            biteship_id: pesanan.biteship_id,
            url_midtrans: pesanan.url_midtrans,
            nama: pesanan.user.nama,
            email: pesanan.user.email,
            nomerHp: pesanan.user.nomerHp,
            alamat: pesanan.user.alamat,
            detail_alamat: pesanan.user.detail_alamat,
            latitude: pesanan.user.latitude,
            longitude: pesanan.user.longitude,
            ...namaProduk.reduce(
              (acc, curr, index) => ({
                ...acc,
                [`item[${index}].produk.nama`]: curr,
              }),
              {}
            ),
            ...hargaProduk.reduce(
              (acc, curr, index) => ({
                ...acc,
                [`item[${index}].produk.harga`]: curr,
              }),
              {}
            ),
            ...kuantitasProduk.reduce(
              (acc, curr, index) => ({
                ...acc,
                [`item[${index}].jumlah`]: curr,
              }),
              {}
            ),
            ...totalHargaProduk.reduce(
              (acc, curr, index) => ({
                ...acc,
                [`item[${index}].total_harga`]: curr,
              }),
              {}
            ),
            ...catatanProduk.reduce(
              (acc, curr, index) => ({
                ...acc,
                [`item[${index}].catatan`]: curr,
              }),
              {}
            ),
          };
        });

      this.setState({
        csvData: csvData,
        csvHeaders: csvHeaders,
      });
    }
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  deskripsi(deskripsi) {
    this.setState({
      modalData: deskripsi,
    });
  }

  render() {
    const { modal, modalData, csvData, csvHeaders } = this.state;
    const { getListPesananResult, getListPesananLoading, getListPesananError } =
      this.props;
    const nowDate = new Date().toLocaleString("id-ID");

    //initialize datatable
    $(document).ready(function () {
      var table = $("#datatable").DataTable({
        bDestroy: true,
        pagingType: "full_numbers",
        scrollX: true,
        order: [[0, "desc"]],
        language: {
          thousands: ".",
          decimal: ",",
        },
      });
      $('.dataTables_filter input[type="search"]').css({
        width: "320",
        display: "inline-block",
      });
      table.on("page.dt", function () {
        $("div").animate(
          {
            scrollTop: $(".dataTables_wrapper").offset().top,
          },
          0
        );
      });
    });

    return (
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Tabel Data Pesanan</CardTitle>
                {getListPesananResult ? (
                  <CSVLink
                    data={csvData}
                    headers={csvHeaders}
                    filename={"Data Pesanan " + nowDate + ".csv"}
                    className="btn float-left full-btn"
                    style={{ backgroundColor: "#232531" }}
                  >
                    <i className="nc-icon nc-cloud-download-93" /> Download Data
                  </CSVLink>
                ) : null}
              </CardHeader>
              <CardBody>
                {getListPesananResult ? (
                  <table id="datatable" className="display" width="100%">
                    <thead className="text-primary">
                      <tr>
                        <th>ID Pesanan</th>
                        <th>Info Pelanggan</th>
                        <th>Tanggal & Metode Pengiriman</th>
                        <th>Produk</th>
                        <th>Status Pesanan</th>
                        <th>Total Harga</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(getListPesananResult)
                        .reverse()
                        .map((key) => (
                          <tr key={key}>
                            <td style={{ verticalAlign: "top" }}>
                              <label
                                style={{
                                  fontSize: "13px",
                                  width: "140px",
                                }}
                              >
                                {getListPesananResult[key].order_id}
                              </label>
                            </td>
                            <td style={{ verticalAlign: "top" }}>
                              <p
                                style={{
                                  fontSize: "13px",
                                  width: "180px",
                                }}
                              >
                                <label
                                  style={{ fontWeight: "bold", margin: 0 }}
                                >
                                  Nama :{" "}
                                </label>
                                <br />
                                {getListPesananResult[key].user.nama}
                              </p>
                              <p
                                style={{
                                  fontSize: "13px",
                                  width: "180px",
                                }}
                              >
                                <label
                                  style={{ fontWeight: "bold", margin: 0 }}
                                >
                                  Email :{" "}
                                </label>
                                <br />
                                {getListPesananResult[key].user.email}
                              </p>
                              <p
                                style={{
                                  fontSize: "13px",
                                  width: "180px",
                                }}
                              >
                                <label
                                  style={{ fontWeight: "bold", margin: 0 }}
                                >
                                  No. Telepon :{" "}
                                </label>
                                <br />
                                {getListPesananResult[key].user.nomerHp}
                              </p>
                            </td>
                            <td style={{ verticalAlign: "top" }}>
                              <p
                                style={{
                                  fontSize: "13px",
                                  width: "180px",
                                }}
                              >
                                <label
                                  style={{ fontWeight: "bold", margin: 0 }}
                                >
                                  Tanggal Pemesanan :{" "}
                                </label>
                                <br />
                                {getListPesananResult[key].tanggal_pemesanan}
                              </p>
                              <p
                                style={{
                                  fontSize: "13px",
                                  width: "180px",
                                }}
                              >
                                {getListPesananResult[key].order_id.slice(
                                  -1
                                ) === "A" ? (
                                  <label
                                    style={{ fontWeight: "bold", margin: 0 }}
                                  >
                                    Permintaan Pengiriman :{" "}
                                  </label>
                                ) : (
                                  <label
                                    style={{ fontWeight: "bold", margin: 0 }}
                                  >
                                    Permintaan Pengambilan :{" "}
                                  </label>
                                )}

                                <br />
                                {getListPesananResult[key].tanggal_pengiriman}
                              </p>
                              <p
                                style={{
                                  fontSize: "13px",
                                  width: "180px",
                                }}
                              >
                                <label
                                  style={{ fontWeight: "bold", margin: 0 }}
                                >
                                  Metode Pengiriman :{" "}
                                </label>
                                <br />
                                {getListPesananResult[key].metode_pengiriman}
                              </p>
                            </td>
                            <td>
                              <div
                                style={{
                                  width: "150px",
                                }}
                              >
                                <Item item={getListPesananResult[key].item} />
                              </div>
                            </td>
                            <td style={{ verticalAlign: "top" }}>
                              <label
                                style={{
                                  textAlign: "center",
                                  fontSize: "13px",
                                  width: "140px",
                                }}
                              >
                                {getListPesananResult[key].status_pesanan}
                              </label>
                            </td>
                            <td style={{ verticalAlign: "top" }}>
                              <p
                                style={{
                                  fontSize: "13px",
                                  width: "130px",
                                }}
                              >
                                <label
                                  style={{ fontWeight: "bold", margin: 0 }}
                                >
                                  Subtotal Produk :{" "}
                                </label>
                                <br />
                                Rp
                                {getListPesananResult[
                                  key
                                ].total_harga_barang.toLocaleString("id-ID")}
                              </p>
                              <p
                                style={{
                                  fontSize: "13px",
                                  width: "130px",
                                }}
                              >
                                <label
                                  style={{ fontWeight: "bold", margin: 0 }}
                                >
                                  Ongkos Kirim :{" "}
                                </label>
                                <br />
                                Rp
                                {getListPesananResult[
                                  key
                                ].total_ongkir.toLocaleString("id-ID")}
                              </p>
                              <p
                                style={{
                                  fontSize: "13px",
                                  width: "130px",
                                }}
                              >
                                <label
                                  style={{
                                    fontWeight: "bold",
                                    margin: 0,
                                    fontSize: "14px",
                                  }}
                                >
                                  Total Harga :{" "}
                                </label>
                                <br />
                                <label
                                  style={{
                                    fontWeight: "bold",
                                    margin: 0,
                                    color: "#f69d93",
                                    fontSize: "14px",
                                  }}
                                >
                                  Rp
                                  {getListPesananResult[
                                    key
                                  ].total_tagihan.toLocaleString("id-ID")}
                                </label>
                              </p>
                            </td>
                            <td>
                              <div
                                style={{
                                  textAlign: "justify",
                                  fontSize: "14px",
                                  width: "120px",
                                }}
                              >
                                <Link
                                  className="btn btn-primary ml-2"
                                  to={"/admin/pesanan/detail/" + key}
                                >
                                  <i className="nc-icon nc-alert-circle-i" />{" "}
                                  Detail
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>

                    <tfoot className="text-primary">
                      <tr>
                        <th>ID Pesanan</th>
                        <th>Info Pelanggan</th>
                        <th>Tanggal & Metode Pengiriman</th>
                        <th>Produk</th>
                        <th>Status Pesanan</th>
                        <th>Total Harga</th>
                        <th>Aksi</th>
                      </tr>
                    </tfoot>
                  </table>
                ) : getListPesananLoading ? (
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
                ) : getListPesananError ? (
                  <div
                    style={{
                      justifyContent: "center",
                      display: "flex",
                      marginBottom: "100px",
                      marginTop: "70px",
                    }}
                  >
                    <label>{getListPesananError}</label>
                  </div>
                ) : (
                  <div
                    style={{
                      justifyContent: "center",
                      display: "flex",
                      marginBottom: "100px",
                      marginTop: "70px",
                    }}
                  >
                    <label>Data Kosong</label>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal centered isOpen={modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle} style={{ fontSize: "12px" }}>
            <i
              style={{ fontSize: "13px" }}
              className="nc-icon nc-alert-circle-i"
            />{" "}
            Deskripsi Produk
          </ModalHeader>
          <ModalBody>
            <textarea
              value={modalData}
              disabled
              style={{
                maxHeight: 2000,
                resize: "inherit",
                height: 400,
                width: "100%",
                borderWidth: 0,
                color: "black",
              }}
            />
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  getListPesananLoading: state.PesananReducer.getListPesananLoading,
  getListPesananResult: state.PesananReducer.getListPesananResult,
  getListPesananError: state.PesananReducer.getListPesananError,
});

export default connect(mapStateToProps, null)(ListPesanan);
