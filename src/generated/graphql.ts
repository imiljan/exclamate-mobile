import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  /** Date custom scalar type */
  Date: any,
};




export type Mutation = {
  __typename?: 'Mutation',
  _?: Maybe<Scalars['Boolean']>,
  register: RegisterResponse,
  createPost: Post,
};


export type MutationRegisterArgs = {
  userData?: Maybe<RegisterInput>
};


export type MutationCreatePostArgs = {
  body: Scalars['String']
};

export type Post = {
  __typename?: 'Post',
  id: Scalars['ID'],
  body: Scalars['String'],
  created: Scalars['Date'],
  user: User,
};

export type Query = {
  __typename?: 'Query',
  _?: Maybe<Scalars['Boolean']>,
  hello: Scalars['String'],
  login: Token,
  me: User,
  getPost?: Maybe<Post>,
  getPosts: Array<Maybe<Post>>,
};


export type QueryLoginArgs = {
  username: Scalars['String'],
  password: Scalars['String']
};


export type QueryGetPostArgs = {
  id: Scalars['ID']
};

export type RegisterInput = {
  username: Scalars['String'],
  password: Scalars['String'],
  firstName: Scalars['String'],
  lastName: Scalars['String'],
  email: Scalars['String'],
};

export type RegisterResponse = {
  __typename?: 'RegisterResponse',
  user?: Maybe<User>,
  token?: Maybe<Scalars['String']>,
};

export type Token = {
  __typename?: 'Token',
  token: Scalars['String'],
};

export type User = {
  __typename?: 'User',
  id: Scalars['ID'],
  username: Scalars['String'],
  firstName: Scalars['String'],
  lastName: Scalars['String'],
  email: Scalars['String'],
  posts?: Maybe<Array<Post>>,
};
export type LoginUserQueryVariables = {
  username: Scalars['String'],
  password: Scalars['String']
};


export type LoginUserQuery = (
  { __typename?: 'Query' }
  & { login: (
    { __typename?: 'Token' }
    & Pick<Token, 'token'>
  ) }
);

export type RegisterUserMutationVariables = {
  input: RegisterInput
};


export type RegisterUserMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'RegisterResponse' }
    & Pick<RegisterResponse, 'token'>
    & { user: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'lastName' | 'firstName' | 'email'>
    )> }
  ) }
);

export type HomePagePostsQueryVariables = {};


export type HomePagePostsQuery = (
  { __typename?: 'Query' }
  & { getPosts: Array<Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'body' | 'created'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'firstName' | 'lastName' | 'email'>
    ) }
  )>> }
);

export const LoginUserDocument = gql`
    query LoginUser($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    token
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LoginUserGQL extends Apollo.Query<LoginUserQuery, LoginUserQueryVariables> {
    document = LoginUserDocument;
    
  }
export const RegisterUserDocument = gql`
    mutation RegisterUser($input: RegisterInput!) {
  register(userData: $input) {
    user {
      id
      username
      lastName
      firstName
      email
    }
    token
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RegisterUserGQL extends Apollo.Mutation<RegisterUserMutation, RegisterUserMutationVariables> {
    document = RegisterUserDocument;
    
  }
export const HomePagePostsDocument = gql`
    query homePagePosts {
  getPosts {
    id
    body
    created
    user {
      id
      username
      firstName
      lastName
      email
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class HomePagePostsGQL extends Apollo.Query<HomePagePostsQuery, HomePagePostsQueryVariables> {
    document = HomePagePostsDocument;
    
  }