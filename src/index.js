import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import store from "reducers/store";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.3.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "jquery/dist/jquery.min.js";

//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"

import AdminLayout from "layouts/Admin.js";
import { Login } from "views";

const root = ReactDOM.createRoot(document.getElementById("root"));
let user = window.localStorage.getItem("user");

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
        <Route path="/login" component={Login} exact />
        {user !== null ? (
          <Redirect to="/admin/dashboard" />
        ) : (
          <Redirect to="/login" />
        )}
      </Switch>
    </BrowserRouter>
  </Provider>
);
