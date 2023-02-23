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
import Swal from "sweetalert2";
import $ from "jquery"

class ListKategori extends Component {
  componentDidMount() {
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
    const { deleteKategoriResult } = this.props;

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
                  className="btn btn-primary float-right"
                >
                  <i className="nc-icon nc-simple-add" /> Tambah Kategori
                </Link>
                <Button
                  style={{ backgroundColor: "#232531" }}
                  className="btn float-left"
                >
                  <i className="nc-icon nc-cloud-download-93" /> Download Data
                </Button>
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
                                  <i className="nc-icon nc-ruler-pencil" /> Edit
                                </Link>
                                <Button
                                  color="danger"
                                  className="ml-2"
                                  onClick={() =>
                                    this.removeData(
                                      getListKategoriResult[key].gambar,
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
