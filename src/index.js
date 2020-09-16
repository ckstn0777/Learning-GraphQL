import { ApolloServer } from "apollo-server-express";
import expressPlayground from "graphql-playground-middleware-express";

import express from "express";
import resolvers from "./resolvers";
import { readFileSync } from "fs";

const app = express();

const typeDefs = readFileSync("./typeDefs.graphql", "UTF-8");
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app });

app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

app.get("/", (req, res) => {
  res.end("PhotoShar API에 오신것을 환영합니다.");
});

app.listen({ port: 4000 }, () => {
  console.log(
    `GraphQL Server running http://localhost:4000${server.graphqlPath}`
  );
});
