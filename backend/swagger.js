import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Open RAG API",
    description: "API documentation for Open Source RAG",
  },
  host: "localhost:8000",
  schemes: ["http"],
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
