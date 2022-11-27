import { ApolloServer, gql } from "apollo-server";

const tweets = [
  {
    id: "1",
    text: "first",
    userId: "2",
  },
  {
    id: "2",
    text: "second",
    userId: "1",
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

  """
  트윗 객체를 설명하는 글.
  """
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
  Query: {
    allTweets() {
      return tweets;
    },

    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },

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
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
