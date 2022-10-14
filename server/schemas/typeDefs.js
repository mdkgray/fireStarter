const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    github: String
    linkedin: String
    skills: String
    projects: [Project]
  }

  type Project {
    _id: ID!
    title: String!
    overview: String!
    description: String!
    createdAt: Date
    gitRepo: String!
    fundingGoal: Number!
    currentFunds: Number!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    projects(username: String): [Project]
    project(projectId: ID!): Project
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    updateProfile(firstName: String!, lastName: String!, github: String, linkedin: String, skills: String): Auth
    addProject(title: String!, description: String!): Project
    removeProject(projectId: ID!): Project
  }
`;

module.exports = typeDefs;
