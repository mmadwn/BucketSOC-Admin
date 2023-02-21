import React, { Component } from "react";
import { Row, Col } from "reactstrap";

export default class Item extends Component {
  render() {
    const { item } = this.props;
    return (
      <div>
        {Object.keys(item).map((key, index) => {
          return (
            <div key={key} style={{ marginBottom: index !== Object.keys(item).length - 1 ? "20px" : 0 }}>
              <div
                style={{
                  width: "60px",
                }}
              >
                <img
                  src={item[key].produk.gambar[0]}
                  alt={item[key].produk.nama}
                />
              </div>
              <label>
                <label style={{ fontWeight: 'bold', textAlign: 'justify'}}>{item[key].produk.nama}</label>
                <br />
                <label style={{ fontWeight: 'bold', textAlign: 'justify'}}>Harga : </label> Rp{item[key].produk.harga.toLocaleString("id-ID")}
                <br />
                <label style={{ fontWeight: 'bold', textAlign: 'justify'}}>Jumlah : </label>  {item[key].jumlah}
                <br />
                <label style={{ fontWeight: 'bold', textAlign: 'justify'}}>Total Harga : </label> Rp
                {item[key].total_harga.toLocaleString("id-ID")}
              </label>
            </div>
          );
        })}
      </div>
    );
  }
}
