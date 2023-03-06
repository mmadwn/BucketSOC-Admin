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
import DefaultImage from "../../assets/img/default-image.jpg";
import Swal from "sweetalert2";
import { getDetailProfile } from "actions/ProfileAction";
import { updateProfile } from "actions/ProfileAction";

class EditProfile extends Component {
  constructor(props) {
    super(props);
    //Deklarasi state atau variable awal
    this.state = {
      uid: this.props.match.params.id,
      imageLama: DefaultImage,
      image: DefaultImage,
      imageToDB: false,
      nama: "",
      email: "",
      nomerHp: "",
      alamat: "",
      detail_alamat: "",
      latitude: "",
      longitude: "",
    };
  }

  componentDidMount() {
    document.title = "Edit Profile - Sistem Informasi Admin Bucket SOC";
    this.props.dispatch(getDetailProfile(this.props.match.params.id));
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
  handleImage = async (event) => {
    //Jika event.target.files dan array ke 0nya bernilai true
    if (event.target.files && event.target.files[0]) {
      //Ukuran file maksimal 2MB
      if (event.target.files[0].size <= 2000000) {
        const gambar = event.target.files[0];
        const base64 = await this.convertBase64(gambar);
        this.setState({
          image: URL.createObjectURL(gambar),
          imageToDB: base64,
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

  convertBase64 = (gambar) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(gambar);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  deleteImage = (event) => {
    event.preventDefault();
    this.setState({
      image: DefaultImage,
      imageToDB: false,
      imageLama: false,
    });
  };

  convertPhoneNumber(phoneNumber) {
  // cek apakah nomor telepon diawali dengan "08"
  if (phoneNumber.startsWith('08')) {
    // ganti "08" dengan "628"
    phoneNumber = '628' + phoneNumber.substr(2);
  }
  return phoneNumber;
}

  //Dijalankan ketika tombol submit di klik
  handleSubmit = (event) => {
    const {
      uid,
      nama,
      imageToDB,
      imageLama,
      email,
      nomerHp,
      alamat,
      detail_alamat,
      latitude,
      longitude,
    } = this.state;
    const data = {
      uid: uid,
      avatar: imageToDB ? imageToDB : imageLama ? imageLama : "",
      nama: nama,
      email: email,
      nomerHp: this.convertPhoneNumber(nomerHp),
      alamat: alamat,
      detail_alamat: detail_alamat,
      latitude: Number(latitude),
      longitude: Number(longitude),
    };
    event.preventDefault();
    if (nama && email && nomerHp && alamat && detail_alamat && latitude && longitude) {
      if (imageToDB) {
        let imagePath = imageToDB.replace("data:image/", "");
        const indexOfEndPath = imagePath.indexOf(";");
        imagePath = imagePath.substring(0, indexOfEndPath);
        if (
          imagePath === "png" ||
          imagePath === "jpg" ||
          imagePath === "jpeg"
        ) {
          this.props.dispatch(updateProfile(data));
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
        this.props.dispatch(updateProfile(data));
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
    const { updateProfileResult, getDetailProfileResult } = this.props;

    if (
      updateProfileResult &&
      prevProps.updateProfileResult !== updateProfileResult
    ) {
      //jika nilainya true && nilai sebelumnya tidak sama dengan yang baru
      Swal.fire({
        title: "Sukses",
        text: "Profile Sukses Diupdate!",
        icon: "success",
        confirmButtonColor: "#f69d93",
        confirmButtonText: "OK",
      });
      this.props.history.push("/admin/dashboard");
    }

    if (
      getDetailProfileResult &&
      prevProps.getDetailProfileResult !== getDetailProfileResult
    ) {
      this.setState({
        image: getDetailProfileResult.avatar
          ? getDetailProfileResult.avatar
          : DefaultImage,
        imageLama: getDetailProfileResult.avatar
          ? getDetailProfileResult.avatar
          : null,
        nama: getDetailProfileResult.nama,
        email: getDetailProfileResult.email,
        nomerHp: getDetailProfileResult.nomerHp,
        alamat: getDetailProfileResult.alamat,
        detail_alamat: getDetailProfileResult.detail_alamat,
        latitude: getDetailProfileResult.latitude,
        longitude: getDetailProfileResult.longitude,
      });
    }
  }

  render() {
    const {
      nama,
      image,
      email,
      nomerHp,
      alamat,
      detail_alamat,
      latitude,
      longitude,
    } = this.state;
    const { updateProfileLoading } = this.props;
    return (
      <div className="content">
        <Row>
          <Col>
            <Link to="/admin/dashboard" className="btn btn-primary">
              <i className="nc-icon nc-minimal-left" /> Kembali
            </Link>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Edit Profile</CardTitle>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md={10}>
                    <img src={image} width="200" alt="Banner" />
                    <FormGroup>
                      <label>Foto Profile</label>
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
                        ideal: 500 x 500 pixel). Ukuran file maksimal adalah
                        2MB.
                      </Label>
                    </FormGroup>
                    <FormGroup>
                      <label>Nama</label>
                      <label style={{ color: "red" }}> &nbsp;*</label>
                      <Input
                        type="text"
                        value={nama}
                        name="nama"
                        onChange={(event) => this.handleChange(event)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Email</label>
                      <label style={{ color: "red" }}> &nbsp;*</label>
                      <Input
                        type="text"
                        value={email}
                        disabled
                        name="email"
                        onChange={(event) => this.handleChange(event)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Nomor Telepon</label>
                      <label style={{ color: "red" }}> &nbsp;*</label>
                      <Input
                        type="number"
                        min={0}
                        value={nomerHp}
                        name="nomerHp"
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        onChange={(event) => this.handleChange(event)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Alamat</label>
                      <label style={{ color: "red" }}> &nbsp;*</label>
                      <Input
                        type="textarea"
                        style={{
                          maxHeight: 1000,
                          resize: "inherit",
                          height: 100,
                        }}
                        value={alamat}
                        name="alamat"
                        onChange={(event) => this.handleChange(event)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Detail Alamat</label>
                      <label style={{ color: "red" }}> &nbsp;*</label>
                      <Input
                        type="textarea"
                        style={{
                          maxHeight: 1000,
                          resize: "inherit",
                          height: 100,
                        }}
                        value={detail_alamat}
                        name="detail_alamat"
                        onChange={(event) => this.handleChange(event)}
                      />
                    </FormGroup>
                    <Row>
                      <Col>
                        <FormGroup>
                          <label>Latitude</label>
                          <label style={{ color: "red" }}> &nbsp;*</label>
                          <Input
                            type="number"
                            value={latitude}
                            name="latitude"
                            onChange={(event) => this.handleChange(event)}
                          />
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <label>Longitude</label>
                          <label style={{ color: "red" }}> &nbsp;*</label>
                          <Input
                            min={0}
                            value={longitude}
                            name="longitude"
                            onChange={(event) => this.handleChange(event)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    {email === "soc.bucket@gmail.com" ? (
                      <FormGroup>
                        <Label style={{ color: "red", textAlign: "justify" }}>
                          Pastikan alamat, latitude, dan longitude sudah sesuai.
                          Karena akan digunakan sebagai titik alamat toko /
                          pengiriman.
                        </Label>
                      </FormGroup>
                    ) : null}
                  </Col>
                </Row>
                <form onSubmit={(event) => this.handleSubmit(event)}>
                  <Row>
                    <Col>
                      {updateProfileLoading ? (
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
  getDetailProfileLoading: state.ProfileReducer.getDetailProfileLoading,
  getDetailProfileResult: state.ProfileReducer.getDetailProfileResult,
  getDetailProfileError: state.ProfileReducer.getDetailProfileError,

  updateProfileLoading: state.ProfileReducer.updateProfileLoading,
  updateProfileResult: state.ProfileReducer.updateProfileResult,
  updateProfileError: state.ProfileReducer.updateProfileError,
});

export default connect(mapStateToProps, null)(EditProfile);
