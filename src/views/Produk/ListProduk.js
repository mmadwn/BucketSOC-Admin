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
import { AiFillEdit } from "react-icons/ai";
import { RiDeleteBin5Fill } from "react-icons/ri";
import $ from "jquery";
import { getListProduk } from "actions/ProdukAction";
import { deleteProduk } from "actions/ProdukAction";
import { getListKategori } from "actions/KategoriAction";
import { CSVLink } from "react-csv";

class ListProduk extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      modalData: false,
      csvData: [],
      csvHeaders: [
        { label: "Gambar 1", key: "gambar[0]" },
        { label: "Gambar 2", key: "gambar[1]" },
        { label: "Nama Produk", key: "nama" },
        { label: "Kategori", key: "kategori" },
        { label: "Harga", key: "harga" },
        { label: "Status", key: "ready" },
        { label: "Deskripsi Produk", key: "deskripsi" },
      ],
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getListProduk());
    this.props.dispatch(getListKategori());
  }

  removeData = (image, name, id) => {
    Swal.fire({
      title: "Ingin Menghapus Produk " + name + "?",
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
    const { deleteProdukResult, getListProdukResult } = this.props;
    if (
      getListProdukResult &&
      prevProps.getListProdukResult !== getListProdukResult
    ) {
      this.setState({
        csvData: Object.values(getListProdukResult),
      });
    }

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
    const { modal, modalData, csvData, csvHeaders } = this.state;
    const {
      getListProdukError,
      getListProdukLoading,
      getListProdukResult,
      getListKategoriResult,
    } = this.props;

    const nowDate = new Date().toLocaleString("id-ID");
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
                <CardTitle tag="h4">Tabel Data Produk</CardTitle>
                <Link
                  to="/admin/produk/tambah"
                  className="btn btn-primary float-right full-btn"
                >
                  <i className="nc-icon nc-simple-add" /> Tambah Produk
                </Link>
                <CSVLink
                  data={csvData}
                  headers={csvHeaders}
                  filename={"Data Produk " + nowDate + ".csv"}
                  className="btn float-left full-btn"
                  style={{ backgroundColor: "#232531" }}
                >
                  <i className="nc-icon nc-cloud-download-93" /> Download Data
                </CSVLink>
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
                      {Object.keys(getListProdukResult)
                        .reverse()
                        .map((key) => (
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
                                  ? kategoriList.find(
                                      (x) =>
                                        x.key ===
                                        getListProdukResult[key].kategori
                                    )
                                    ? kategoriList.find(
                                        (x) =>
                                          x.key ===
                                          getListProdukResult[key].kategori
                                      ).nama
                                    : "Tidak Ada Kategori"
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
                                  width: "350px",
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
                                  <AiFillEdit
                                    size="15px"
                                    style={{ verticalAlign: "sub" }}
                                  />{" "}
                                  Edit
                                </Link>
                                <Button
                                  color="danger"
                                  className="ml-2"
                                  onClick={() =>
                                    this.removeData(
                                      getListProdukResult[key].gambar,
                                      getListProdukResult[key].nama,
                                      key
                                    )
                                  }
                                >
                                  <RiDeleteBin5Fill
                                    size="15px"
                                    style={{ verticalAlign: "sub" }}
                                  />{" "}
                                  Hapus
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
          <ModalBody
            style={{
              maxHeight: "calc(100vh - 210px)",
              overflowY: "auto",
            }}
          >
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
