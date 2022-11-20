import { ApolloServer, gql } from "apollo-server";

// package.json에서 "type":"module" 을 해줬기 때문에 import 문법을 쓸 수 있다.
// 아니면
// const {ApolloServer, gql} require("apollo-server") 이런 문법을 써야함.

const server = new ApolloServer({});

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
