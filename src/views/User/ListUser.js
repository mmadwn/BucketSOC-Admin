import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Spinner,
} from "reactstrap";
import $ from "jquery";
import { getListUser } from "actions/UserAction";
import { CSVLink } from "react-csv";

class ListUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      csvData: [],
      csvHeaders: [
        { label: "Nama", key: "nama" },
        { label: "Email", key: "email" },
        { label: "Nomor Telepon", key: "nomerHp" },
        { label: "Alamat", key: "alamat" },
        { label: "Detail Alamat", key: "detail_alamat" },
      ],
    };
  }

  componentDidMount() {
    document.title = "Data User - Sistem Informasi Admin Bucket SOC";
    this.props.dispatch(getListUser());
  }

  componentDidUpdate(prevProps) {
    const { getListUserResult } = this.props;
    if (getListUserResult !== prevProps.getListUserResult) {
      this.setState({
        csvData: Object.values(getListUserResult),
      });
    }
  }

  render() {
    const { getListUserError, getListUserLoading, getListUserResult } =
      this.props;
    const { csvData, csvHeaders } = this.state;
    const nowDate = new Date().toLocaleString('id-ID')
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
                <CardTitle tag="h4">Tabel Data User</CardTitle>
                <CSVLink
                  data={csvData}
                  headers={csvHeaders}
                  filename={"Data User " + nowDate + ".csv"}
                  className="btn float-left full-btn"
                  style={{ backgroundColor: "#232531" }}
                >
                  <i className="nc-icon nc-cloud-download-93" /> Download Data
                </CSVLink>
              </CardHeader>
              <CardBody>
                {getListUserResult ? (
                  <table id="datatable" className="display" width="100%">
                    <thead className="text-primary">
                      <tr>
                        <th>Nama</th>
                        <th>Email</th>
                        <th>Nomor Telepon</th>
                        <th>Alamat</th>
                        <th>Detail Alamat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(getListUserResult).map((key) => (
                        <tr key={key}>
                          <td>
                            <label
                              style={{
                                fontSize: "14px",
                                width: "250px",
                              }}
                            >
                              {getListUserResult[key].nama}
                            </label>
                          </td>
                          <td>
                            <label
                              style={{
                                fontSize: "14px",
                                width: "250px",
                              }}
                            >
                              {getListUserResult[key].email}
                            </label>
                          </td>
                          <td>
                            <label
                              style={{
                                fontSize: "14px",
                                width: "130px",
                              }}
                            >
                              {getListUserResult[key].nomerHp}
                            </label>
                          </td>
                          <td>
                            <div
                              style={{
                                fontSize: "14px",
                                textAlign: "justify",
                                width: "230px",
                              }}
                            >
                              <a
                                href={
                                  "https://maps.google.com/?q=" +
                                  getListUserResult[key].latitude +
                                  "," +
                                  getListUserResult[key].longitude
                                }
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: "black" }}
                              >
                                {getListUserResult[key].alamat}
                              </a>
                            </div>
                          </td>
                          <td>
                            <label
                              style={{
                                fontSize: "14px",
                                textAlign: "justify",
                                width: "230px",
                              }}
                            >
                              {getListUserResult[key].detail_alamat}
                            </label>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="text-primary">
                      <tr>
                        <th>Nama</th>
                        <th>Email</th>
                        <th>Nomor Telepon</th>
                        <th>Alamat</th>
                        <th>Detail Alamat</th>
                      </tr>
                    </tfoot>
                  </table>
                ) : getListUserLoading ? (
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
                ) : getListUserError ? (
                  <div
                    style={{
                      justifyContent: "center",
                      display: "flex",
                      marginBottom: "100px",
                      marginTop: "70px",
                    }}
                  >
                    <label>{getListUserError}</label>
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
  getListUserLoading: state.UserReducer.getListUserLoading,
  getListUserResult: state.UserReducer.getListUserResult,
  getListUserError: state.UserReducer.getListUserError,
});

export default connect(mapStateToProps, null)(ListUser);
