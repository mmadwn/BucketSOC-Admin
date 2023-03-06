import { getDetailPesanan } from "actions/PesananAction";
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
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import Swal from "sweetalert2";
import $ from "jquery";
import { TbFileInvoice } from "react-icons/tb";
import { BiLinkAlt } from "react-icons/bi";
import { BsClipboardCheck } from "react-icons/bs";
import { FaShippingFast } from "react-icons/fa";
import { FiBox } from "react-icons/fi";
import { IoCalendar } from "react-icons/io5";
import { IoMdBarcode } from "react-icons/io";
import { MdCancel, MdDoneAll } from "react-icons/md";
import { createInvoice } from "actions/InvoiceAction";
import { getAdminProfile } from "actions/ProfileAction";
import { custom_bulan } from "utils";
import { confirmOrderWithBiteship } from "actions/PesananAction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { custom_hari } from "utils";
import { requestBiteshipPickUp } from "actions/PesananAction";
import { changeDeliveryDate } from "actions/PesananAction";
import { finishOrder } from "actions/PesananAction";
import { cancelPesanan } from "actions/PesananAction";
import { confirmOrderNoBiteship } from "actions/PesananAction";
import { siapDiambil } from "actions/PesananAction";
import { lacakPengiriman } from "actions/PesananAction";
import { updateStatusDetailPesanan } from "actions/PesananAction";

class DetailPesanan extends Component {
  constructor(props) {
    super(props);
    //Deklarasi state atau variable awal
    this.state = {
      id: this.props.match.params.id,
      date: new Date().toLocaleString("id-ID"),
      DateTimeModal: false,
      ShippingModal: false,
      tracking: false,
      selectedDate: "",
      selectedTime: "",
      tanggalBaruDatabase: "",
      waktuBaruDatabase: "",
      tanggalBaruBiteship: "",
      waktuBaruBiteship: "",
    };
    this.toggle = this.toggle.bind(this);
    this.toggleShipping = this.toggleShipping.bind(this);
  }

  toggle() {
    this.setState({
      DateTimeModal: !this.state.DateTimeModal,
    });
  }

  toggleShipping() {
    this.setState({
      ShippingModal: !this.state.ShippingModal,
    });
  }

  //Dijalankan ketika nama Kategori diisi
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(updateStatusDetailPesanan(this.props.match.params.id));
  }

  //Jika proses tambah kategori ke firebse database berhasil
  componentDidUpdate(prevProps) {
    const {
      dispatch,
      updateStatusDetailResult,
      getDetailPesananResult,
      confirmPesananResult,
      requestPickUpResult,
      changeDeliveryDateResult,
      finishPesananResult,
      cancelPesananResult,
      siapDiambilResult,
      lacakPengirimanResult,
    } = this.props;

    if (
      updateStatusDetailResult &&
      prevProps.updateStatusDetailResult !== updateStatusDetailResult
    ) {
      //jika nilainya true && nilai sebelumnya tidak sama dengan yang baru
      dispatch(getDetailPesanan(this.props.match.params.id));
    }

    if (
      getDetailPesananResult &&
      prevProps.getDetailPesananResult !== getDetailPesananResult
    ) {
      if (
        getDetailPesananResult.order_id.slice(-1) === "A" &&
        (getDetailPesananResult.status_pesanan ===
          "Menunggu Konfirmasi Admin" ||
          getDetailPesananResult.status_pesanan === "Pengiriman Gagal")
      ) {
        dispatch(getAdminProfile());
      }
    }

    if (
      confirmPesananResult &&
      prevProps.confirmPesananResult !== confirmPesananResult
    ) {
      //jika nilainya true && nilai sebelumnya tidak sama dengan yang baru
      Swal.fire({
        title: "Sukses",
        text: "Pesanan Berhasil Dikonfirmasi!",
        icon: "success",
        confirmButtonColor: "#f69d93",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload();
      });
    }

    if (
      requestPickUpResult &&
      prevProps.requestPickUpResult !== requestPickUpResult
    ) {
      //jika nilainya true && nilai sebelumnya tidak sama dengan yang baru
      Swal.fire({
        title: "Sukses",
        text: "Request Pick-Up Berhasil!",
        icon: "success",
        confirmButtonColor: "#f69d93",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload();
      });
    }

    if (
      changeDeliveryDateResult &&
      prevProps.changeDeliveryDateResult !== changeDeliveryDateResult
    ) {
      //jika nilainya true && nilai sebelumnya tidak sama dengan yang baru
      Swal.fire({
        title: "Sukses",
        text: "Ubah Tanggal & Waktu Berhasil!",
        icon: "success",
        confirmButtonColor: "#f69d93",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload();
      });
    }

    if (
      finishPesananResult &&
      prevProps.finishPesananResult !== finishPesananResult
    ) {
      //jika nilainya true && nilai sebelumnya tidak sama dengan yang baru
      Swal.fire({
        title: "Sukses",
        text: "Berhasil Selesaikan Pesanan!",
        icon: "success",
        confirmButtonColor: "#f69d93",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload();
      });
    }

    if (
      cancelPesananResult &&
      prevProps.cancelPesananResult !== cancelPesananResult
    ) {
      //jika nilainya true && nilai sebelumnya tidak sama dengan yang baru
      Swal.fire({
        title: "Sukses",
        text: "Pembatalan Pesanan Berhasil!",
        icon: "success",
        confirmButtonColor: "#f69d93",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload();
      });
    }

    if (
      siapDiambilResult &&
      prevProps.siapDiambilResult !== siapDiambilResult
    ) {
      //jika nilainya true && nilai sebelumnya tidak sama dengan yang baru
      Swal.fire({
        title: "Sukses",
        text: "Pesanan Siap Diambil!",
        icon: "success",
        confirmButtonColor: "#f69d93",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload();
      });
    }

    if (
      lacakPengirimanResult &&
      prevProps.lacakPengirimanResult !== lacakPengirimanResult
    ) {
      //jika nilainya true && nilai sebelumnya tidak sama dengan yang baru
      this.setState({
        tracking: lacakPengirimanResult,
      });
    }
  }

  invoice = () => {
    const { date } = this.state;
    const { dispatch, getDetailPesananResult } = this.props;
    let status_tagihan = "";
    let itemList = [];
    Object.keys(getDetailPesananResult.item).forEach((key) => {
      itemList.push({
        name: getDetailPesananResult.item[key].produk.nama,
        quantity: getDetailPesananResult.item[key].jumlah,
        unit_cost: getDetailPesananResult.item[key].produk.harga,
        description: getDetailPesananResult.item[key].catatan
          ? "Catatan: " + getDetailPesananResult.item[key].catatan
          : null,
      });
    });
    if (getDetailPesananResult.url_midtrans) {
      if (getDetailPesananResult.status_pesanan === "Menunggu Pembayaran") {
        status_tagihan = "BELUM DIBAYAR";
      } else if (
        getDetailPesananResult.status_pesanan ===
          "Selesai (Pembayaran Gagal)" ||
        getDetailPesananResult.status_pesanan ===
          "Selesai (Dibatalkan Pembeli)" ||
        getDetailPesananResult.status_pesanan === "Selesai (Dibatalkan Penjual)"
      ) {
        status_tagihan = "DIBATALKAN";
      } else {
        status_tagihan = "LUNAS";
      }
    } else {
      if (
        getDetailPesananResult.status_pesanan ===
          "Selesai (Dibatalkan Pembeli)" ||
        getDetailPesananResult.status_pesanan === "Selesai (Dibatalkan Penjual)"
      ) {
        status_tagihan = "DIBATALKAN";
      } else if (
        getDetailPesananResult.status_pesanan ===
        "Selesai (Pesanan Telah Diterima)"
      ) {
        status_tagihan = "LUNAS";
      } else {
        status_tagihan = "BELUM DIBAYAR";
      }
    }

    const data = {
      header: "Invoice",
      to_title: "Pelanggan",
      ship_to_title: "Alamat",
      invoice_number_title: "ORDER ID #",
      date_title: "Tanggal Pemesanan",
      quantity_header: "Jumlah",
      unit_cost_header: "Harga Satuan",
      amount_header: "Total Harga",
      shipping_title: "Total Ongkos Kirim",
      subtotal_title: "Total Harga Barang",
      total_title: "Total Pesanan",
      balance_title: "Total Tagihan",
      notes_title: "Catatan",
      terms_title: "Diperbarui pada",
      logo: "https://i.ibb.co/f0rbMfm/Rounded-Logo-Copy.png",
      number: getDetailPesananResult.order_id,
      from: "BUCKET SOC",
      to:
        getDetailPesananResult.user.nama +
        " (" +
        getDetailPesananResult.user.nomerHp +
        ")",
      ship_to:
        getDetailPesananResult.user.alamat +
        ". Detail Alamat: " +
        getDetailPesananResult.user.detail_alamat,
      currency: "IDR",
      date: getDetailPesananResult.tanggal_pemesanan,
      items: itemList,
      shipping: getDetailPesananResult.total_ongkir,
      notes:
        "Invoice ini dibuat otomatis oleh sistem. Terimakasih atas pesanan Anda!",
      terms: date,
      custom_fields: [
        {
          name:
            getDetailPesananResult.order_id.slice(-1) === "A"
              ? "Tanggal Permintaan Pengiriman"
              : "Tanggal Permintaan Pengambilan",
          value: getDetailPesananResult.tanggal_pengiriman,
        },
        {
          name: "Metode Pengiriman dan Pembayaran",
          value: getDetailPesananResult.metode_pengiriman,
        },
        {
          name: "Status Tagihan",
          value: status_tagihan,
        },
      ],
    };
    dispatch(createInvoice(data));
  };

  confirmValidation = () => {
    const { getDetailPesananResult } = this.props;
    Swal.fire({
      title: "Konfirmasi Pesanan?",
      text:
        "Konfirmasi pesanan untuk " +
        (getDetailPesananResult.order_id.slice(-1) === "A"
          ? "dikirim"
          : "diambil") +
        " pada " +
        getDetailPesananResult.tanggal_pengiriman +
        "? Setelah ini pesanan tidak dapat dibatalkan tetapi tanggal & waktu " +
        (getDetailPesananResult.order_id.slice(-1) === "A"
          ? "pengiriman"
          : "pengambilan") +
        " masih dapat diubah!",
      icon: "question",
      showCancelButton: true,
      showDenyButton: true,
      denyButtonText: "Ubah Tanggal & Waktu",
      confirmButtonColor: "#53ac69",
      cancelButtonColor: "#f69d93",
      denyButtonColor: "#fbc658",
      confirmButtonText: "Ya, Konfirmasi",
      cancelButtonText: "Kembali",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.confirmOrder();
      } else if (result.isDenied) {
        this.toggle();
      }
    });
  };

  handleDateChange = (selectedDate) => {
    const newDate = new Date(selectedDate);
    const year = newDate.getFullYear();
    const month = custom_bulan[newDate.getMonth()];
    const date = newDate.getDate();
    const day = custom_hari[newDate.getDay()];
    const formattedDate = `${day}, ${date} ${month} ${year}`;
    const formattedDateDatabase = String(formattedDate);

    const dateTimeArr = formattedDateDatabase.split(" ");
    const tanggal = dateTimeArr[1];
    const bulan = custom_bulan.indexOf(dateTimeArr[2]) + 1;
    const tahun = dateTimeArr[3].toString();
    const formattedDateBiteship = `${tahun}-${bulan
      .toString()
      .padStart(2, "0")}-${tanggal.toString().padStart(2, "0")}`;
    this.setState({
      selectedDate: selectedDate,
      tanggalBaruDatabase: formattedDateDatabase,
      tanggalBaruBiteship: formattedDateBiteship,
    });
  };

  handleTimeChange = (selectedTime) => {
    const newTime = new Date(selectedTime);
    const formattedTimeDatabase = newTime
      .toLocaleTimeString("id-ID", { hour: "numeric", minute: "numeric" })
      .replace(":", ".");
    const formattedTimeBiteship = newTime
      .toLocaleTimeString("id-ID", {
        hour: "numeric",
        minute: "numeric",
      })
      .replace(".", ":");
    this.setState({
      selectedTime: selectedTime,
      waktuBaruDatabase: formattedTimeDatabase,
      waktuBaruBiteship: formattedTimeBiteship,
    });
  };

  confirmDateTime = () => {
    const { selectedDate, selectedTime } = this.state;
    const { getDetailPesananResult } = this.props;
    if (selectedDate && selectedTime) {
      if (
        getDetailPesananResult.status_pesanan === "Menunggu Konfirmasi Admin" ||
        getDetailPesananResult.status_pesanan === "Pengiriman Gagal"
      ) {
        this.confirmOrder();
      } else if (getDetailPesananResult.status_pesanan === "Diproses") {
        this.updateDeliveryDate();
      }
      this.toggle();
    } else {
      Swal.fire({
        title: "Error",
        text: "Maaf, tanggal & waktu harus diisi!",
        icon: "error",
        confirmButtonColor: "#f69d93",
        confirmButtonText: "OK",
      });
    }
  };

  confirmOrder = () => {
    const {
      tanggalBaruDatabase,
      waktuBaruDatabase,
      tanggalBaruBiteship,
      waktuBaruBiteship,
    } = this.state;
    const { dispatch, getDetailPesananResult, getAdminProfileResult } =
      this.props;
    if (getDetailPesananResult.order_id.slice(-1) === "A") {
      if (getAdminProfileResult) {
        const dateString = getDetailPesananResult.tanggal_pengiriman;
        const dateTimeArr = dateString.split(" ");

        const tanggal = dateTimeArr[1];
        const bulan = custom_bulan.indexOf(dateTimeArr[2]) + 1;
        const tahun = dateTimeArr[3].toString();

        const formattedDate = `${tahun}-${bulan
          .toString()
          .padStart(2, "0")}-${tanggal.toString().padStart(2, "0")}`;
        const formattedTime = dateTimeArr[4].replace(".", ":");

        let itemList = [];
        Object.keys(getDetailPesananResult.item).forEach((key) => {
          itemList.push({
            name: getDetailPesananResult.item[key].produk.nama,
            description: getDetailPesananResult.item[key].catatan,
            value: getDetailPesananResult.item[key].produk.harga,
            quantity: getDetailPesananResult.item[key].jumlah,
          });
        });

        const dataBiteship = {
          shipper_contact_name: getAdminProfileResult.nama,
          shipper_contact_phone: getAdminProfileResult.nomerHp,
          shipper_contact_email: getAdminProfileResult.email,
          shipper_organization: "Bucket SOC",
          origin_contact_name: getAdminProfileResult.nama,
          origin_contact_phone: getAdminProfileResult.nomerHp,
          origin_contact_email: getAdminProfileResult.email,
          origin_address: getAdminProfileResult.alamat,
          origin_note: getAdminProfileResult.detail_alamat,
          origin_coordinate: {
            latitude: getAdminProfileResult.latitude,
            longitude: getAdminProfileResult.longitude,
          },
          destination_contact_name: getDetailPesananResult.user.nama,
          destination_contact_phone: getDetailPesananResult.user.nomerHp,
          destination_contact_email: getDetailPesananResult.user.email,
          destination_address: getDetailPesananResult.user.alamat,
          destination_note: getDetailPesananResult.user.detail_alamat,
          destination_coordinate: {
            latitude: getDetailPesananResult.user.latitude,
            longitude: getDetailPesananResult.user.longitude,
          },
          courier_company:
            getDetailPesananResult.metode_pengiriman ===
            "GoSend Instant (Pembayaran Online)"
              ? "gojek"
              : "grab",
          courier_type: "instant",
          courier_insurance: getDetailPesananResult.asuransi
            ? getDetailPesananResult.total_harga_barang
            : 0,
          delivery_type: "later",
          delivery_date: tanggalBaruBiteship
            ? tanggalBaruBiteship
            : formattedDate,
          delivery_time: waktuBaruBiteship ? waktuBaruBiteship : formattedTime,
          order_note: getDetailPesananResult.order_id,
          items: itemList,
        };
        if (tanggalBaruBiteship && waktuBaruBiteship) {
          dispatch(
            confirmOrderWithBiteship(
              getDetailPesananResult.order_id,
              dataBiteship,
              tanggalBaruDatabase,
              waktuBaruDatabase
            )
          );
        } else {
          dispatch(
            confirmOrderWithBiteship(
              getDetailPesananResult.order_id,
              dataBiteship
            )
          );
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "Gagal mendapatkan data Admin!",
          icon: "error",
          confirmButtonColor: "#f69d93",
          confirmButtonText: "OK",
        });
      }
    } else if (
      getDetailPesananResult.order_id.slice(-1) === "B" ||
      getDetailPesananResult.order_id.slice(-1) === "C"
    ) {
      if (tanggalBaruDatabase && waktuBaruDatabase) {
        dispatch(
          confirmOrderNoBiteship(
            getDetailPesananResult.order_id,
            tanggalBaruDatabase,
            waktuBaruDatabase
          )
        );
      } else {
        dispatch(confirmOrderNoBiteship(getDetailPesananResult.order_id));
      }
    }
  };

  cancelOrder = () => {
    const { dispatch, getDetailPesananResult } = this.props;
    Swal.fire({
      title: "Konfirmasi Pembatalan Pesanan?",
      text: "Apakah Anda ingin membatalkan pesanan ini? ",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#f69d93",
      confirmButtonText: "Ya, Batalkan",
      cancelButtonText: "Kembali",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        dispatch(cancelPesanan(getDetailPesananResult));
      }
    });
  };

  finishOrder = () => {
    const { dispatch, getDetailPesananResult } = this.props;
    if (getDetailPesananResult.biteship_id) {
      Swal.fire({
        title: "Konfirmasi Selesaikan Pesanan?",
        icon: "question",
        width: "900px",
        showCancelButton: true,
        showDenyButton: true,
        denyButtonText: "Ya, Selesai (Pembeli Mengajukan Komplain)",
        confirmButtonColor: "#53ac69",
        cancelButtonColor: "#f69d93",
        denyButtonColor: "#fbc658",
        confirmButtonText: "Ya, Selesai (Pesanan Telah Diterima)",
        cancelButtonText: "Kembali",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          const notes = "Diterima";
          dispatch(finishOrder(getDetailPesananResult.order_id, notes));
        } else if (result.isDenied) {
          const notes = "Komplain";
          dispatch(finishOrder(getDetailPesananResult.order_id, notes));
        }
      });
    } else {
      Swal.fire({
        title: "Konfirmasi Selesaikan Pesanan?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#53ac69",
        cancelButtonColor: "#f69d93",
        confirmButtonText: "Ya, Selesai (Pesanan Telah Diterima)",
        cancelButtonText: "Kembali",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          const notes = "Diterima";
          dispatch(finishOrder(getDetailPesananResult.order_id, notes));
        }
      });
    }
  };

  requestPickUp = async () => {
    const { getDetailPesananResult, dispatch } = this.props;
    Swal.fire({
      title: "Konfirmasi Request Pick-Up?",
      text: "Konfirmasi untuk melakukan Pick-Up barang sekarang? ",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#53ac69",
      cancelButtonColor: "#f69d93",
      confirmButtonText: "Ya, Pick-Up Sekarang",
      cancelButtonText: "Kembali",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const now = new Date();
        await this.handleDateChange(now);
        await this.handleTimeChange(now);
        const {
          tanggalBaruDatabase,
          waktuBaruDatabase,
          tanggalBaruBiteship,
          waktuBaruBiteship,
        } = this.state;
        dispatch(
          requestBiteshipPickUp(
            getDetailPesananResult.order_id,
            getDetailPesananResult.biteship_id,
            tanggalBaruDatabase,
            waktuBaruDatabase,
            tanggalBaruBiteship,
            waktuBaruBiteship
          )
        );
      }
    });
  };

  updateDeliveryDate = () => {
    const {
      tanggalBaruDatabase,
      waktuBaruDatabase,
      tanggalBaruBiteship,
      waktuBaruBiteship,
    } = this.state;
    const { dispatch, getDetailPesananResult } = this.props;

    const tanggalDatabase = tanggalBaruDatabase + " " + waktuBaruDatabase;

    if (getDetailPesananResult.biteship_id) {
      const dataBiteship = {
        delivery_date: tanggalBaruBiteship,
        delivery_time: waktuBaruBiteship,
      };
      dispatch(
        changeDeliveryDate(
          getDetailPesananResult.order_id,
          tanggalDatabase,
          getDetailPesananResult.biteship_id,
          dataBiteship
        )
      );
    } else {
      dispatch(
        changeDeliveryDate(getDetailPesananResult.order_id, tanggalDatabase)
      );
    }
  };

  siapDiambil = () => {
    const { getDetailPesananResult, dispatch } = this.props;
    Swal.fire({
      title: "Konfirmasi Pesanan Siap Diambil?",
      text: "Apakah Pesanan Sudah Siap Diambil Oleh Pembeli?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#53ac69",
      cancelButtonColor: "#f69d93",
      confirmButtonText: "Ya, Pesanan Siap Diambil",
      cancelButtonText: "Kembali",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(siapDiambil(getDetailPesananResult.order_id));
      }
    });
  };

  lacakPengiriman = (biteship_id) => {
    const { dispatch } = this.props;
    dispatch(lacakPengiriman(biteship_id));
  };

  render() {
    const { DateTimeModal, ShippingModal, id, tracking } = this.state;
    const {
      getDetailPesananResult,
      getDetailPesananLoading,
      getDetailPesananError,
      createInvoiceLoading,
      confirmPesananLoading,
      requestPickUpLoading,
      changeDeliveryDateLoading,
      finishPesananLoading,
      cancelPesananLoading,
      siapDiambilLoading,
    } = this.props;
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 6);
    //initialize datatable
    $(document).ready(function () {
      $("#datatable").DataTable({
        bDestroy: true,
        ordering: false,
        info: false,
        searching: false,
        paging: false,
        scrollX: true,
        language: {
          thousands: ".",
          decimal: ",",
        },
      });
    });
    return (
      <div className="content">
        {getDetailPesananResult ? (
          <div>
            <Row>
              <Col>
                <Link to="/admin/pesanan" className="btn btn-primary">
                  <i className="nc-icon nc-minimal-left" /> Kembali
                </Link>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card style={{ marginTop: 10 }}>
                  <CardHeader style={{ padding: 15 }}>
                    {getDetailPesananResult.status_pesanan === "Terkirim" ||
                    getDetailPesananResult.status_pesanan === "Siap Diambil" ? (
                      <>
                        {finishPesananLoading ? (
                          <Button
                            className="btn btn-primary float-right full-btn"
                            disabled
                          >
                            <Spinner size="sm" color="light" /> Loading
                          </Button>
                        ) : (
                          <Button
                            className="btn btn-primary float-right full-btn"
                            id="pesanan"
                            onClick={() => this.finishOrder()}
                          >
                            <MdDoneAll
                              size="15px"
                              style={{ verticalAlign: "sub" }}
                            />{" "}
                            Selesaikan Pesanan
                          </Button>
                        )}
                      </>
                    ) : null}
                    {getDetailPesananResult.url_midtrans ? (
                      <Link
                        className="btn btn-primary float-right full-btn"
                        to={{ pathname: getDetailPesananResult.url_midtrans }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <BiLinkAlt
                          size="15px"
                          style={{ verticalAlign: "sub" }}
                        />{" "}
                        Tampilkan URL Pembayaran
                      </Link>
                    ) : null}
                    {createInvoiceLoading ? (
                      <Button
                        className="btn btn-primary float-right full-btn"
                        disabled
                      >
                        <Spinner size="sm" color="light" /> Loading
                      </Button>
                    ) : (
                      <Button
                        className="btn btn-primary float-right full-btn"
                        onClick={() => this.invoice()}
                      >
                        <TbFileInvoice
                          size="15px"
                          style={{ verticalAlign: "sub" }}
                        />{" "}
                        Lihat Invoice
                      </Button>
                    )}
                    {getDetailPesananResult.status_pesanan ===
                      "Menunggu Konfirmasi Admin" ||
                    getDetailPesananResult.status_pesanan ===
                      "Pengiriman Gagal" ? (
                      <>
                        {confirmPesananLoading ? (
                          <Button
                            className="btn btn-primary float-right full-btn"
                            disabled
                          >
                            <Spinner size="sm" color="light" /> Loading
                          </Button>
                        ) : (
                          <Button
                            className="btn btn-primary float-right full-btn"
                            id="pesanan"
                            onClick={() => this.confirmValidation()}
                          >
                            <BsClipboardCheck
                              size="15px"
                              style={{ verticalAlign: "sub" }}
                            />{" "}
                            {getDetailPesananResult.status_pesanan ===
                            "Pengiriman Gagal"
                              ? "Konfirmasi Ulang Pesanan"
                              : "Konfirmasi Pesanan"}
                          </Button>
                        )}
                      </>
                    ) : null}
                    {getDetailPesananResult.status_pesanan === "Diproses" &&
                    getDetailPesananResult.biteship_id ? (
                      <>
                        {requestPickUpLoading ? (
                          <Button
                            className="btn btn-primary float-right full-btn"
                            disabled
                          >
                            <Spinner size="sm" color="light" /> Loading
                          </Button>
                        ) : (
                          <Button
                            className="btn btn-primary float-right full-btn"
                            id="pesanan"
                            onClick={() => this.requestPickUp()}
                          >
                            <FaShippingFast
                              size="15px"
                              style={{ verticalAlign: "sub" }}
                            />{" "}
                            Request Pick-Up
                          </Button>
                        )}
                      </>
                    ) : null}
                    {getDetailPesananResult.status_pesanan !== "Diproses" &&
                    getDetailPesananResult.biteship_id ? (
                      <>
                        {requestPickUpLoading ? (
                          <Button
                            className="btn btn-primary float-right full-btn"
                            disabled
                          >
                            <Spinner size="sm" color="light" /> Loading
                          </Button>
                        ) : (
                          <Button
                            className="btn btn-primary float-right full-btn"
                            id="pesanan"
                            onClick={() => {
                              this.toggleShipping();
                              this.lacakPengiriman(
                                getDetailPesananResult.biteship_id
                              );
                            }}
                          >
                            <IoMdBarcode
                              size="15px"
                              style={{ verticalAlign: "sub" }}
                            />{" "}
                            Lacak Pengiriman
                          </Button>
                        )}
                      </>
                    ) : null}
                    {getDetailPesananResult.status_pesanan === "Diproses" &&
                    !getDetailPesananResult.biteship_id ? (
                      <>
                        {siapDiambilLoading ? (
                          <Button
                            className="btn btn-primary float-right full-btn"
                            disabled
                          >
                            <Spinner size="sm" color="light" /> Loading
                          </Button>
                        ) : (
                          <Button
                            className="btn btn-primary float-right full-btn"
                            id="pesanan"
                            onClick={() => this.siapDiambil()}
                          >
                            <FiBox
                              size="15px"
                              style={{ verticalAlign: "sub", color: "white" }}
                            />{" "}
                            Siap Diambil
                          </Button>
                        )}
                      </>
                    ) : null}
                    {getDetailPesananResult.status_pesanan === "Diproses" ? (
                      <>
                        {changeDeliveryDateLoading ? (
                          <Button
                            className="btn btn-primary float-right full-btn"
                            disabled
                          >
                            <Spinner size="sm" color="light" /> Loading
                          </Button>
                        ) : (
                          <Button
                            className="btn btn-primary float-right full-btn"
                            id="pesanan"
                            onClick={() => this.toggle()}
                          >
                            <IoCalendar
                              size="15px"
                              style={{ verticalAlign: "sub" }}
                            />{" "}
                            {getDetailPesananResult.order_id.slice(-1) === "A"
                              ? "Ubah Tanggal & Waktu Pengiriman"
                              : "Ubah Tanggal & Waktu Pengambilan"}
                          </Button>
                        )}
                      </>
                    ) : null}
                    {getDetailPesananResult.status_pesanan ===
                      "Menunggu Pembayaran" ||
                    getDetailPesananResult.status_pesanan ===
                      "Menunggu Konfirmasi Admin" ? (
                      <>
                        {cancelPesananLoading ? (
                          <Button className="btn btn-danger float-left full-btn">
                            <Spinner size="sm" color="light" /> Loading
                          </Button>
                        ) : (
                          <Button
                            className="btn btn-danger float-left full-btn"
                            id="pesanan"
                            onClick={() => this.cancelOrder()}
                          >
                            <MdCancel
                              size="15px"
                              style={{ verticalAlign: "sub" }}
                            />{" "}
                            Batalkan Pesanan
                          </Button>
                        )}
                      </>
                    ) : null}
                  </CardHeader>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card>
                  <CardHeader>
                    <CardTitle tag="h5">Detail Pesanan</CardTitle>
                  </CardHeader>
                  <hr style={{ margin: 0 }} />
                  <CardBody>
                    <Col md="11">
                      <FormGroup>
                        <Row>
                          <Col md="6">
                            <Label className="card-subtitle">Status</Label>
                          </Col>
                          <Col>
                            <Label className="status">
                              {getDetailPesananResult.status_pesanan}
                            </Label>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col md="6">
                            <Label className="card-subtitle">ID Pesanan</Label>
                          </Col>
                          <Col>
                            <Label>{getDetailPesananResult.order_id}</Label>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col md="6">
                            <Label className="card-subtitle">Total Harga</Label>
                          </Col>
                          <Col>
                            <Label>
                              Rp
                              {getDetailPesananResult.total_tagihan.toLocaleString(
                                "id-ID"
                              )}
                            </Label>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col md="6">
                            <Label className="card-subtitle">
                              Tanggal Pemesanan
                            </Label>
                          </Col>
                          <Col>
                            <Label>
                              {getDetailPesananResult.tanggal_pemesanan}
                            </Label>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col md="6">
                            <Label className="card-subtitle">
                              {getDetailPesananResult.order_id.slice(-1) === "A"
                                ? "Tanggal Permintaan Pengiriman"
                                : "Tanggal Permintaan Pengambilan"}
                            </Label>
                          </Col>
                          <Col>
                            <Label>
                              {getDetailPesananResult.tanggal_pengiriman}
                            </Label>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col md="6">
                            <Label className="card-subtitle">
                              Metode Pengiriman
                            </Label>
                          </Col>
                          <Col>
                            <Label>
                              {getDetailPesananResult.metode_pengiriman}
                            </Label>
                          </Col>
                        </Row>
                      </FormGroup>
                      {getDetailPesananResult.order_id.slice(-1) === "A" ? (
                        <FormGroup>
                          <Row>
                            <Col md="6">
                              <Label className="card-subtitle">
                                Asuransi Pengiriman
                              </Label>
                            </Col>
                            <Col>
                              <Label>
                                {getDetailPesananResult.asuransi === true
                                  ? "Ya"
                                  : "Tidak"}
                              </Label>
                            </Col>
                          </Row>
                        </FormGroup>
                      ) : null}
                      {getDetailPesananResult.biteship_id ? (
                        <FormGroup>
                          <Row>
                            <Col md="6">
                              <Label className="card-subtitle">
                                ID Pengiriman
                              </Label>
                            </Col>
                            <Col>
                              <Label style={{ textTransform: "uppercase" }}>
                                {getDetailPesananResult.biteship_id}
                              </Label>
                            </Col>
                          </Row>
                        </FormGroup>
                      ) : null}
                    </Col>
                  </CardBody>
                </Card>
              </Col>
              <Col>
                <Card>
                  <CardHeader>
                    <CardTitle tag="h5">Detail Pelanggan</CardTitle>
                  </CardHeader>
                  <hr style={{ margin: 0 }} />
                  <CardBody>
                    <Col md="11">
                      <FormGroup>
                        <Row>
                          <Col md="5">
                            <Label className="card-subtitle">Nama</Label>
                          </Col>
                          <Col>
                            <Label>{getDetailPesananResult.user.nama}</Label>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col md="5">
                            <Label className="card-subtitle">Email</Label>
                          </Col>
                          <Col>
                            <Label>{getDetailPesananResult.user.email}</Label>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col md="5">
                            <Label className="card-subtitle">
                              Nomor Telepon
                            </Label>
                          </Col>
                          <Col>
                            <Label>{getDetailPesananResult.user.nomerHp}</Label>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col md="5">
                            <Label className="card-subtitle">Alamat</Label>
                          </Col>
                          <Col>
                            <Label>{getDetailPesananResult.user.alamat}</Label>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col md="5">
                            <Label className="card-subtitle">
                              Detail Alamat
                            </Label>
                          </Col>
                          <Col>
                            <Label>
                              {getDetailPesananResult.user.detail_alamat}
                            </Label>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col md="5">
                            <Label className="card-subtitle">Latitude</Label>
                          </Col>
                          <Col>
                            <Label>
                              {getDetailPesananResult.user.latitude}
                            </Label>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row>
                          <Col md="5">
                            <Label className="card-subtitle">Longitude</Label>
                          </Col>
                          <Col>
                            <Label>
                              {getDetailPesananResult.user.longitude}
                            </Label>
                          </Col>
                        </Row>
                      </FormGroup>
                    </Col>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card>
                  <CardHeader>
                    <CardTitle tag="h5">Detail Item</CardTitle>
                  </CardHeader>
                  <hr style={{ margin: 0 }} />
                  <CardBody>
                    <table id="datatable" className="display" width="100%">
                      <thead className="text-primary">
                        <tr>
                          <th>Gambar</th>
                          <th>Nama Produk</th>
                          <th>Jumlah</th>
                          <th>Harga Satuan</th>
                          <th>Total Harga</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(getDetailPesananResult.item).map((key) => (
                          <tr key={key}>
                            <td align="center">
                              <div
                                style={{
                                  width: "60px",
                                }}
                              >
                                <img
                                  src={
                                    getDetailPesananResult.item[key].produk
                                      .gambar[0]
                                  }
                                  width="60px"
                                  height="60px"
                                  alt={"Not Found"}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://i.ibb.co/LxRv167/default-image.jpg";
                                  }}
                                />
                              </div>
                            </td>
                            <td>
                              <label
                                style={{
                                  textAlign: "justify",
                                  fontSize: "14px",
                                  width: "500px",
                                }}
                              >
                                {getDetailPesananResult.item[key].produk.nama}
                              </label>
                              {getDetailPesananResult.item[key].catatan ? (
                                <label
                                  style={{
                                    textAlign: "justify",
                                    fontSize: "12px",
                                    width: "500px",
                                  }}
                                >
                                  Catatan :{" "}
                                  {getDetailPesananResult.item[key].catatan}
                                </label>
                              ) : null}
                            </td>
                            <td>
                              <label
                                style={{
                                  textAlign: "justify",
                                  fontSize: "14px",
                                  width: "50px",
                                }}
                              >
                                {getDetailPesananResult.item[key].jumlah}
                              </label>
                            </td>
                            <td>
                              <label
                                style={{
                                  textAlign: "justify",
                                  fontSize: "14px",
                                  width: "150px",
                                }}
                              >
                                Rp
                                {getDetailPesananResult.item[
                                  key
                                ].produk.harga.toLocaleString("id-ID")}
                              </label>
                            </td>
                            <td>
                              <label
                                style={{
                                  textAlign: "justify",
                                  fontSize: "14px",
                                  width: "150px",
                                }}
                              >
                                Rp
                                {getDetailPesananResult.item[
                                  key
                                ].total_harga.toLocaleString("id-ID")}
                              </label>
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>
                            <Label
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                              }}
                            >
                              Subtotal Produk
                            </Label>
                          </td>
                          <td>
                            <Label
                              style={{
                                fontSize: "14px",
                              }}
                            >
                              Rp
                              {getDetailPesananResult.total_harga_barang.toLocaleString(
                                "id-ID"
                              )}
                            </Label>
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>
                            <Label
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                              }}
                            >
                              Ongkos Kirim
                            </Label>
                          </td>
                          <td>
                            <Label
                              style={{
                                fontSize: "14px",
                              }}
                            >
                              Rp
                              {getDetailPesananResult.total_ongkir.toLocaleString(
                                "id-ID"
                              )}
                            </Label>
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>
                            <Label
                              style={{
                                fontSize: "15px",
                                fontWeight: "bold",
                              }}
                            >
                              Total Harga
                            </Label>
                          </td>
                          <td>
                            <Label
                              style={{
                                fontWeight: "bold",
                                color: "#f69d93",
                                fontSize: "15px",
                              }}
                            >
                              Rp
                              {getDetailPesananResult.total_tagihan.toLocaleString(
                                "id-ID"
                              )}
                            </Label>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        ) : getDetailPesananLoading ? (
          <div
            style={{
              justifyContent: "center",
              display: "flex",
              marginBottom: "100px",
              marginTop: "70px",
            }}
          >
            <Spinner color="primary" />
          </div>
        ) : getDetailPesananError ? (
          <div
            style={{
              justifyContent: "center",
              display: "flex",
              marginBottom: "100px",
              marginTop: "70px",
            }}
          >
            <label>{getDetailPesananError}</label>
          </div>
        ) : (
          <div
            style={{
              justifyContent: "center",
              display: "flex",
              marginBottom: "100px",
              marginTop: "70px",
            }}
          >
            <label>Data pesanan tidak ditemukan!</label>
          </div>
        )}
        <Modal
          centered
          style={{ width: "1000px" }}
          isOpen={DateTimeModal}
          toggle={this.toggle}
        >
          <ModalHeader toggle={this.toggle} style={{ fontSize: "12px" }}>
            {id.slice(-1) === "A"
              ? "Ubah Tanggal & Waktu Pengiriman"
              : "Ubah Tanggal & Waktu Pengambilan"}
          </ModalHeader>
          <ModalBody>
            <div>
              <Row style={{ justifyContent: "center" }}>
                <DatePicker
                  selected={this.state.selectedDate}
                  onChange={this.handleDateChange}
                  minDate={new Date()}
                  maxDate={maxDate}
                  dateFormat="dd MMMM yyyy"
                  className="custom-datepicker"
                  placeholderText="--Pilih Tanggal--"
                />
                <DatePicker
                  selected={this.state.selectedTime}
                  onChange={this.handleTimeChange}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={1}
                  timeCaption="Waktu"
                  dateFormat="HH:mm"
                  timeFormat="HH:mm"
                  className="custom-timepicker"
                  placeholderText="--Pilih Waktu--"
                />
              </Row>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              style={{ marginRight: "7px" }}
              onClick={this.toggle}
            >
              Kembali
            </Button>
            <Button
              style={{ backgroundColor: "#53ac69" }}
              onClick={() => this.confirmDateTime()}
            >
              Konfirmasi Pesanan
            </Button>
          </ModalFooter>
        </Modal>
        <Modal centered isOpen={ShippingModal} toggle={this.toggleShipping}>
          <ModalHeader
            toggle={this.toggleShipping}
            style={{ fontSize: "12px" }}
          >
            Lacak Pengiriman
          </ModalHeader>
          <ModalBody
            style={{
              maxHeight: "calc(100vh - 210px)",
              overflowY: "auto",
            }}
          >
            {tracking ? (
              <div>
                <div>
                  <FormGroup>
                    <Row>
                      <Col md="4">
                        <Label className="card-subtitle">
                          Status Pengiriman
                        </Label>
                      </Col>
                      <Col>
                        <Label
                          style={{
                            fontSize: "12px",
                            marginBottom: 0,
                            textTransform: "capitalize",
                          }}
                          className="status"
                        >
                          {tracking.status}
                        </Label>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col md="4">
                        <Label className="card-subtitle">ID Pengiriman</Label>
                      </Col>
                      <Col>
                        <Label
                          style={{
                            marginBottom: 0,
                            textTransform: "uppercase",
                          }}
                        >
                          {tracking.id}
                        </Label>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col md="4">
                        <Label className="card-subtitle">Layanan Kurir</Label>
                      </Col>
                      <Col>
                        <Label style={{ marginBottom: 0 }}>
                          {tracking.courier.company === "grab"
                            ? "GrabExpress Instant"
                            : "GoSend Instant"}
                        </Label>
                      </Col>
                    </Row>
                  </FormGroup>
                </div>
                <hr />
                <div>
                  <FormGroup>
                    <Row>
                      <Col md="4">
                        <Label className="card-subtitle">Nomor Resi</Label>
                      </Col>
                      <Col>
                        <Label style={{ marginBottom: 0 }}>
                          {tracking.courier.waybill_id}
                        </Label>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col md="4">
                        <Label className="card-subtitle">Nama Driver</Label>
                      </Col>
                      <Col>
                        <Label style={{ marginBottom: 0 }}>
                          {tracking.courier.name}
                        </Label>
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                      <Col md="4">
                        <Label className="card-subtitle">Nomor Telepon</Label>
                      </Col>
                      <Col>
                        <Label style={{ marginBottom: 0 }}>
                          {tracking.courier.phone}
                        </Label>
                      </Col>
                    </Row>
                  </FormGroup>
                  {tracking.courier.link ? (
                    <FormGroup>
                      <a
                        href={tracking.courier.link}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: "#f69d93",
                          fontSize: "15px",
                          textDecorationLine: "underline",
                        }}
                        className="card-subtitle"
                      >
                        Live Tracking
                      </a>
                    </FormGroup>
                  ) : null}
                </div>
                <hr />
                {tracking.courier.history.reverse().map((list, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        flexDirection: "row",
                        display: "flex",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "14px",
                          marginRight: "10px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "#f69d93",
                            width: "1.5px",
                            height:
                              (index === 0 &&
                                tracking.courier.history.length !== 1) ||
                              (index === tracking.courier.history.length - 1 &&
                                tracking.courier.history.length !== 1)
                                ? 28
                                : index === 0 &&
                                  tracking.courier.history.length === 1
                                ? 0
                                : 80,
                            position: "absolute",
                            marginTop: index === 0 ? 27 : 0,
                          }}
                        />
                        <div
                          style={{
                            backgroundColor: "#f69d93",
                            borderRadius: "1000px",
                            width: "14px",
                            height: "13px",
                            alignSelf: "center",
                          }}
                        />
                      </div>
                      <div style={{ width: "100%" }}>
                        <div style={{ flexDirection: "row" }}>
                          <Label
                            style={{
                              fontSize: "15px",
                              fontWeight: "bold",
                              color: "#f69d93",
                              width: "50%",
                              textTransform: "capitalize",
                              marginBottom: 0,
                            }}
                          >
                            {list.status}
                          </Label>
                          <Label
                            style={{
                              fontSize: "13px",
                              textAlign: "right",
                              width: "50%",
                              marginBottom: 0,
                            }}
                          >
                            {list.updated_at.substring(8, 10) +
                              "-" +
                              list.updated_at.substring(5, 7) +
                              "-" +
                              list.updated_at.substring(0, 4) +
                              " " +
                              list.updated_at.substring(11, 13) +
                              "." +
                              list.updated_at.substring(14, 16)}
                          </Label>
                        </div>
                        <Label
                          style={{
                            fontSize: "14px",
                            textAlign: "justify",
                            marginBottom: "0px",
                          }}
                        >
                          {list.note}
                        </Label>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  justifyContent: "center",
                  display: "flex",
                  marginBottom: "100px",
                  marginTop: "70px",
                }}
              >
                <Spinner color="primary" />
              </div>
            )}
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  updateStatusDetailLoading: state.PesananReducer.updateStatusDetailLoading,
  updateStatusDetailResult: state.PesananReducer.updateStatusDetailResult,
  updateStatusDetailError: state.PesananReducer.updateStatusDetailError,

  getDetailPesananLoading: state.PesananReducer.getDetailPesananLoading,
  getDetailPesananResult: state.PesananReducer.getDetailPesananResult,
  getDetailPesananError: state.PesananReducer.getDetailPesananError,

  createInvoiceLoading: state.InvoiceReducer.createInvoiceLoading,
  createInvoiceResult: state.InvoiceReducer.createInvoiceResult,
  createInvoiceError: state.InvoiceReducer.createInvoiceError,

  getAdminProfileLoading: state.ProfileReducer.getAdminProfileLoading,
  getAdminProfileResult: state.ProfileReducer.getAdminProfileResult,
  getAdminProfileError: state.ProfileReducer.getAdminProfileError,

  confirmPesananLoading: state.PesananReducer.confirmPesananLoading,
  confirmPesananResult: state.PesananReducer.confirmPesananResult,
  confirmPesananError: state.PesananReducer.confirmPesananError,

  requestPickUpLoading: state.PesananReducer.requestPickUpLoading,
  requestPickUpResult: state.PesananReducer.requestPickUpResult,
  requestPickUpError: state.PesananReducer.requestPickUpError,

  changeDeliveryDateLoading: state.PesananReducer.changeDeliveryDateLoading,
  changeDeliveryDateResult: state.PesananReducer.changeDeliveryDateResult,
  changeDeliveryDateError: state.PesananReducer.changeDeliveryDateError,

  finishPesananLoading: state.PesananReducer.finishPesananLoading,
  finishPesananResult: state.PesananReducer.finishPesananResult,
  finishPesananError: state.PesananReducer.finishPesananError,

  cancelPesananLoading: state.PesananReducer.cancelPesananLoading,
  cancelPesananResult: state.PesananReducer.cancelPesananResult,
  cancelPesananError: state.PesananReducer.cancelPesananError,

  siapDiambilLoading: state.PesananReducer.siapDiambilLoading,
  siapDiambilResult: state.PesananReducer.siapDiambilResult,
  siapDiambilError: state.PesananReducer.siapDiambilError,

  lacakPengirimanLoading: state.PesananReducer.lacakPengirimanLoading,
  lacakPengirimanResult: state.PesananReducer.lacakPengirimanResult,
  lacakPengirimanError: state.PesananReducer.lacakPengirimanError,
});

export default connect(mapStateToProps, null)(DetailPesanan);
