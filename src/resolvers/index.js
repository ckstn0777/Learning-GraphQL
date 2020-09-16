import { GraphQLScalarType } from "graphql";

let _id = 0;
const users = [
  {
    githubLogin: "ckstn0777",
    name: "ckstn",
  },
  {
    githubLogin: "gildong0878",
    name: "gildong hong",
  },
  {
    githubLogin: "incheon0897",
    name: "incheon univ",
  },
];
const photos = [
  {
    id: "1",
    name: "Test 1",
    description: "Test Photo 1",
    category: "GRAPHIC",
    created: "3-28-1977",
    githubLogin: "ckstn0777",
  },
  {
    id: "2",
    name: "Test 2",
    description: "Test Photo 2",
    category: "SELFIE",
    created: "1-2-1985",
    githubLogin: "gildong0878",
  },
  {
    id: "3",
    name: "Test 3",
    description: "Test Photo 3",
    category: "PORTRAIT",
    created: "2019/05/16/17:22:10",
    githubLogin: "gildong0878",
  },
];

const tags = [
  { photoID: "1", userID: "ckstn0777" },
  { photoID: "2", userID: "gildong0878" },
  { photoID: "2", userID: "incheon0897" },
  { photoID: "2", userID: "ckstn0777" },
];

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos,
  },

  Mutation: {
    postPhoto: (parent, args) => {
      _id += 1;
      const newPhoto = {
        id: _id,
        ...args.input,
        created: new Date(),
      };
      photos.push(newPhoto);
      return newPhoto;
    },
  },
  User: {
    postedPhotos: (parent) => {
      // filter : 조건에 만족하는 모든 요소를 모아 새로운 배열로 반환
      return photos.filter((p) => p.githubLogin === parent.githubLogin);
    },
    inPhotos: (parent) => {
      return tags
        .filter(tag.userID === parent.id)
        .map((tag) => tag.photoID)
        .map((photoID) => photos.find((p) => p.id === photoID));
    },
  },
  Photo: {
    url: (parent) => `http://yoursite.com/img/${parent.id}.jpg`,
    postedBy: (parent) => {
      // find : 조건에 만족하는 첫번째 요소의 값을 반환
      return users.find((u) => u.githubLogin === parent.githubLogin);
    },
    taggedUsers: (parent) => {
      return tags
        .filter((tag) => tag.photoID === parent.id)
        .map((tag) => tag.userID)
        .map((userID) => users.find((u) => u.githubLogin === userID));
    },
  },
  DateTime: new GraphQLScalarType({
    name: "DateTime",
    description: "A valid date time value",
    parseValue: (value) => new Date(value),
    serialize: (value) => new Date(value).toISOString(),
    parseLiteral: (ast) => ast.value,
  }),
};

export default resolvers;
