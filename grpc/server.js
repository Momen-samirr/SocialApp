import connectDB from "./lib/connectDB.js";
import startGrpcServer from "./utilities/grpcServer.js";

// Start the gRPC server
startGrpcServer();
connectDB();
