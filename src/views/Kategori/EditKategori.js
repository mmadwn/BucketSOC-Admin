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
import { updateKategori, getDetailKategori } from "actions/KategoriAction";
import DefaultImage from "../../assets/img/default-image.jpg";
import Swal from "sweetalert2";

class EditKategori extends Component {
  constructor(props) {
    super(props);
    //Deklarasi state atau variable awal
    this.state = {
      id: this.props.match.params.id,
      imageLama: DefaultImage,
      image: DefaultImage,
      imageToDB: false,
      namaKategori: "",
    };
  }

  componentDidMount() {
    this.props.dispatch(getDetailKategori(this.props.match.params.id));
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

  deleteImage = (event) => {
    event.preventDefault();
    this.setState({
      image: DefaultImage,
      imageToDB: false,
    });
  };

  //Dijalankan ketika tombol submit di klik
  handleSubmit = (event) => {
    const { namaKategori, imageToDB, image } = this.state;
    event.preventDefault();
    if (namaKategori && image !== DefaultImage) {
      if (imageToDB) {
        if (imageToDB.name.slice(-4) === ".svg") {
          this.props.dispatch(updateKategori(this.state));
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
        this.props.dispatch(updateKategori(this.state));
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
    const { updateKategoriResult, getDetailKategoriResult } = this.props;

    if (
      updateKategoriResult &&
      prevProps.updateKategoriResult !== updateKategoriResult
    ) {
      Swal.fire({
        title: "Sukses",
        text: "Kategori Sukses Diupdate!",
        icon: "success",
        confirmButtonColor: "#f69d93",
        confirmButtonText: "OK",
      });
      this.props.history.push("/admin/kategori");
    }

    if (
      getDetailKategoriResult &&
      prevProps.getDetailKategoriResult !== getDetailKategoriResult
    ) {
      this.setState({
        image: getDetailKategoriResult.gambar,
        namaKategori: getDetailKategoriResult.nama,
        imageLama: getDetailKategoriResult.gambar,
      });
    }
  }

  render() {
    const { image, namaKategori } = this.state;
    const { updateKategoriLoading } = this.props;
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
                <CardTitle tag="h4">Edit Kategori</CardTitle>
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
                        {image !== DefaultImage ? (
                          <FormGroup>
                            <a href="/" onClick={this.deleteImage}>
                              Hapus
                            </a>
                          </FormGroup>
                        ) : null}
                        <Input
                          type="file"
                          onChange={(event) => this.handleImage(event)}
                        />
                        <Label style={{ color: "red", textAlign: "justify" }}>
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
                      {updateKategoriLoading ? (
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
  updateKategoriLoading: state.KategoriReducer.updateKategoriLoading,
  updateKategoriResult: state.KategoriReducer.updateKategoriResult,
  updateKategoriError: state.KategoriReducer.updateKategoriError,

  getDetailKategoriLoading: state.KategoriReducer.getDetailKategoriLoading,
  getDetailKategoriResult: state.KategoriReducer.getDetailKategoriResult,
  getDetailKategoriError: state.KategoriReducer.getDetailKategoriError,
});

export default connect(mapStateToProps, null)(EditKategori);
