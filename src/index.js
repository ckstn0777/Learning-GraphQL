import { ApolloServer } from "apollo-server-express";
import expressPlayground from "graphql-playground-middleware-express";

import express from "express";
import resolvers from "./resolvers";
import { readFileSync } from "fs";
import { MongoClient } from "mongodb";

require("dotenv").config();
const typeDefs = readFileSync("./typeDefs.graphql", "UTF-8");

async function start() {
  const app = express();
  const MONGO_DB = process.env.DB_HOST;
  let db;

  try {
    const client = await MongoClient.connect(MONGO_DB, {
      useNewUrlParser: true,
    });
    db = client.db();
  } catch (err) {
    console.log(err);
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: { db },
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
}

start();
