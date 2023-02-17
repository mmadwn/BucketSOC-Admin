import { tambahKategori } from "actions/KategoriAction";
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

class TambahKategori extends Component {
  constructor(props) {
    super(props);
    //Deklarasi state atau variable awal
    this.state = {
      image: DefaultImage,
      imageToDB: false,
      namaKategori: "",
    };
  }

  //Dijalankan ketika nama Kategori diisi
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  //Dijalankan ketika upload files
  handleImage = (event) => {
    //Jika event.target.files dan array ke 0nya bernilai true
    if (event.target.files && event.target.files[0]) {
      //Ukuran file maksimal 100KB
      if (event.target.files[0].size <= 100000) {
        const gambar = event.target.files[0];
        this.setState({
          image: URL.createObjectURL(gambar),
          imageToDB: gambar,
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Maaf, ukuran file maksimal adalah 100KB!",
          icon: "error",
          confirmButtonColor: "#f69d93",
          confirmButtonText: "OK",
        });
      }
    }
  };

  //Dijalankan ketika tombol submit di klik
  handleSubmit = (event) => {
    const { namaKategori, imageToDB } = this.state;
    event.preventDefault();
    if (imageToDB && namaKategori) {
      if (imageToDB.name.slice(-4) === ".svg") {
        this.props.dispatch(tambahKategori(this.state));
      } else {
        Swal.fire({
          title: "Error",
          text: "Maaf, gambar harus dalam format .svg !",
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

  //Jika proses tambah kategori ke firebse database berhasil
  componentDidUpdate(prevProps) {
    const { tambahKategoriResult } = this.props;

    if (
      tambahKategoriResult &&
      prevProps.tambahKategoriResult !== tambahKategoriResult
    ) {
      Swal.fire({
        title: "Sukses",
        text: "Kategori Sukses Ditambahkan!",
        icon: "success",
        confirmButtonColor: "#f69d93",
        confirmButtonText: "OK",
      });
      this.props.history.push("/admin/kategori");
    }
  }

  render() {
    const { image, namaKategori } = this.state;
    const { tambahKategoriLoading } = this.props;
    return (
      <div className="content">
        <Row>
          <Col>
            <Link to="/admin/kategori" className="btn btn-primary">
              <i className="nc-icon nc-minimal-left" /> Kembali
            </Link>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Tambah Kategori</CardTitle>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col>
                    <img src={image} width="200" alt="Logo Kategori" />
                  </Col>
                </Row>
                <form onSubmit={(event) => this.handleSubmit(event)}>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <label>Logo Kategori</label>
                        <text style={{ color: "red" }}> *</text>
                        <Input
                          type="file"
                          onChange={(event) => this.handleImage(event)}
                        />
                        <Label style={{ color: "red" }}>
                          Gambar harus dalam format .svg (ukuran ideal: 57 x 57
                          pixel). Ukuran file maksimal adalah 100KB.
                        </Label>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <label>Nama Kategori</label>
                        <text style={{ color: "red" }}> *</text>
                        <Input
                          type="text"
                          value={namaKategori}
                          name="namaKategori"
                          onChange={(event) => this.handleChange(event)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      {tambahKategoriLoading ? (
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
  tambahKategoriLoading: state.KategoriReducer.tambahKategoriLoading,
  tambahKategoriResult: state.KategoriReducer.tambahKategoriResult,
  tambahKategoriError: state.KategoriReducer.tambahKategoriError,
});

export default connect(mapStateToProps, null)(TambahKategori);
