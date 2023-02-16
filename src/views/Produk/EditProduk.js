// import React, { Component } from "react";
// import { connect } from "react-redux";
// import { Link } from "react-router-dom";
// import {
//   Button,
//   Card,
//   CardBody,
//   CardHeader,
//   CardTitle,
//   Col,
//   FormGroup,
//   Input,
//   Label,
//   Row,
//   Spinner,
// } from "reactstrap";
// import { updateBanner, getDetailBanner } from "actions/BannerAction";
// import DefaultImage from "../../assets/img/default-image.jpg";
// import Swal from "sweetalert2";
// import { getDetailProduk } from "actions/ProdukAction";

// class EditProduk extends Component {
//   constructor(props) {
//     super(props);
//     //Deklarasi state atau variable awal
//     this.state = {
//       id: this.props.match.params.id,
//       imageLama: DefaultImage,
//       image: DefaultImage,
//       imageToDB: false,
//       judulBanner: "",
//       deskripsiBanner: "",
//       active: true,
//     };
//   }

//   componentDidMount() {
//     this.props.dispatch(getDetailProduk(this.props.match.params.id));
//   }

//   //Dijalankan ketika nama Banner diisi
//   handleChange = (event) => {
//     let updatedValue = event.target.value;
//     if (updatedValue === "true" || updatedValue === "false") {
//       updatedValue = JSON.parse(updatedValue);
//     }
//     this.setState({
//       [event.target.name]: updatedValue,
//     });
//   };

//   //Dijalankan ketika upload files
//   handleImage = (event) => {
//     //Jika event.target.files dan array ke 0nya bernilai true
//     if (event.target.files && event.target.files[0]) {
//       //Ukuran file maksimal 2MB
//       if (event.target.files[0].size <= 2000000) {
//         const gambar = event.target.files[0];
//         this.setState({
//           image: URL.createObjectURL(gambar),
//           imageToDB: gambar,
//         });
//       } else {
//         Swal.fire({
//           title: "Error",
//           text: "Maaf, ukuran file maksimal adalah 2MB!",
//           icon: "error",
//           confirmButtonColor: "#f69d93",
//           confirmButtonText: "OK",
//         });
//       }
//     }
//   };

//   //Dijalankan ketika tombol submit di klik
//   handleSubmit = (event) => {
//     const { judulProduk, deskripsiProduk, imageToDB } = this.state;
//     event.preventDefault();
//     if (judulProduk && deskripsiProduk) {
//       if (imageToDB) {
//         if (
//           imageToDB.name.slice(-4) === ".png" ||
//           imageToDB.name.slice(-4) === ".jpg" ||
//           imageToDB.name.slice(-5) === ".jpeg"
//         ) {
//           this.props.dispatch(updateBanner(this.state));
//         } else {
//           Swal.fire({
//             title: "Error",
//             text: "Maaf, gambar harus dalam format .png, .jpeg, atau .jpg !",
//             icon: "error",
//             confirmButtonColor: "#f69d93",
//             confirmButtonText: "OK",
//           });
//         }
//       } else {
//         this.props.dispatch(updateBanner(this.state));
//       }
//     } else {
//       Swal.fire({
//         title: "Error",
//         text: "Maaf, seluruh data harus diisi!",
//         icon: "error",
//         confirmButtonColor: "#f69d93",
//         confirmButtonText: "OK",
//       });
//     }
//   };

//   //Jika proses tambah banner ke firebse database berhasil
//   componentDidUpdate(prevProps) {
//     const { updateProdukResult, getDetailProdukResult } = this.props;

//     if (
//       updateProdukResult &&
//       prevProps.updateProdukResult !== updateProdukResult
//     ) {
//       Swal.fire({
//         title: "Sukses",
//         text: "Banner Sukses Diupdate!",
//         icon: "success",
//         confirmButtonColor: "#f69d93",
//         confirmButtonText: "OK",
//       });
//       this.props.history.push("/admin/Produk");
//     }

//     if (
//       getDetailProdukResult &&
//       prevProps.getDetailProdukResult !== getDetailProdukResult
//     ) {
//       this.setState({
//         image: getDetailProdukResult.gambar,
//         judulBanner: getDetailProdukResult.title,
//         deskripsiBanner: getDetailProdukResult.deskripsi,
//         active: getDetailProdukResult.active,
//         imageLama: getDetailProdukResult.gambar,
//       });
//     }
//   }

//   render() {
//     const { image, judulProduk, deskripsiProduk, active } = this.state;
//     const { updateProdukLoading } = this.props;
//     return (
//       <div className="content">
//         <Row>
//           <Col>
//             <Link to="/admin/banner" className="btn btn-primary">
//               <i className="nc-icon nc-minimal-left" /> Kembali
//             </Link>
//           </Col>
//         </Row>
//         <Row>
//           <Col md="12">
//             <Card>
//               <CardHeader>
//                 <CardTitle tag="h4">Edit Produk</CardTitle>
//               </CardHeader>
//               <CardBody>
//                 <Row>
//                   <Col md={10}>
//                     <img src={image} width="200" alt="Banner" />
//                     <FormGroup>
//                       <label>Gambar Banner</label>
//                       <Input
//                         type="file"
//                         onChange={(event) => this.handleImage(event)}
//                       />
//                       <Label style={{ color: "red" }}>
//                         Gambar harus dalam format .png, .jpeg, atau .jpg (ukuran
//                         ideal: 1958 x 725 pixel). Ukuran file maksimal adalah
//                         2MB.
//                       </Label>
//                     </FormGroup>
//                     <FormGroup>
//                       <label>Judul Banner</label>
//                       <Input
//                         type="text"
//                         value={judulBanner}
//                         name="judulBanner"
//                         onChange={(event) => this.handleChange(event)}
//                       />
//                     </FormGroup>
//                     <FormGroup>
//                       <label>Status</label>
//                       <Input
//                         type="select"
//                         name="active"
//                         value={active}
//                         onChange={(event) => this.handleChange(event)}
//                       >
//                         <option value={true}>Aktif</option>
//                         <option value={false}>Tidak Aktif</option>
//                       </Input>
//                     </FormGroup>
//                     <FormGroup>
//                       <label>Deskripsi Banner</label>
//                       <Input
//                         type="textarea"
//                         style={{
//                           maxHeight: 2000,
//                           resize: "inherit",
//                           height: 300,
//                         }}
//                         value={deskripsiBanner}
//                         name="deskripsiBanner"
//                         onChange={(event) => this.handleChange(event)}
//                       />
//                     </FormGroup>
//                   </Col>
//                 </Row>
//                 <form onSubmit={(event) => this.handleSubmit(event)}>
//                   <Row>
//                     <Col md={6}>
//                       <FormGroup></FormGroup>
//                     </Col>
//                     <Col md={3}></Col>
//                   </Row>
//                   <Row>
//                     <Col>
//                       {updateBannerLoading ? (
//                         <Button color="primary" type="submit" disabled>
//                           <Spinner size="sm" color="light" /> Loading
//                         </Button>
//                       ) : (
//                         <Button color="primary" type="submit">
//                           Submit
//                         </Button>
//                       )}
//                     </Col>
//                   </Row>
//                 </form>
//               </CardBody>
//             </Card>
//           </Col>
//         </Row>
//       </div>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   updateProdukLoading: state.ProdukReducer.updateProdukLoading,
//   updateProdukResult: state.ProdukReducer.updateProdukResult,
//   updateProdukError: state.ProdukReducer.updateProdukError,

//   getDetailProdukLoading: state.ProdukReducer.getDetailProdukLoading,
//   getDetailProdukResult: state.ProdukReducer.getDetailProdukResult,
//   getDetailProdukError: state.ProdukReducer.getDetailProdukError,
// });

// export default connect(mapStateToProps, null)(EditProduk);