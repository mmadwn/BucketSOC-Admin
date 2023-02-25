import { getListBanner, deleteBanner } from "actions/BannerAction";
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
import { RiDeleteBin5Fill } from "react-icons/ri";
import { AiFillEdit}  from "react-icons/ai"
import Swal from "sweetalert2";
import $ from "jquery";

class ListBanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      modalData: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getListBanner());
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
        this.props.dispatch(deleteBanner(image, id));
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
    const { deleteBannerResult } = this.props;

    if (
      deleteBannerResult &&
      prevProps.deleteBannerResult !== deleteBannerResult
    ) {
      Swal.fire({
        title: "Sukses",
        text: deleteBannerResult,
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
    const { getListBannerError, getListBannerLoading, getListBannerResult } =
      this.props;
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
                <CardTitle tag="h4">Tabel Data Banner</CardTitle>
                <Link
                  to="/admin/banner/tambah"
                  className="btn btn-primary float-right full-btn"
                >
                  <i className="nc-icon nc-simple-add" /> Tambah Banner
                </Link>
                <Button
                  style={{ backgroundColor: "#232531" }}
                  className="btn float-left full-btn"
                >
                  <i className="nc-icon nc-cloud-download-93" /> Download Data
                </Button>
              </CardHeader>
              <CardBody>
                {getListBannerResult ? (
                  <table id="datatable" className="display" width="100%">
                    <thead className="text-primary">
                      <tr>
                        <th>Gambar</th>
                        <th>Judul Banner</th>
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(getListBannerResult)
                        .reverse()
                        .map((key) => (
                          <tr key={key}>
                            <td>
                              <div
                                style={{
                                  width: "300px",
                                }}
                              >
                                <img
                                  src={getListBannerResult[key].gambar}
                                  alt={getListBannerResult[key].title}
                                />
                              </div>
                            </td>
                            <td>
                              <label
                                style={{
                                  textAlign: "justify",
                                  fontSize: "14px",
                                  width: "380px",
                                }}
                              >
                                {getListBannerResult[key].title}
                              </label>
                            </td>
                            <td>
                              <label
                                style={{
                                  textAlign: "justify",
                                  fontSize: "14px",
                                  width: "80px",
                                }}
                              >
                                {getListBannerResult[key].active === true
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
                                      getListBannerResult[key].deskripsi
                                    );
                                  }}
                                >
                                  <i className="nc-icon nc-alert-circle-i" />{" "}
                                  Deskripsi
                                </Button>
                                <Link
                                  className="btn btn-warning ml-2"
                                  to={"/admin/banner/edit/" + key}
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
                                      getListBannerResult[key].gambar,
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
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                    </tfoot>
                  </table>
                ) : getListBannerLoading ? (
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
                ) : getListBannerError ? (
                  <div
                    style={{
                      justifyContent: "center",
                      display: "flex",
                      marginBottom: "100px",
                      marginTop: "70px",
                    }}
                  >
                    <label>{getListBannerError}</label>
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
            Deskripsi Banner
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
  getListBannerLoading: state.BannerReducer.getListBannerLoading,
  getListBannerResult: state.BannerReducer.getListBannerResult,
  getListBannerError: state.BannerReducer.getListBannerError,

  deleteBannerLoading: state.BannerReducer.deleteBannerLoading,
  deleteBannerResult: state.BannerReducer.deleteBannerResult,
  deleteBannerError: state.BannerReducer.deleteBannerError,
});

export default connect(mapStateToProps, null)(ListBanner);
