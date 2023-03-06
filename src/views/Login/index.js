import { checkLogin } from "actions/AuthAction";
import { loginUser } from "actions/AuthAction";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FormGroup,
  Input,
  Label,
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
    document.title = "Login - Sistem Informasi Admin Bucket SOC";
    this.props.dispatch(checkLogin(this.props.history));
    //Jika sudah login, redirect ke dashboard
    if (window.localStorage.getItem("user")) {
      this.props.history.push({ pathname: "/admin/dashboard" });
    }
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
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "success",
        title: "Signed in successfully!",
      });
    }
  }

  render() {
    const { loginLoading } = this.props;
    const { email, password } = this.state;
    return (
      <div className="h-100">
        <div className="authentication h-100">
          <div className="container-fluid h-100">
            <div
              className="row justify-content-center h-100 align-items-center"
              style={{ backgroundColor: "#fffbfa" }}
            >
              <div className="col-md-6" style={{ maxWidth: "450px" }}>
                <Card
                  style={{
                    boxShadow: "0 4px 24px 10px rgba(4, 3, 3, 0.1)",
                  }}
                >
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
                          marginBottom: "30px",
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
                      <FormGroup
                        style={{ marginLeft: "10px", marginRight: "10px" }}
                      >
                        <Label style={{ fontSize: "13px" }} for="email">
                          Email
                        </Label>
                        <label style={{ color: "red" }}> &nbsp;*</label>
                        <Input
                          type="email"
                          name="email"
                          value={email}
                          placeholder="Masukkan Email"
                          onChange={(event) => this.handleChange(event)}
                        ></Input>
                      </FormGroup>
                      <FormGroup
                        style={{
                          marginTop: "10px",
                          marginLeft: "10px",
                          marginRight: "10px",
                          marginBottom: "20px",
                        }}
                      >
                        <Label style={{ fontSize: "13px" }} for="password">
                          Password
                        </Label>
                        <label style={{ color: "red" }}> &nbsp;*</label>
                        <Input
                          type="password"
                          name="password"
                          value={password}
                          placeholder="Masukkan Password"
                          onChange={(event) => this.handleChange(event)}
                        ></Input>
                      </FormGroup>
                      <FormGroup
                        style={{
                          justifyContent: "center",
                          display: "flex",
                        }}
                      >
                        {loginLoading ? (
                          <Button
                            style={{
                              alignSelf: "center",
                              height: "45px",
                              borderRadius: "7px",
                              boxShadow: "rgb(255, 176, 168) 0px 0px 10px 1px",
                              width: "100%",
                              marginLeft: "8px",
                              marginRight: "8px",
                              fontSize: "14px",
                            }}
                            color="primary"
                            type="submit"
                            disabled
                          >
                            <Spinner size="sm" color="light" /> Loading
                          </Button>
                        ) : (
                          <Button
                            style={{
                              alignSelf: "center",
                              height: "45px",
                              borderRadius: "7px",
                              boxShadow: "rgb(255, 176, 168) 0px 0px 10px 1px",
                              width: "100%",
                              marginLeft: "8px",
                              marginRight: "8px",
                              fontSize: "14px",
                            }}
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
              </div>
            </div>
          </div>
        </div>
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

export default connect(mapStateToProps, null)(Login);
