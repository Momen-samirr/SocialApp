import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";
import {
  GetSuggestions,
  GetPublicProfile,
} from "../services/user.grpc.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load gRPC proto file
const PROTO_PATH = path.join(__dirname, "../grpc/user.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

// Initialize gRPC server
const startGrpcServer = () => {
  const server = new grpc.Server();

  // Add your gRPC services here
  server.addService(userProto.UserService.service, {
    GetSuggestions,
    GetPublicProfile,
  });

  const PORT = process.env.GRPC_PORT || "50051";
  server.bindAsync(
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error("Failed to start gRPC server:", err);
      } else {
        console.log(`gRPC Server is running on port ${port}`);
      }
    }
  );
};

export default startGrpcServer;
