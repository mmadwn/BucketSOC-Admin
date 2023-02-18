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
import { updateBanner, getDetailBanner } from "actions/BannerAction";
import DefaultImage from "../../assets/img/default-image.jpg";
import Swal from "sweetalert2";

class EditBanner extends Component {
  constructor(props) {
    super(props);
    //Deklarasi state atau variable awal
    this.state = {
      id: this.props.match.params.id,
      imageLama: DefaultImage,
      image: DefaultImage,
      imageToDB: false,
      judulBanner: "",
      deskripsiBanner: "",
      active: true,
    };
  }

  componentDidMount() {
    this.props.dispatch(getDetailBanner(this.props.match.params.id));
  }

  //Dijalankan ketika nama Banner diisi
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

  deleteImage = (event) => {
    event.preventDefault();
    this.setState({
      image: DefaultImage,
      imageToDB: false,
    });
  };

  //Dijalankan ketika tombol submit di klik
  handleSubmit = (event) => {
    const { judulBanner, deskripsiBanner, image, imageToDB } = this.state;
    event.preventDefault();
    if (judulBanner && deskripsiBanner && image !== DefaultImage) {
      if (imageToDB) {
        if (
          imageToDB.name.slice(-4) === ".png" ||
          imageToDB.name.slice(-4) === ".jpg" ||
          imageToDB.name.slice(-5) === ".jpeg"
        ) {
          this.props.dispatch(updateBanner(this.state));
        } else {
          Swal.fire({
            title: "Error",
            text: "Maaf, gambar harus dalam format .png, .jpeg, atau .jpg !",
            icon: "error",
            confirmButtonColor: "#f69d93",
            confirmButtonText: "OK",
          });
        }
      } else {
        this.props.dispatch(updateBanner(this.state));
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

  //Jika proses tambah banner ke firebse database berhasil
  componentDidUpdate(prevProps) {
    const { updateBannerResult, getDetailBannerResult } = this.props;

    if (
      updateBannerResult &&
      prevProps.updateBannerResult !== updateBannerResult
    ) {
      Swal.fire({
        title: "Sukses",
        text: "Banner Sukses Diupdate!",
        icon: "success",
        confirmButtonColor: "#f69d93",
        confirmButtonText: "OK",
      });
      this.props.history.push("/admin/banner");
    }

    if (
      getDetailBannerResult &&
      prevProps.getDetailBannerResult !== getDetailBannerResult
    ) {
      this.setState({
        image: getDetailBannerResult.gambar,
        judulBanner: getDetailBannerResult.title,
        deskripsiBanner: getDetailBannerResult.deskripsi,
        active: getDetailBannerResult.active,
        imageLama: getDetailBannerResult.gambar,
      });
    }
  }

  render() {
    const { image, judulBanner, deskripsiBanner, active } = this.state;
    const { updateBannerLoading } = this.props;
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
                <CardTitle tag="h4">Edit Banner</CardTitle>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md={10}>
                    <img src={image} width="200" alt="Banner" />
                    <FormGroup>
                      <label>Gambar Banner</label>
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
                        Gambar harus dalam format .png, .jpeg, atau .jpg (ukuran
                        ideal: 1958 x 725 pixel). Ukuran file maksimal adalah
                        2MB.
                      </Label>
                    </FormGroup>
                    <FormGroup>
                      <label>Judul Banner</label>
                      <text style={{ color: "red" }}> *</text>
                      <Input
                        type="text"
                        value={judulBanner}
                        name="judulBanner"
                        onChange={(event) => this.handleChange(event)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Status</label>
                      <text style={{ color: "red" }}> *</text>
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
                      <text style={{ color: "red" }}> *</text>
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
                    <Col>
                      {updateBannerLoading ? (
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
  updateBannerLoading: state.BannerReducer.updateBannerLoading,
  updateBannerResult: state.BannerReducer.updateBannerResult,
  updateBannerError: state.BannerReducer.updateBannerError,

  getDetailBannerLoading: state.BannerReducer.getDetailBannerLoading,
  getDetailBannerResult: state.BannerReducer.getDetailBannerResult,
  getDetailBannerError: state.BannerReducer.getDetailBannerError,
});

export default connect(mapStateToProps, null)(EditBanner);
