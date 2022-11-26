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

let users = [
  {
    id: "1",
    firstName: "harry",
    lastName: "s",
  },
  {
    id: "2",
    firstName: "heyho",
    lastName: "yo",
  },
];

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
    fullName: String!
  }

  type Tweet {
    id: ID!
    text: String!
    author: User
  }

  type Query {
    allUsers: [User!]!
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

    allUsers() {
      console.log("allUsers called");
      return users;
    },
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
  User: {
    fullName(root) {
      console.log("full name called");
      console.log(root);
      return "hello";
    },
  },
};

// allUsers가 먼저 호출돼 allUsers called 출력,. users 데이터에 fullName field가 없는걸 알아채고 resolver의 fullName을 사용한다.

// 콘솔에 이렇게 찍힌다.
// allUsers called
// full name called
// { id: '1', firstName: 'harry', lastName: 's' }
// full name called
// { id: '2', firstName: 'heyho', lastName: 'yo' }
// allUsers called
// full name called
// { id: '1', firstName: 'harry', lastName: 's' }
// full name called
// { id: '2', firstName: 'heyho', lastName: 'yo' }

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
