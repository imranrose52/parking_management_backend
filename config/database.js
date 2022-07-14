// mongodb database connection---------------------
import mongoose from "mongoose";

const connectDatabase = () => {
  const url = `mongodb://${process.env.DB_URI}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(
        `Mongodb connected with server: ${data.connection.host} ${process.env.DB_NAME}`
      );
    });
};
export default connectDatabase;
