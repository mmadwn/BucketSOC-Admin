import React, { Component } from "react";
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Switch, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { checkLogin } from "actions/AuthAction";

import DemoNavbar from "components/Navbars/DemoNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import routes from "routes.js";
import { Spinner } from "reactstrap";

let ps;

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: "black",
      activeColor: "info",
    };
    this.mainPanel = React.createRef();
  }

  componentDidMount() {
    const { mainPanel } = this;
    const { location, dispatch, history } = this.props;

    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current);
      document.body.classList.toggle("perfect-scrollbar-on");
    }

    if (!window.localStorage.getItem("user")) {
      history.push({ pathname: "/login" });
    }

    dispatch(checkLogin(history));

    mainPanel.current.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }

  //Jika proses tambah Banner ke firebse database berhasil
  componentDidUpdate(prevProps) {
    const { checkLoginResult } = this.props;
    if (checkLoginResult && prevProps.checkLoginResult !== checkLoginResult) {
      this.setState({
        login: true,
      });
    }
  }

  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
      document.body.classList.toggle("perfect-scrollbar-on");
    }
  }

  handleActiveClick = (color) => {
    this.setState({ activeColor: color });
  };

  handleBgClick = (color) => {
    this.setState({ backgroundColor: color });
  };

  render() {
    const { backgroundColor, activeColor } = this.state;
    const { history, checkLoginLoading, checkLoginResult } = this.props;

    return (
      <div className="wrapper">
        <Sidebar
          {...this.props}
          routes={routes}
          bgColor={backgroundColor}
          activeColor={activeColor}
        />
        <div className="main-panel" ref={this.mainPanel}>
          <DemoNavbar {...this.props} />
          {checkLoginResult ? (
            <>
              <Switch>
                {routes.map((prop, key) => {
                  return (
                    <Route
                      path={prop.layout + prop.path}
                      component={prop.component}
                      key={key}
                      exact
                    />
                  );
                })}
              </Switch>
              <Footer fluid />
            </>
          ) : checkLoginLoading ? (
            <div
              style={{
                justifyContent: "center",
                display: "flex",
                height: "100%",
              }}
            >
              <Spinner color="primary" style={{ alignSelf: "center" }} />
            </div>
          ) : null}
        </div>
        <FixedPlugin
          bgColor={backgroundColor}
          activeColor={activeColor}
          handleActiveClick={this.handleActiveClick}
          handleBgClick={this.handleBgClick}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  checkLoginLoading: state.AuthReducer.checkLoginLoading,
  checkLoginResult: state.AuthReducer.checkLoginResult,
  checkLoginError: state.AuthReducer.checkLoginError,
});

export default connect(mapStateToProps, null)(Dashboard);
