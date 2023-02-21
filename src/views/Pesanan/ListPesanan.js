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
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import $ from "jquery";
import { getListPesanan } from "actions/PesananAction";
import Item from "components/Item";
import { updateStatus } from "actions/PesananAction";

class ListPesanan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      modalData: false,
      order_id: "",
      tanggal_pemesanan: "",
      tanggal_pengiriman: "",
      metode_pengiriman: "",
      total_harga_barang: "",
      total_ongkir: "",
      total_tagihan: "",
      item: "",

    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(updateStatus());
  }

  componentDidUpdate(prevProps) {
     const { updateStatusResult } = this.props;
     if (
       updateStatusResult &&
       prevProps.updateStatusResult !== updateStatusResult
     ) {
       //jika nilainya true && nilai sebelumnya tidak sama dengan yang baru
       this.props.dispatch(getListPesanan());
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
    const { modal, modalData } = this.state;
    const { getListPesananResult, getListPesananLoading, getListPesananError } =
      this.props;

    //initialize datatable
    $(document).ready(function () {
      var table = $("#datatable").DataTable({
          bDestroy: true,
          pagingType: "full_numbers",
          scrollX: true,
          "order": [
            [0, "desc"]
          ],
          language: {
            thousands: ".",
            decimal: ",",
          },
        });
      $('.dataTables_filter input[type="search"]').css({
        width: "350px",
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
                <Link
                  to="/admin/produk/tambah"
                  className="btn btn-primary float-right"
                >
                  <i className="nc-icon nc-simple-add" /> Tambah Produk
                </Link>
                <Button
                  style={{ backgroundColor: "#232531" }}
                  className="btn float-left"
                >
                  <i className="nc-icon nc-cloud-download-93" /> Download Data
                </Button>
              </CardHeader>
              <CardBody>
                {getListPesananResult ? (
                  <table id="datatable" className="display" width="100%">
                    <thead className="text-primary">
                      <tr>
                        <th>Order ID</th>
                        <th>Info Pelanggan</th>
                        <th>Tanggal & Metode Pengiriman</th>
                        <th>Produk</th>
                        <th>Status Pesanan</th>
                        <th>Total Harga</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(getListPesananResult).reverse().map((key) => (
                        <tr key={key}>
                          <td style={{verticalAlign: 'top'}}>
                            <label
                              style={{
                                fontSize: "13px",
                                width: "140px",
                              }}
                            >
                              {getListPesananResult[key].order_id}
                            </label>
                          </td>
                          <td style={{verticalAlign: 'top'}}>
                            <p
                              style={{
                                fontSize: "13px",
                                width: '180px',
                              }}
                            >
                              <label style={{ fontWeight: 'bold', margin: 0}}>Nama : </label>
                              <br/>{getListPesananResult[key].user.nama}
                            </p>
                            <p
                              style={{
                                fontSize: "13px",
                                width: '180px',
                              }}
                            ><label style={{ fontWeight: 'bold', margin: 0}}>Email : </label>
                              <br/>{getListPesananResult[key].user.email}
                            </p>
                            <p
                              style={{
                                fontSize: "13px",
                                width: '180px',
                              }}
                            ><label style={{ fontWeight: 'bold', margin: 0}}>No. Telepon : </label>
                              <br/>{getListPesananResult[key].user.nomerHp}
                            </p>
                          </td>
                          <td style={{verticalAlign: 'top'}}>
                            <p
                              style={{
                                fontSize: "13px",
                                width: '180px',
                              }}
                            >
                              <label style={{ fontWeight: 'bold', margin: 0}}>Tanggal Pemesanan : </label>
                              <br/>{getListPesananResult[key].tanggal_pemesanan}
                            </p>
                            <p
                              style={{
                                fontSize: "13px",
                                width: '180px',
                              }}
                            ><label style={{ fontWeight: 'bold', margin: 0}}>Permintaan Pengiriman : </label>
                              <br/>{getListPesananResult[key].tanggal_pengiriman}
                            </p>
                            <p
                              style={{
                                fontSize: "13px",
                                width: '180px',
                              }}
                            ><label style={{ fontWeight: 'bold', margin: 0}}>Metode Pengiriman : </label>
                              <br/>{getListPesananResult[key].metode_pengiriman}
                            </p>
                          </td>
                          <td>
                            <div style={{
                                width: '150px',
                              }}>
                            <Item item={getListPesananResult[key].item}/>
                            </div>
                          </td>
                          <td style={{verticalAlign: 'top'}}>
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
                          <td style={{verticalAlign: 'top'}}>
                            <p
                              style={{
                                fontSize: "13px",
                                width: '130px',
                              }}
                            >
                              <label style={{ fontWeight: 'bold', margin: 0}}>Subtotal Produk : </label>
                              <br/>Rp{getListPesananResult[key].total_harga_barang.toLocaleString("id-ID")}
                            </p>
                            <p
                              style={{
                                fontSize: "13px",
                                width: '130px',
                              }}
                            ><label style={{ fontWeight: 'bold', margin: 0}}>Ongkos Kirim : </label>
                              <br/>Rp{getListPesananResult[key].total_ongkir.toLocaleString("id-ID")}
                            </p>
                            <p
                              style={{
                                fontSize: "13px",
                                width: '130px',
                              }}
                            ><label style={{ fontWeight: 'bold', margin: 0, fontSize: '14px'}}>Total Harga : </label>
                              <br/><label style={{ fontWeight: 'bold', margin: 0, color: '#f69d93', fontSize: '14px'}}>Rp{getListPesananResult[key].total_tagihan.toLocaleString("id-ID")}</label>
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
                              <Button
                                color="primary"
                                className="ml-2"
                                onClick={() => {
                                  this.toggle();
                                  this.deskripsi(
                                    getListPesananResult[key].deskripsi
                                  );
                                }}
                              >
                                <i className="nc-icon nc-alert-circle-i" />{" "}
                                Detail
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    
                    <tfoot className="text-primary">
                      <tr>
                        <th>Order ID</th>
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

  updateStatusLoading: state.PesananReducer.updateStatusLoading,
  updateStatusResult: state.PesananReducer.updateStatusResult,
  updateStatusError: state.PesananReducer.updateStatusError,
});

export default connect(mapStateToProps, null)(ListPesanan);
