import { getListKategori } from "actions/KategoriAction";
import { tambahProduk } from "actions/ProdukAction";
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

class TambahProduk extends Component {
  constructor(props) {
    super(props);
    //Deklarasi state atau variable awal
    this.state = {
      image1: DefaultImage,
      image2: DefaultImage,
      imageToDB1: false,
      imageToDB2: false,
      namaProduk: "",
      deskripsiProduk: "",
      harga: 0,
      ready: true,
      kategori: "",
    };
  }

  componentDidMount() {
    document.title = "Tambah Produk - Sistem Informasi Admin Bucket SOC";
    this.props.dispatch(getListKategori());
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
  handleImage1 = (event) => {
    //Jika event.target.files dan array ke 0nya bernilai true
    if (event.target.files && event.target.files[0]) {
      //Ukuran file maksimal 2MB
      if (event.target.files[0].size <= 2000000) {
        const gambar = event.target.files[0];
        this.setState({
          image1: URL.createObjectURL(gambar),
          imageToDB1: gambar,
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

  //Dijalankan ketika upload files
  handleImage2 = (event) => {
    //Jika event.target.files dan array ke 0nya bernilai true
    if (event.target.files && event.target.files[0]) {
      //Ukuran file maksimal 2MB
      if (event.target.files[0].size <= 2000000) {
        const gambar = event.target.files[0];
        this.setState({
          image2: URL.createObjectURL(gambar),
          imageToDB2: gambar,
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

  deleteImage1 = (event) => {
    event.preventDefault();
    this.setState({
      image1: DefaultImage,
      imageToDB1: false,
    });
  };

  deleteImage2 = (event) => {
    event.preventDefault();
    this.setState({
      image2: DefaultImage,
      imageToDB2: false,
    });
  };

  //Dijalankan ketika tombol submit di klik
  handleSubmit = (event) => {
    const {
      namaProduk,
      deskripsiProduk,
      imageToDB1,
      imageToDB2,
      harga,
      kategori,
    } = this.state;
    event.preventDefault();
    //Cek jika seluruh data sudah diisi kecuali gambar 2 dan ready tidak perlu dicek
    if (imageToDB1 && namaProduk && deskripsiProduk && harga && kategori) {
      //Cek jika gambar 1 sudah sesuai format
      if (
        imageToDB1.name.slice(-4) === ".png" ||
        imageToDB1.name.slice(-4) === ".jpg" ||
        imageToDB1.name.slice(-5) === ".jpeg"
      ) {
        //Cek apakah gambar 2 diupload
        if (imageToDB2.name) {
          //Cek apakah nama gambar 1 tidak sama dengan nama gambar 2
          if (imageToDB1.name !== imageToDB2.name) {
            //Cek apakah gambar 2 sudah sesuai format => masuk action
            if (
              imageToDB2.name.slice(-4) === ".png" ||
              imageToDB2.name.slice(-4) === ".jpg" ||
              imageToDB2.name.slice(-5) === ".jpeg"
            ) {
              this.props.dispatch(tambahProduk(this.state));
              //Jika gambar 2 tidak sesuai format
            } else {
              Swal.fire({
                title: "Error",
                text: "Maaf, gambar 2 harus dalam format .png, jpeg, atau .jpg!",
                icon: "error",
                confirmButtonColor: "#f69d93",
                confirmButtonText: "OK",
              });
            }
            //Jika nama gambar 1 dan 2 sama
          } else {
            Swal.fire({
              title: "Error",
              text: "Maaf, nama gambar 1 dan 2 tidak boleh sama !",
              icon: "error",
              confirmButtonColor: "#f69d93",
              confirmButtonText: "OK",
            });
          }
          //Jika gambar 2 tidak terupload => masuk action
        } else {
          this.props.dispatch(tambahProduk(this.state));
        }
        //Jika gambar 1 tidak sesuai format
      } else {
        Swal.fire({
          title: "Error",
          text: "Maaf, gambar 1 harus dalam format .png, jpeg, atau .jpg!",
          icon: "error",
          confirmButtonColor: "#f69d93",
          confirmButtonText: "OK",
        });
      }
      //Jika ada data yang masih belum diisi
    } else {
      Swal.fire({
        title: "Error",
        text: "Maaf, seluruh data bertanda bintang harus diisi!",
        icon: "error",
        confirmButtonColor: "#f69d93",
        confirmButtonText: "OK",
      });
    }
  };

  //Jika proses tambah Banner ke firebse database berhasil
  componentDidUpdate(prevProps) {
    const { tambahProdukResult } = this.props;

    if (
      tambahProdukResult &&
      prevProps.tambahProdukResult !== tambahProdukResult
    ) {
      Swal.fire({
        title: "Sukses",
        text: "Produk Sukses Ditambahkan!",
        icon: "success",
        confirmButtonColor: "#f69d93",
        confirmButtonText: "OK",
      });
      this.props.history.push("/admin/produk");
    }
  }

  render() {
    const {
      image1,
      image2,
      namaProduk,
      deskripsiProduk,
      harga,
      ready,
      kategori,
    } = this.state;
    const { tambahProdukLoading, getListKategoriResult } = this.props;
    return (
      <div className="content">
        <Row>
          <Col>
            <Link to="/admin/produk" className="btn btn-primary">
              <i className="nc-icon nc-minimal-left" /> Kembali
            </Link>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Tambah Produk</CardTitle>
              </CardHeader>
              <CardBody>
                <div>
                  <Col md={5}>
                    <Row>
                      <Col>
                        <img
                          src={image1}
                          width="200"
                          height="200"
                          alt="Gambar 1"
                        />
                        <FormGroup>
                          <label>Gambar 1</label>
                          <label style={{ color: "red" }}> &nbsp;*</label>
                          {image1 !== DefaultImage ? (
                            <FormGroup>
                              <a href="/" onClick={this.deleteImage1}>
                                Hapus
                              </a>
                            </FormGroup>
                          ) : null}
                          <Input
                            type="file"
                            name="image1"
                            onChange={(event) => this.handleImage1(event)}
                          />
                        </FormGroup>
                      </Col>
                      <Col>
                        <img
                          src={image2}
                          width="200"
                          height="200"
                          alt="Gambar 2"
                        />
                        <FormGroup>
                          <label>Gambar 2</label>
                          {image2 !== DefaultImage ? (
                            <FormGroup>
                              <a href="/" onClick={this.deleteImage2}>
                                Hapus
                              </a>
                            </FormGroup>
                          ) : null}
                          <Input
                            type="file"
                            name="image2"
                            onChange={(event) => this.handleImage2(event)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Col>
                  <Col>
                    <Label style={{ color: "red", textAlign: "justify" }}>
                      Gambar harus dalam format .png, .jpeg, atau .jpg (ukuran
                      ideal: 500 x 500 pixel). Ukuran file maksimal adalah 2MB.
                    </Label>
                  </Col>
                  <Col md={10}>
                    <FormGroup>
                      <label>Nama Produk</label>
                      <label style={{ color: "red" }}> &nbsp;*</label>
                      <Input
                        type="text"
                        value={namaProduk}
                        name="namaProduk"
                        onChange={(event) => this.handleChange(event)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Kategori</label>
                      <label style={{ color: "red" }}> &nbsp;*</label>
                      <Input
                        type="select"
                        name="kategori"
                        value={kategori}
                        onChange={(event) => this.handleChange(event)}
                      >
                        <option value="">-- Pilih Kategori --</option>
                        {Object.keys(getListKategoriResult).map((key) => (
                          <option value={key} key={key}>
                            {getListKategoriResult[key].nama}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <label>Harga (Rp.)</label>
                      <label style={{ color: "red" }}> &nbsp;*</label>
                      <Input
                        type="number"
                        min={0}
                        value={harga}
                        name="harga"
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        onChange={(event) => this.handleChange(event)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Status</label>
                      <label style={{ color: "red" }}> &nbsp;*</label>
                      <Input
                        type="select"
                        name="ready"
                        value={ready}
                        onChange={(event) => this.handleChange(event)}
                      >
                        <option value={true}>Aktif</option>
                        <option value={false}>Tidak Aktif</option>
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <label>Deskripsi Produk</label>
                      <label style={{ color: "red" }}> &nbsp;*</label>
                      <Input
                        type="textarea"
                        style={{
                          maxHeight: 2000,
                          resize: "inherit",
                          height: 300,
                        }}
                        value={deskripsiProduk}
                        name="deskripsiProduk"
                        onChange={(event) => this.handleChange(event)}
                      />
                    </FormGroup>
                  </Col>
                </div>
                <form onSubmit={(event) => this.handleSubmit(event)}>
                  <Row>
                    <Col>
                      {tambahProdukLoading ? (
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
  tambahProdukLoading: state.ProdukReducer.tambahProdukLoading,
  tambahProdukResult: state.ProdukReducer.tambahProdukResult,
  tambahProdukError: state.ProdukReducer.tambahProdukError,

  getListKategoriLoading: state.KategoriReducer.getListKategoriLoading,
  getListKategoriResult: state.KategoriReducer.getListKategoriResult,
  getListKategoriError: state.KategoriReducer.getListKategoriError,
});

export default connect(mapStateToProps, null)(TambahProduk);
