import { db } from "config/FIREBASE";
import { onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
} from "reactstrap";
import Swal from "sweetalert2";
import { BiShoppingBag } from "react-icons/bi";
import { FaMoneyBill } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import { HiUsers } from "react-icons/hi";
import { BsImage } from "react-icons/bs";
import { RxDashboard } from "react-icons/rx";

function Dashboard() {
  const [chartLabelsPesanan, setChartLabelsPesanan] = useState([]);
  const [chartDataPesanan, setChartDataPesanan] = useState([]);
  const [chartLabelsPendapatan, setChartLabelsPendapatan] = useState([]);
  const [chartDataPendapatan, setChartDataPendapatan] = useState([]);
  const [chartDataStatus, setChartDataStatus] = useState([]);
  const [chartLabelsStatus, setChartLabelsStatus] = useState([]);
  const [totalPesanan, setTotalPesanan] = useState(0);
  const [totalPendapatan, setTotalPendapatan] = useState(0);
  const [totalKategori, setTotalKategori] = useState(0);
  const [totalProduk, setTotalProduk] = useState(0);
  const [totalBanner, setTotalBanner] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  
  useEffect(() => {
    const unsubscribePesanan = onValue(
      ref(db, "/pesanan/"),
      (snapshot) => {
        let dataChartPesanan = {};
        let dataChartPendapatan = {};
        const statusPesanan = {};
        let totalPendapatan = 0;
        let totalPesanan = 0
        snapshot.forEach((pesanan) => {
          const orderID = pesanan.val().order_id;
          // parsing tanggal pemesanan dari order ID untuk mendapatkan hari, bulan, dan tahun
          const tahun = orderID.substr(1, 4);
          const bulan = orderID.substr(5, 2);
          const hari = orderID.substr(7, 2);

          // menghitung jumlah pesanan untuk setiap hari
          if (!dataChartPesanan[`${tahun}-${bulan}-${hari}`]) {
            dataChartPesanan[`${tahun}-${bulan}-${hari}`] = 1;
          } else {
            dataChartPesanan[`${tahun}-${bulan}-${hari}`] += 1;
          }

          // menghitung pendapatan untuk setiap hari
          if (!dataChartPendapatan[`${tahun}-${bulan}-${hari}`]) {
            dataChartPendapatan[`${tahun}-${bulan}-${hari}`] =
              pesanan.val().total_tagihan;
          } else {
            dataChartPendapatan[`${tahun}-${bulan}-${hari}`] +=
              pesanan.val().total_tagihan;
          }

          totalPesanan += 1;
          totalPendapatan += pesanan.val().total_tagihan;
            statusPesanan[pesanan.val().status_pesanan] =
              (statusPesanan[pesanan.val().status_pesanan] || 0) + 1;
        });

        // mengurutkan dataChart berdasarkan tanggal
        const sortedDataPesanan = Object.entries(dataChartPesanan).sort(
          (a, b) => new Date(a[0]) - new Date(b[0])
        );

        // mengurutkan dataChart berdasarkan tanggal
        const sortedDataPendapatan = Object.entries(dataChartPendapatan).sort(
          (a, b) => new Date(a[0]) - new Date(b[0])
        );

        // mengambil label dan data dari sortedData
        const chartLabelPesananArray = [];
        const chartDataPesananArray = [];
        const chartLabelPendapatanArray = [];
        const chartDataPendapatanArray = [];

        sortedDataPesanan.forEach((data) => {
          chartLabelPesananArray.push(data[0]);
          chartDataPesananArray.push(data[1]);
        });

        sortedDataPendapatan.forEach((data) => {
          chartLabelPendapatanArray.push(data[0]);
          chartDataPendapatanArray.push(data[1]);
        });

        setChartLabelsPesanan(chartLabelPesananArray);
        setChartDataPesanan(chartDataPesananArray);
        setChartLabelsPendapatan(chartLabelPendapatanArray);
        setChartDataPendapatan(chartDataPendapatanArray);
        setChartDataStatus(Object.values(statusPesanan));
        setChartLabelsStatus(Object.keys(statusPesanan));
        setTotalPendapatan(totalPendapatan);
        setTotalPesanan(totalPesanan);
      },
      {
        onlyOnce: true,
      },
      (error) => {
        //ERROR
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonColor: "#f69d93",
          confirmButtonText: "OK",
        });
      }
    );

    const unsubscribeUsers = onValue(
      ref(db, "/users/"),
      (snapshot) => {
        let totalUsers = 0;
        snapshot.forEach((users) => {
          totalUsers += 1;
        });
        setTotalUsers(totalUsers);
      },
      {
        onlyOnce: true,
      },
      (error) => {
        //ERROR
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonColor: "#f69d93",
          confirmButtonText: "OK",
        });
      }
    );

    const unsubscribeKategori = onValue(
      ref(db, "/kategori/"),
      (snapshot) => {
        let totalKategori = 0;
        snapshot.forEach((kategori) => {
          totalKategori += 1;
        });
        setTotalKategori(totalKategori);
      },
      {
        onlyOnce: true,
      },
      (error) => {
        //ERROR
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonColor: "#f69d93",
          confirmButtonText: "OK",
        });
      }
    );

    const unsubscribeProduk = onValue(
      ref(db, "/produk/"),
      (snapshot) => {
        let totalProduk = 0;
        snapshot.forEach((produk) => {
          totalProduk += 1;
        });
        setTotalProduk(totalProduk);
      },
      {
        onlyOnce: true,
      },
      (error) => {
        //ERROR
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonColor: "#f69d93",
          confirmButtonText: "OK",
        });
      }
    );

    const unsubscribeBanner = onValue(
      ref(db, "/banner/"),
      (snapshot) => {
        let totalBanner = 0;
        snapshot.forEach((banner) => {
          totalBanner += 1;
        });
        setTotalBanner(totalBanner);
      },
      {
        onlyOnce: true,
      },
      (error) => {
        //ERROR
        Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
          confirmButtonColor: "#f69d93",
          confirmButtonText: "OK",
        });
      }
    );

    return () => {
      // unsubscribe dari onValue() ketika komponen di-unmount
      unsubscribePesanan();
      unsubscribeKategori();
      unsubscribeProduk();
      unsubscribeBanner();
      unsubscribeUsers();
    };
  }, []);

  return (
    <>
      <div className="content">
        <Row>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-left icon-warning">
                      <BiShoppingBag color="#f69d93" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Total Pesanan</p>
                      <CardTitle tag="p">{totalPesanan}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5" style={{ paddingRight: 0 }}>
                    <div className="icon-big text-left icon-warning">
                      <FaMoneyBill color="#f69d93" />
                    </div>
                  </Col>
                  <Col md="8" xs="7" style={{ paddingLeft: 0 }}>
                    <div className="numbers">
                      <p className="card-category">Total Omzet</p>
                      <CardTitle tag="p" style={{ fontSize: "19px" }}>
                        Rp{totalPendapatan.toLocaleString("id-ID")}
                      </CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-left icon-warning">
                      <RxDashboard color="#f69d93" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Total Kategori</p>
                      <CardTitle tag="p">{totalKategori}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-left icon-warning">
                      <FiShoppingBag color="#f69d93" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Total Produk</p>
                      <CardTitle tag="p">{totalProduk}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-left icon-warning">
                      <BsImage color="#f69d93" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Total Banner</p>
                      <CardTitle tag="p">{totalBanner}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-left icon-warning">
                      <HiUsers color="#f69d93" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Total User</p>
                      <CardTitle tag="p">{totalUsers}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Grafik Pesanan Per Hari</CardTitle>
              </CardHeader>
              <CardBody>
                <Line
                  height={50}
                  data={{
                    labels: chartLabelsPesanan,
                    datasets: [
                      {
                        label: "Pesanan Per Hari",
                        data: chartDataPesanan,
                        fill: true,
                        borderColor: "#f69d93",
                        tension: 0.1,
                      },
                    ],
                  }}
                  options={{
                    scales: {
                      yAxes: [
                        {
                          ticks: {
                            beginAtZero: true,
                          },
                        },
                      ],
                    },
                  }}
                />
              </CardBody>
              <CardFooter>
                <hr />
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Grafik Omzet Per Hari</CardTitle>
              </CardHeader>
              <CardBody>
                <Line
                  height={50}
                  data={{
                    labels: chartLabelsPendapatan,
                    datasets: [
                      {
                        label: "Omzet Per Hari",
                        data: chartDataPendapatan,
                        fill: true,
                        borderColor: "#f69d93",
                        tension: 0.1,
                      },
                    ],
                  }}
                  options={{
                    scales: {
                      yAxes: [
                        {
                          ticks: {
                            beginAtZero: true,
                          },
                        },
                      ],
                    },
                    responsive: true,
                  }}
                />
              </CardBody>
              <CardFooter>
                <hr />
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Grafik Status Pesanan</CardTitle>
              </CardHeader>
              <CardBody style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: "300px", height: "300px" }}>
                  <Pie
                    data={{
                      labels: chartLabelsStatus,
                      datasets: [
                        {
                          label: "Status Pesanan",
                          data: chartDataStatus,
                          backgroundColor: [
                            "#92E2F5",
                            "#BF93F5",
                            "#F59D93",
                            "#F5DB98",
                            "#B7F59A",
                          ],
                        },
                      ],
                    }}
                  />
                </div>
              </CardBody>
              <CardFooter>
                <hr />
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
