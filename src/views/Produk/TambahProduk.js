import { tambahBanner } from "actions/BannerAction";
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
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import Swal from "sweetalert2";

import DefaultImage from "../../assets/img/default-image.jpg";

class tambahProduk extends Component {
  constructor(props) {
    super(props);
    //Deklarasi state atau variable awal
    this.state = {
      image: DefaultImage,
      imageToDB: false,
      judulBanner: "",
      deskripsiBanner: "",
      active: true,
    };
  }

  handleChange = (event) => {
    let updatedValue = event.target.value;
    if (updatedValue === "true" || updatedValue === "false") {
      updatedValue = JSON.parse(updatedValue);
    }
    this.setState({
      [event.target.name]: updatedValue,
    });
  };

  //Dijalankan ketika upload files
  handleImage = (event) => {
    //Jika event.target.files dan array ke 0nya bernilai true
    if (event.target.files && event.target.files[0]) {
      console.log(event);
      //Ukuran file maksimal 2MB
      if (event.target.files[0].size <= 2000000) {
        const gambar = event.target.files[0];
        this.setState({
          image: URL.createObjectURL(gambar),
          imageToDB: gambar,
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Maaf, ukuran file maksimal adalah 2MB!",
          icon: "error",
          confirmButtonColor: "#f69d93",
          confirmButtonText: "OK",
        });
      }
    }
  };

  //Dijalankan ketika tombol submit di klik
  handleSubmit = (event) => {
    const { judulBanner, deskripsiBanner, imageToDB } = this.state;
    event.preventDefault();
    if (imageToDB && judulBanner && deskripsiBanner) {
      if (
        imageToDB.name.slice(-4) === ".png" ||
        imageToDB.name.slice(-4) === ".jpg" ||
        imageToDB.name.slice(-5) === ".jpeg"
      ) {
        this.props.dispatch(tambahBanner(this.state));
      } else {
        Swal.fire({
          title: "Error",
          text: "Maaf, gambar harus dalam format .png, jpeg, atau .jpg !",
          icon: "error",
          confirmButtonColor: "#f69d93",
          confirmButtonText: "OK",
        });
      }
    } else {
      Swal.fire({
        title: "Error",
        text: "Maaf, seluruh data harus diisi!",
        icon: "error",
        confirmButtonColor: "#f69d93",
        confirmButtonText: "OK",
      });
    }
  };

  //Jika proses tambah Banner ke firebse database berhasil
  componentDidUpdate(prevProps) {
    const { tambahBannerResult } = this.props;

    if (
      tambahBannerResult &&
      prevProps.tambahBannerResult !== tambahBannerResult
    ) {
      Swal.fire({
        title: "Sukses",
        text: "Banner Sukses Ditambahkan!",
        icon: "success",
        confirmButtonColor: "#f69d93",
        confirmButtonText: "OK",
      });
      this.props.history.push("/admin/banner");
    }
  }

  render() {
    const { image, judulBanner, deskripsiBanner, active } = this.state;
    const { tambahBannerLoading } = this.props;
    return (
      <div className="content">
        <Row>
          <Col>
            <Link to="/admin/banner" className="btn btn-primary">
              <i className="nc-icon nc-minimal-left" /> Kembali
            </Link>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Tambah Banner</CardTitle>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md={10}>
                    <img src={image} width="200" alt="Banner" />
                    <FormGroup>
                      <label>Gambar Banner</label>
                      <Input
                        type="file"
                        onChange={(event) => this.handleImage(event)}
                      />
                      <Label style={{ color: "red" }}>
                        Gambar harus dalam format .png, .jpeg, atau .jpg (ukuran
                        ideal: 1958 x 725 pixel). Ukuran file maksimal adalah
                        2MB.
                      </Label>
                    </FormGroup>
                    <FormGroup>
                      <label>Judul Banner</label>
                      <Input
                        type="text"
                        value={judulBanner}
                        name="judulBanner"
                        onChange={(event) => this.handleChange(event)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Status</label>
                      <Input
                        type="select"
                        name="active"
                        value={active}
                        onChange={(event) => this.handleChange(event)}
                      >
                        <option value={true}>Aktif</option>
                        <option value={false}>Tidak Aktif</option>
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <label>Deskripsi Banner</label>
                      <Input
                        type="textarea"
                        style={{
                          maxHeight: 2000,
                          resize: "inherit",
                          height: 300,
                        }}
                        value={deskripsiBanner}
                        name="deskripsiBanner"
                        onChange={(event) => this.handleChange(event)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <form onSubmit={(event) => this.handleSubmit(event)}>
                  <Row>
                    <Col md={6}>
                      <FormGroup></FormGroup>
                    </Col>
                    <Col md={3}></Col>
                  </Row>
                  <Row>
                    <Col>
                      {tambahBannerLoading ? (
                        <Button color="primary" type="submit" disabled>
                          <Spinner size="sm" color="light" /> Loading
                        </Button>
                      ) : (
                        <Button color="primary" type="submit">
                          Submit
                        </Button>
                      )}
                    </Col>
                  </Row>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tambahBannerLoading: state.BannerReducer.tambahBannerLoading,
  tambahBannerResult: state.BannerReducer.tambahBannerResult,
  tambahBannerError: state.BannerReducer.tambahBannerError,
});

export default connect(mapStateToProps, null)(tambahProduk);
