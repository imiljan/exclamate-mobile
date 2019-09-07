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



export type Comment = {
  __typename?: 'Comment',
  id: Scalars['ID'],
  body: Scalars['String'],
  created: Scalars['Date'],
  user: User,
};


export type Mutation = {
  __typename?: 'Mutation',
  _?: Maybe<Scalars['Boolean']>,
  register: RegisterResponse,
  follow: Scalars['Boolean'],
  unfollow: Scalars['Boolean'],
  createPost: Post,
  deletePost: Scalars['Boolean'],
  editPost: Post,
  createComment: Comment,
};


export type MutationRegisterArgs = {
  userData?: Maybe<RegisterInput>
};


export type MutationFollowArgs = {
  userId: Scalars['ID']
};


export type MutationUnfollowArgs = {
  userId: Scalars['ID']
};


export type MutationCreatePostArgs = {
  body: Scalars['String']
};


export type MutationDeletePostArgs = {
  postId: Scalars['ID']
};


export type MutationEditPostArgs = {
  postId: Scalars['ID'],
  body: Scalars['String']
};


export type MutationCreateCommentArgs = {
  postId: Scalars['Int'],
  body: Scalars['String']
};

export type Post = {
  __typename?: 'Post',
  id: Scalars['ID'],
  body: Scalars['String'],
  created: Scalars['Date'],
  user: User,
  comments: Array<Maybe<Comment>>,
  likes: Scalars['Int'],
};

export type Query = {
  __typename?: 'Query',
  _?: Maybe<Scalars['Boolean']>,
  login: Token,
  me: User,
  getUser?: Maybe<User>,
  getUsers: Array<Maybe<User>>,
  canFollow: Scalars['Boolean'],
  getPost?: Maybe<Post>,
  getPosts: Array<Maybe<Post>>,
};


export type QueryLoginArgs = {
  username: Scalars['String'],
  password: Scalars['String']
};


export type QueryGetUserArgs = {
  id: Scalars['ID']
};


export type QueryGetUsersArgs = {
  searchParam: Scalars['String']
};


export type QueryCanFollowArgs = {
  userId: Scalars['ID']
};


export type QueryGetPostArgs = {
  id: Scalars['ID']
};


export type QueryGetPostsArgs = {
  offset?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>
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
  joinedDate?: Maybe<Scalars['Date']>,
  location?: Maybe<Scalars['String']>,
  bio?: Maybe<Scalars['String']>,
  posts?: Maybe<Array<Maybe<Post>>>,
  following?: Maybe<Scalars['Int']>,
  followers?: Maybe<Scalars['Int']>,
};
export type MeCacheQueryVariables = {};


export type MeCacheQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
  ) }
);

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

export type PostPageQueryQueryVariables = {
  id: Scalars['ID']
};


export type PostPageQueryQuery = (
  { __typename?: 'Query' }
  & { getPost: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'body' | 'created' | 'likes'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'firstName' | 'lastName' | 'email'>
    ), comments: Array<Maybe<(
      { __typename?: 'Comment' }
      & Pick<Comment, 'id' | 'body' | 'created'>
      & { user: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'username' | 'email' | 'firstName' | 'lastName'>
      ) }
    )>> }
  )> }
);

export type CommentMutationVariables = {
  postId: Scalars['Int'],
  body: Scalars['String']
};


export type CommentMutation = (
  { __typename?: 'Mutation' }
  & { createComment: (
    { __typename?: 'Comment' }
    & Pick<Comment, 'id' | 'body' | 'created'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'email' | 'firstName' | 'lastName'>
    ) }
  ) }
);

export type DeletePostMutationVariables = {
  postId: Scalars['ID']
};


export type DeletePostMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deletePost'>
);

export type EditPostMutationVariables = {
  postId: Scalars['ID'],
  body: Scalars['String']
};


export type EditPostMutation = (
  { __typename?: 'Mutation' }
  & { editPost: (
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'body'>
  ) }
);

export type HomePagePostsQueryVariables = {
  limit?: Maybe<Scalars['Int']>,
  offset?: Maybe<Scalars['Int']>
};


export type HomePagePostsQuery = (
  { __typename?: 'Query' }
  & { getPosts: Array<Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'body' | 'created' | 'likes'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'firstName' | 'lastName' | 'email'>
    ) }
  )>> }
);

export type AddPostMutationVariables = {
  body: Scalars['String']
};


export type AddPostMutation = (
  { __typename?: 'Mutation' }
  & { createPost: (
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'body' | 'created' | 'likes'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'firstName' | 'lastName' | 'email'>
    ) }
  ) }
);

export type SearchPageQueryVariables = {
  searchParam: Scalars['String']
};


export type SearchPageQuery = (
  { __typename?: 'Query' }
  & { getUsers: Array<Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'firstName' | 'lastName'>
  )>> }
);

export type MyProfilePageQueryQueryVariables = {};


export type MyProfilePageQueryQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'firstName' | 'lastName' | 'email' | 'bio' | 'location' | 'joinedDate' | 'followers' | 'following'>
    & { posts: Maybe<Array<Maybe<(
      { __typename?: 'Post' }
      & Pick<Post, 'id' | 'body' | 'created' | 'likes'>
    )>>> }
  ) }
);

export type UserProfilePageQueryQueryVariables = {
  id: Scalars['ID']
};


export type UserProfilePageQueryQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'canFollow'>
  & { getUser: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'firstName' | 'lastName' | 'email' | 'bio' | 'location' | 'joinedDate' | 'followers' | 'following'>
    & { posts: Maybe<Array<Maybe<(
      { __typename?: 'Post' }
      & Pick<Post, 'id' | 'body' | 'created' | 'likes'>
    )>>> }
  )> }
);

export type FollowMutationVariables = {
  userId: Scalars['ID']
};


export type FollowMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'follow'>
);

export type UnfollowMutationVariables = {
  userId: Scalars['ID']
};


export type UnfollowMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'unfollow'>
);

export const MeCacheDocument = gql`
    query MeCache {
  me {
    id
    username
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MeCacheGQL extends Apollo.Query<MeCacheQuery, MeCacheQueryVariables> {
    document = MeCacheDocument;
    
  }
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
export const PostPageQueryDocument = gql`
    query PostPageQuery($id: ID!) {
  getPost(id: $id) {
    id
    body
    created
    likes
    user {
      id
      username
      firstName
      lastName
      email
    }
    comments {
      id
      body
      created
      user {
        id
        username
        email
        firstName
        lastName
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class PostPageQueryGQL extends Apollo.Query<PostPageQueryQuery, PostPageQueryQueryVariables> {
    document = PostPageQueryDocument;
    
  }
export const CommentDocument = gql`
    mutation Comment($postId: Int!, $body: String!) {
  createComment(postId: $postId, body: $body) {
    id
    body
    created
    user {
      id
      username
      email
      firstName
      lastName
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CommentGQL extends Apollo.Mutation<CommentMutation, CommentMutationVariables> {
    document = CommentDocument;
    
  }
export const DeletePostDocument = gql`
    mutation DeletePost($postId: ID!) {
  deletePost(postId: $postId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeletePostGQL extends Apollo.Mutation<DeletePostMutation, DeletePostMutationVariables> {
    document = DeletePostDocument;
    
  }
export const EditPostDocument = gql`
    mutation EditPost($postId: ID!, $body: String!) {
  editPost(postId: $postId, body: $body) {
    id
    body
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class EditPostGQL extends Apollo.Mutation<EditPostMutation, EditPostMutationVariables> {
    document = EditPostDocument;
    
  }
export const HomePagePostsDocument = gql`
    query homePagePosts($limit: Int, $offset: Int) {
  getPosts(limit: $limit, offset: $offset) @connection(key: "getPosts") {
    id
    body
    created
    likes
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
export const AddPostDocument = gql`
    mutation addPost($body: String!) {
  createPost(body: $body) {
    id
    body
    created
    likes
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
  export class AddPostGQL extends Apollo.Mutation<AddPostMutation, AddPostMutationVariables> {
    document = AddPostDocument;
    
  }
export const SearchPageDocument = gql`
    query searchPage($searchParam: String!) {
  getUsers(searchParam: $searchParam) {
    id
    username
    firstName
    lastName
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class SearchPageGQL extends Apollo.Query<SearchPageQuery, SearchPageQueryVariables> {
    document = SearchPageDocument;
    
  }
export const MyProfilePageQueryDocument = gql`
    query MyProfilePageQuery {
  me {
    id
    username
    firstName
    lastName
    email
    bio
    location
    joinedDate
    followers
    following
    posts {
      id
      body
      created
      likes
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MyProfilePageQueryGQL extends Apollo.Query<MyProfilePageQueryQuery, MyProfilePageQueryQueryVariables> {
    document = MyProfilePageQueryDocument;
    
  }
export const UserProfilePageQueryDocument = gql`
    query UserProfilePageQuery($id: ID!) {
  getUser(id: $id) {
    id
    username
    firstName
    lastName
    email
    bio
    location
    joinedDate
    followers
    following
    posts {
      id
      body
      created
      likes
    }
  }
  canFollow(userId: $id)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UserProfilePageQueryGQL extends Apollo.Query<UserProfilePageQueryQuery, UserProfilePageQueryQueryVariables> {
    document = UserProfilePageQueryDocument;
    
  }
export const FollowDocument = gql`
    mutation Follow($userId: ID!) {
  follow(userId: $userId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FollowGQL extends Apollo.Mutation<FollowMutation, FollowMutationVariables> {
    document = FollowDocument;
    
  }
export const UnfollowDocument = gql`
    mutation Unfollow($userId: ID!) {
  unfollow(userId: $userId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UnfollowGQL extends Apollo.Mutation<UnfollowMutation, UnfollowMutationVariables> {
    document = UnfollowDocument;
    
  }