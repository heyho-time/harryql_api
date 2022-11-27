import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";

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
    allMovies: [Movie!]!
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    ping: String!
    movie(id: String!): Movie
  }

  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }

  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
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
    allMovies() {
      return fetch("https://yts.mx/api/v2/list_movies.json")
        .then((res) => res.json())
        .then((json) => json.data.movies);
    },
    movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then((res) => res.json())
        .then((json) => json.data.movie);
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
