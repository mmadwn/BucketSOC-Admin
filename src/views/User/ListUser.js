import React, { Component } from "react";
import { connect } from "react-redux";
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
import $ from "jquery";
import { getListUser } from "actions/UserAction";

class ListUser extends Component {
  componentDidMount() {
    this.props.dispatch(getListUser());
  }

  render() {
    const { getListUserError, getListUserLoading, getListUserResult } =
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
                <CardTitle tag="h4">Tabel Data User</CardTitle>
                <Button
                  style={{ backgroundColor: "#232531" }}
                  className="btn float-left"
                >
                  <i className="nc-icon nc-cloud-download-93" /> Download Data
                </Button>
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
