import { ApolloServer, gql } from "apollo-server";

// package.json에서 "type":"module" 을 해줬기 때문에 import 문법을 쓸 수 있다.
// 아니면
// const {ApolloServer, gql} require("apollo-server") 이런 문법을 써야함.

const tweets = [
  {
    id: "1",
    text: "first",
  },
  {
    id: "2",
    text: "second",
  },
];

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
  }

  type Tweet {
    id: ID!
    text: String!
    author: User
  }

  type Query {
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    ping: String!
  }

  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;

const resolvers = {
  // 누군가 field를 요청했을 때 실제로 호출될 함수.
  Query: {
    allTweets() {
      return tweets;
    },
    // tweet() {
    //   console.log("I'm called");
    //   return null;
    // },
    // ping() {
    //   return "pong";
    // },
    tweet(root, { id }) {
      // console.log(args, "args");
      return tweets.find((tweet) => tweet.id === id);
    },
    //args는 유저가 보낸 argument
    //apollo server가 resolver를 부를때 root 인자를 줌.
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
      };
      tweets.push(newTweet);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
