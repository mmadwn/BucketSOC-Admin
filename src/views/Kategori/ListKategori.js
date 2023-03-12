import { getListKategori, deleteKategori } from "actions/KategoriAction";
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
  Row,
  Spinner,
} from "reactstrap";
import { AiFillEdit } from "react-icons/ai";
import { RiDeleteBin5Fill } from "react-icons/ri";
import Swal from "sweetalert2";
import $ from "jquery";
import { CSVLink } from "react-csv";

class ListKategori extends Component {
  constructor(props) {
    super(props);
    this.state = {
      csvData: [],
      csvHeaders: [
        { label: "Gambar", key: "gambar" },
        { label: "Nama Kategori", key: "nama" },
      ],
    };
  }
  componentDidMount() {
    document.title = "Data Kategori - Sistem Informasi Admin Bucket SOC";
    this.props.dispatch(getListKategori());
  }

  removeData = (image, name, id) => {
    Swal.fire({
      title: "Ingin Menghapus Kategori " + name + "?",
      text: "Produk yang tertaut akan kehilangan kategori. Anda tidak akan dapat mengembalikan ini!",
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
        this.props.dispatch(deleteKategori(image, id));
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
    const { deleteKategoriResult, getListKategoriResult } = this.props;
    if (getListKategoriResult !== prevProps.getListKategoriResult) {
      this.setState({
        csvData: Object.values(getListKategoriResult),
      });
    }

    if (
      deleteKategoriResult &&
      prevProps.deleteKategoriResult !== deleteKategoriResult
    ) {
      Swal.fire({
        title: "Sukses",
        text: deleteKategoriResult,
        icon: "success",
        confirmButtonColor: "#f69d93",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload();
      });
    }
  }

  render() {
    const {
      getListKategoriError,
      getListKategoriLoading,
      getListKategoriResult,
    } = this.props;
    const { csvData, csvHeaders } = this.state;
    const nowDate = new Date().toLocaleString("id-ID");
    //initialize datatable
    $(document).ready(function () {
      var table = $("#datatable").DataTable({
        bDestroy: true,
        pagingType: "full_numbers",
        scrollX: true,
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
                <CardTitle tag="h4">Tabel Data Kategori</CardTitle>
                <Link
                  to="/admin/kategori/tambah"
                  className="btn btn-primary float-right full-btn"
                >
                  <i className="nc-icon nc-simple-add" /> Tambah Kategori
                </Link>
                {getListKategoriResult ? (
                  <CSVLink
                    data={csvData}
                    headers={csvHeaders}
                    filename={"Data Kategori " + nowDate + ".csv"}
                    className="btn float-left full-btn"
                    style={{ backgroundColor: "#232531" }}
                  >
                    <i className="nc-icon nc-cloud-download-93" /> Download Data
                  </CSVLink>
                ) : null}
              </CardHeader>
              <CardBody>
                {getListKategoriResult ? (
                  <table id="datatable" className="display" width="100%">
                    <thead className="text-primary">
                      <tr>
                        <th>Gambar</th>
                        <th>Nama Kategori</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(getListKategoriResult)
                        .reverse()
                        .map((key) => (
                          <tr key={key}>
                            <td align="center">
                              <div
                                style={{
                                  width: "57px",
                                }}
                              >
                                <img
                                  src={getListKategoriResult[key].gambar}
                                  alt={getListKategoriResult[key].nama}
                                />
                              </div>
                            </td>
                            <td>
                              <label
                                style={{
                                  textAlign: "justify",
                                  fontSize: "14px",
                                  width: "700px",
                                }}
                              >
                                {getListKategoriResult[key].nama}
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
                                <Link
                                  className="btn btn-warning ml-2"
                                  to={"/admin/kategori/edit/" + key}
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
                                      getListKategoriResult[key].gambar,
                                      getListKategoriResult[key].nama,
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
                        <th>Judul</th>
                        <th>Aksi</th>
                      </tr>
                    </tfoot>
                  </table>
                ) : getListKategoriLoading ? (
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
                ) : getListKategoriError ? (
                  <div
                    style={{
                      justifyContent: "center",
                      display: "flex",
                      marginBottom: "100px",
                      marginTop: "70px",
                    }}
                  >
                    <label>{getListKategoriError}</label>
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
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  getListKategoriLoading: state.KategoriReducer.getListKategoriLoading,
  getListKategoriResult: state.KategoriReducer.getListKategoriResult,
  getListKategoriError: state.KategoriReducer.getListKategoriError,

  deleteKategoriLoading: state.KategoriReducer.deleteKategoriLoading,
  deleteKategoriResult: state.KategoriReducer.deleteKategoriResult,
  deleteKategoriError: state.KategoriReducer.deleteKategoriError,
});

export default connect(mapStateToProps, null)(ListKategori);
