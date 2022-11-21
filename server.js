import { ApolloServer, gql } from "apollo-server";

// package.json에서 "type":"module" 을 해줬기 때문에 import 문법을 쓸 수 있다.
// 아니면
// const {ApolloServer, gql} require("apollo-server") 이런 문법을 써야함.

//graphQl에게 type을 알려주기위해 Schema Definition Language를 쓴다. = SDL
// 아래처럼 타입을 지정해주는것은
// GET /text
// GET /hello 이렇게 만드는 것과 같다.
// rest API에서 GET request url을 노출시키는 것과 같다.
// 사용자가 뭔가를 요청하게하려면 type Query안에 있어야 한다.
const typeDefs = gql`
  type User {
    id: ID
    username: String
  }

  type Tweet {
    id: ID
    text: String
    author: User
  }

  type Query {
    allTweets: [Tweet]
    tweet(id: ID): Tweet
  }
`;

const server = new ApolloServer({ typeDefs });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
