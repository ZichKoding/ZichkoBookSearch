import { gql } from '@apollo/client';

export const QUERY_ME = gql`
    query Me{
        me {
            _id
            username
            email
            bookCount
            savedBooks {
                _id
                bookId
                authors
                description
                image
                link
                title
            }
        }
    }
`;


export const QUERY_MY_BOOKS = gql`
    query Me{
        me {
            savedBooks {
                bookId
            }
        }
    }
`;
