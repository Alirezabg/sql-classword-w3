const express = require("express");
const { Pool } = require("pg");
const app = express();
app.use(express.json());
const pool = new Pool({
  user: "ali",
  database: "cyf_hotels",
  host: "localhost",
  password: "admin",
  port: 5432,
});
app.get("/bookings", (req, res) => {
  return pool
    .query("SELECT * FROM bookings")
    .then((result) => res.send(result))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});
app.post("/hotels", function (req, res) {
  const newHotelName = req.body.name;
  const newHotelRooms = req.body.rooms;
  const newHotelPostcode = req.body.postcode;

  if (!Number.isInteger(newHotelRooms) || newHotelRooms <= 0) {
    return res
      .status(400)
      .send(
        "The number of rooms should be a positive integer. Found " + req.body
      );
  }

  pool
    .query("SELECT * FROM hotels WHERE name=$1", [newHotelName])
    .then((result) => {
      if (result.rows.length > 0) {
        return res
          .status(400)
          .send("An hotel with the same name already exists!");
      } else {
        const query =
          "INSERT INTO hotels (name, rooms, postcode) VALUES ($1, $2, $3)";
        pool
          .query(query, [newHotelName, newHotelRooms, newHotelPostcode])
          .then(() => res.send("Hotel created!"))
          .catch((error) => {
            console.error(error);
            res.status(500).json(error);
          });
      }
    });
});
app.get("/customers/:customerId", (req, res) => {
  const customerId = req.params.customerId;
  return pool
    .query("SELECT *  FROM customers where id = " + customerId)
    .then((result) => res.send(result))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});
app.get("/customers", (req, res) => {
  return pool
    .query("SELECT * FROM customers")
    .then((result) => res.send(result))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});
app.get("/hotels", (req, res) => {
  return pool
    .query("SELECT *  FROM hotels")
    .then((result) => res.send(result))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});
app.get("/hotels/:hotelId", (req, res) => {
  const hotelId = req.params.hotelId;
  return pool
    .query("SELECT *  FROM hotels where id = " + hotelId)
    .then((result) => res.send(result))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});
app.put("/customers/:customerId", (req, res) => {
  const customersId = req.params.customersId;
  const {
    new_name,
    new_email,
    new_address,
    new_city,
    new_postcode,
    new_country,
  } = req.body;
  if (!Number.isInteger(customersId) || customersId <= 0) {
    return res
      .status(400)
      .send(
        "The CUSTOMER of rooms should be a positive integer. Found " + req.body
      );
  }
  pool
    .query("SELECT * FROM customers WHERE name=$1", [newHotelName])
    .then((result) => {
      if (result.rows.length > 0) {
        return res
          .status(400)
          .send("An hotel with the same name already exists!");
      } else {
        return pool
          .query(
            `Update customers set name = ${new_name} , email = ${new_email} , address=${new_address} , city= ${new_city}, postcode =${new_postcode} , country = ${new_country} where id = ` +
              customersId
          )
          .then((result) => res.send(result))
          .catch((error) => {
            console.error(error);
            res.status(500).json(error);
            d;
          });
      }
    });
});

app.delete("/customers/:customerId", (req, res) => {
  const customerId = req.params.customerId;
  console.log("I'm here");

  pool
    .query("DELETE  FROM customers WHERE id=$1", [customerId])
    .then(() => res.send("customer deleted!"))
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
});

// app.get("/customers/:customerId/bookings", (req, res) => {
//   const customerId = req.params.customerId;
//   return pool
//     .query(
//       "SELECT *  FROM customers where id = " +
//         customerId +
//         " inner join booking on customers.id = booking.customer_id"
//     )
//     .then((result) => res.send(result))
//     .catch((error) => {
//       console.error(error);
//       res.status(500).json(error);
//     });
// });
app.listen(3000, () => {
  console.log(`Server running on port: 3000`);
});
