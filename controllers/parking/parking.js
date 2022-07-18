import mongoose from "mongoose";
import { Parking_details } from "../../models";
import ejs from "ejs";
import pdf from "pdf-creator-node";
import path from "path";
import fs from "fs";
import { error } from "console";

// let parking = [
//   {
//     customer_name: "imran",
//     vehicle_number: "AS15M777",
//   },
//   {
//     customer_name: "Baharul",
//     vehicle_number: "AS15M777",
//   },
// ];

const parkingController = {
  async get(req, res, next) {
    const parking = await Parking_details.find();
    res.status(201).json({
      success: true,
      parking,
    });
  },

  // post data with generated pdf file----------------

  async post(req, res, next) {
    const parking = await Parking_details.create(req.body);
    const id = mongoose.Types.ObjectId(req._id);
    console.log(id);

    // const get = await Parking_details.findById({ _id: Id });

    res.status(201).json({
      success: true,
      parking,
    });
    if (parking) {
      const options = {
        height: "11.25in",
        width: "8.5in",
        header: {
          height: "20mm",
        },
        footer: {
          height: "20mm",
        },
      };
      const __dirname = path.resolve(path.dirname("./views/ticket.html"));
      console.log(__dirname);
      const html = fs.readFileSync(
        path.join(__dirname, "../views/ticket.html"),
        "utf-8"
      );
      const filename = Math.random() + "_doc" + ".pdf";
      // console.log(filename);
      let array = [];

      const document = {
        html: html,
        data: {
          parking: parking,
        },

        path: "./docs/" + filename,
      };
      pdf
        .create(document, options)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
      const filepath = "http://localhost:3500/docs/" + filename;

      // res.render("download", {
      //   path: filepath,
      // });
      // },

      res.render("download", {
        path: filepath,
      });
    }
  },

  // get parking---------------
  async get(req, res, next) {
    const parking = await Parking_details.find().sort({ createdAt: -1 });
    res.status(201).json({
      success: true,
      parking,
    });
  },

  // delete parking----------------
  async delete(req, res, next) {
    const { id } = req.params;
    const parking = await Parking_details.findByIdAndDelete(id);
    if (!parking) {
      return next("Error deleted");
    }
    res.status(201).json({ success: true, data: parking });
  },

  // update parking-----------------
  async update(req, res, next) {
    const { id } = req.params;
    const parking = await Parking_details.findByIdAndUpdate(
      {
        _id: id,
      },
      req.body
    );
    res.status(201).json({ success: true, updated: true, parking });
  },

  async getParkingCount(req, res, next) {
    const count = await Parking_details.count();
    if (count) {
      res.status(201).json({ success: true, count });
    }
  },

  // pdf generate------------------------
  // async pdf(req, res, next) {
  //   res.render("ticket", {
  //     parking: parking,
  //   });
  //   //  ejs.renderFile("./views/ticket.ejs");
  //   pdf.create(data, options).toFile("ticket.ejs", function (err, data) {
  //     if (err) {
  //       res.send(err);
  //     } else {
  //       res.send("File Created Successfully");
  //     }
  //   });
  // },

  // generate pdf--------------->
  // async pdf(req, res, next) {
  //   const options = {
  //     height: "11.25in",
  //     width: "8.5in",
  //     header: {
  //       height: "20mm",
  //     },
  //     footer: {
  //       height: "20mm",
  //     },
  //   };
  //   // const parking = [
  //   //   {
  //   //     customer_name: "imran",
  //   //     mobile_number: "8639014754",
  //   //   },
  //   // ];

  //   const parking = await Parking_details.findOne().sort({
  //     createdAt: -1,
  //   });
  //   // res.status(201).json({
  //   //   parking,
  //   // });
  //   console.log(parking);
  //   const __dirname = path.resolve(path.dirname("./views/ticket.html"));
  //   console.log(__dirname);
  //   const html = fs.readFileSync(
  //     path.join(__dirname, "../views/ticket.html"),
  //     "utf-8"
  //   );
  //   const filename = Math.random() + "_doc" + ".pdf";
  //   // console.log(filename);
  //   let array = [];

  //   const document = {
  //     html: html,
  //     data: {
  //       parking: parking,
  //     },

  //     path: "./docs/" + filename,
  //   };

  //   pdf
  //     .create(document, options)
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  //   const filepath = "http://localhost:3500/docs" + filename;
  //   console.log(filepath);
  // res.render("download", {
  //   path: filepath,
  // });
  // },
};

export default parkingController;
