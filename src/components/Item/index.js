import React, { Component } from "react";

export default class Item extends Component {
  render() {
    const { item } = this.props;
    return (
      <div>
        {Object.keys(item).map((key, index) => {
          return (
            <div
              key={key}
              style={{
                marginBottom:
                  index !== Object.keys(item).length - 1 ? "20px" : 0,
              }}
            >
              <div
                style={{
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <img
                  width="60px"
                  height="60px"
                  src={item[key].produk.gambar[0]}
                  alt={""}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://i.ibb.co/LxRv167/default-image.jpg";
                  }}
                />
              </div>
              <label>
                <label style={{ fontWeight: "bold", textAlign: "justify" }}>
                  {item[key].produk.nama}
                </label>
                <br />
                <label style={{ fontWeight: "bold", textAlign: "justify" }}>
                  Harga :{" "}
                </label>{" "}
                Rp{item[key].produk.harga.toLocaleString("id-ID")}
                <br />
                <label style={{ fontWeight: "bold", textAlign: "justify" }}>
                  Jumlah :{" "}
                </label>{" "}
                {item[key].jumlah}
                <br />
                <label style={{ fontWeight: "bold", textAlign: "justify" }}>
                  Total Harga :{" "}
                </label>{" "}
                Rp
                {item[key].total_harga.toLocaleString("id-ID")}
              </label>
              {index !== Object.keys(item).length - 1 ? (
                <hr style={{ margin: 0, backgroundColor: "#d9d9d9" }} />
              ) : null}
            </div>
          );
        })}
      </div>
    );
  }
}
