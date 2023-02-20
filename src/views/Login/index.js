import { checkLogin } from "actions/AuthAction";
import { loginUser } from "actions/AuthAction";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import Swal from "sweetalert2";
import Logo from "../../assets/img/Logo.png";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };
  }

  componentDidMount() {
    this.props.dispatch(checkLogin(this.props.history));
  }

  //Dijalankan ketika nama Kategori diisi
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    const { email, password } = this.state;
    event.preventDefault();
    if (email && password) {
      //Masuk Action
      this.props.dispatch(loginUser(email, password));
    } else {
      Swal.fire({
        title: "Error",
        text: "Maaf, email dan password harus diisi!",
        icon: "error",
        confirmButtonColor: "#f69d93",
        confirmButtonText: "OK",
      });
    }
  };

  componentDidUpdate(prevProps) {
    const { loginResult, checkLoginResult } = this.props;

    if (checkLoginResult && prevProps.checkLoginResult !== checkLoginResult) {
      this.props.history.push("/admin/dashboard");
    }
    
    if (loginResult && prevProps.loginResult !== loginResult) {
      this.props.history.push("/admin/dashboard");
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'success',
        title: 'Signed in successfully!'
      })
    }
  }

  render() {
    const {loginLoading} = this.props;
    const { email, password } = this.state;
    return (
      <div className="h-100">
        <Row className="justify-content-center mt-5">
          <Col md="3" className="mt-5">
            <Card style={{ boxShadow: "0 4px 24px 10px rgba(4, 3, 3, 0.1)" }}>
              <CardHeader>
                <FormGroup>
                  <img
                    width="150"
                    src={Logo}
                    className="mx-auto d-block"
                    alt="Logo"
                    style={{
                      borderRadius: "1000px",
                      marginTop: "20px",
                      marginBottom: "20px",
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label
                    style={{
                      textAlign: "center",
                      fontSize: "20px",
                      display: "flow-root",
                      fontWeight: "lighter",
                    }}
                  >
                    Sistem Informasi Admin Bucket SOC
                  </Label>
                </FormGroup>
              </CardHeader>
              <CardBody>
                <form onSubmit={(event) => this.handleSubmit(event)}>
                  <FormGroup>
                    <Label style={{ fontSize: "13px" }} for="email">
                      Alamat Email
                    </Label>
                    <text style={{ color: "red" }}> *</text>
                    <Input
                      type="email"
                      name="email"
                      value={email}
                      placeholder="Masukkan Email"
                      onChange={(event) => this.handleChange(event)}
                    ></Input>
                  </FormGroup>
                  <FormGroup>
                    <Label style={{ fontSize: "13px" }} for="password">
                      Password
                    </Label>
                    <text style={{ color: "red" }}> *</text>
                    <Input
                      type="password"
                      name="password"
                      value={password}
                      placeholder="Masukkan Password"
                      onChange={(event) => this.handleChange(event)}
                    ></Input>
                  </FormGroup>
                  <FormGroup
                    style={{ justifyContent: "center", display: "flex" }}
                  >
                    {loginLoading ? (
                      <Button
                        style={{ alignSelf: "center" }}
                        color="primary"
                        type="submit"
                        disabled
                      >
                        <Spinner size="sm" color="light" /> Loading
                      </Button>
                    ) : (
                      <Button
                        style={{ alignSelf: "center" }}
                        color="primary"
                        type="submit"
                      >
                        Login
                      </Button>
                    )}
                  </FormGroup>
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
  loginLoading: state.AuthReducer.loginLoading,
  loginResult: state.AuthReducer.loginResult,
  loginError: state.AuthReducer.loginError,

  checkLoginLoading: state.AuthReducer.checkLoginLoading,
  checkLoginResult: state.AuthReducer.checkLoginResult,
  checkLoginError: state.AuthReducer.checkLoginError,
});

export default connect(mapStateToProps, null)(Login)
