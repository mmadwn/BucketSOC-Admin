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
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import Swal from "sweetalert2";
import $ from "jquery";
import { getListProduk } from "actions/ProdukAction";
import { deleteProduk } from "actions/ProdukAction";
import { getListKategori } from "actions/KategoriAction";

class ListProduk extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      modalData: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getListProduk());
    this.props.dispatch(getListKategori());
  }

  removeData = (image, id) => {
    Swal.fire({
      title: "Ingin Menghapus Data?",
      text: "Anda tidak akan dapat mengembalikan ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#f69d93",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Kembali",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        //akses ke action
        this.props.dispatch(deleteProduk(image, id));
        Swal.fire({
          title: "Menghapus Data...",
          icon: "info",
          iconColor: "#f69d93",
          showCancelButton: false,
          showConfirmButton: false,
        });
      }
    });
  };

  componentDidUpdate(prevProps) {
    const { deleteProdukResult } = this.props;

    if (
      deleteProdukResult &&
      prevProps.deleteProdukResult !== deleteProdukResult
    ) {
      Swal.fire({
        title: "Sukses",
        text: deleteProdukResult,
        icon: "success",
        confirmButtonColor: "#f69d93",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload();
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
    const { modal, modalData } = this.state;
    const { getListProdukError, getListProdukLoading, getListProdukResult, getListKategoriResult } =
      this.props;
    let kategoriList = [];
    Object.keys(getListKategoriResult).forEach((key) => {
      kategoriList.push({
        key: key,
        nama: getListKategoriResult[key].nama,
      });
    });

    //initialize datatable
    $(document).ready(function () {
      var table = $("#datatable").DataTable({
          bDestroy: true,
          pagingType: "full_numbers",
          scrollX: true,
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
                <CardTitle tag="h4">Tabel Data Produk</CardTitle>
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
                {getListProdukResult ? (
                  <table id="datatable" className="display" width="100%">
                    <thead className="text-primary">
                      <tr>
                        <th>Gambar</th>
                        <th>Nama Produk</th>
                        <th>Kategori</th>
                        <th>Harga</th>
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(getListProdukResult).reverse().map((key) => (
                        <tr key={key}>
                          <td>
                            <div
                              style={{
                                width: "80px",
                              }}
                            >
                              <img
                                src={getListProdukResult[key].gambar[0]}
                                alt={getListProdukResult[key].nama}
                              />
                            </div>
                          </td>
                          <td>
                            <label
                              style={{
                                textAlign: "justify",
                                fontSize: "14px",
                                width: "280px",
                              }}
                            >
                              {getListProdukResult[key].nama}
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
                              {getListKategoriResult
                                ? kategoriList.find((x) =>
                                  x.key === getListProdukResult[key].kategori
                                ).nama
                                : null}
                            </label>
                          </td>
                          <td>
                            <Label
                              style={{
                                textAlign: "justify",
                                fontSize: "14px",
                                width: "90px",
                              }}
                            >
                              {getListProdukResult[key].harga.toLocaleString(
                                "id-ID"
                              )}
                            </Label>
                          </td>
                          <td>
                            <label
                              style={{
                                textAlign: "justify",
                                fontSize: "14px",
                                width: "80px",
                              }}
                            >
                              {getListProdukResult[key].ready === true
                                ? "Aktif"
                                : "Tidak Aktif"}
                            </label>
                          </td>
                          <td>
                            <div
                              style={{
                                textAlign: "justify",
                                fontSize: "14px",
                                width: "340px",
                              }}
                            >
                              <Button
                                color="primary"
                                className="ml-2"
                                onClick={() => {
                                  this.toggle();
                                  this.deskripsi(
                                    getListProdukResult[key].deskripsi
                                  );
                                }}
                              >
                                <i className="nc-icon nc-alert-circle-i" />{" "}
                                Deskripsi
                              </Button>
                              <Link
                                className="btn btn-warning ml-2"
                                to={"/admin/produk/edit/" + key}
                              >
                                <i className="nc-icon nc-ruler-pencil" /> Edit
                              </Link>
                              <Button
                                color="danger"
                                className="ml-2"
                                onClick={() =>
                                  this.removeData(
                                    getListProdukResult[key].gambar,
                                    key
                                  )
                                }
                              >
                                <i className="nc-icon nc-basket" /> Hapus
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="text-primary">
                      <tr>
                        <th>Gambar</th>
                        <th>Nama Produk</th>
                        <th>Kategori</th>
                        <th>Harga</th>
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                    </tfoot>
                  </table>
                ) : getListProdukLoading ? (
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
                ) : getListProdukError ? (
                  <div
                    style={{
                      justifyContent: "center",
                      display: "flex",
                      marginBottom: "100px",
                      marginTop: "70px",
                    }}
                  >
                    <label>{getListProdukError}</label>
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
  getListProdukLoading: state.ProdukReducer.getListProdukLoading,
  getListProdukResult: state.ProdukReducer.getListProdukResult,
  getListProdukError: state.ProdukReducer.getListProdukError,

  deleteProdukLoading: state.ProdukReducer.deleteProdukLoading,
  deleteProdukResult: state.ProdukReducer.deleteProdukResult,
  deleteProdukError: state.ProdukReducer.deleteProdukError,

  getListKategoriLoading: state.KategoriReducer.getListKategoriLoading,
  getListKategoriResult: state.KategoriReducer.getListKategoriResult,
  getListKategoriError: state.KategoriReducer.getListKategoriError,
});

export default connect(mapStateToProps, null)(ListProduk);
