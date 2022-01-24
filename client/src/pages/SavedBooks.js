import { useMutation, useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { getSavedBookIds, removeBookId, saveBookIds } from '../utils/localStorage';
import { REMOVE_BOOK } from '../utils/mutations';
import { QUERY_ME } from '../utils/queries';

const SavedBooks = () => {
  // setup query 
  const { data, loading } = useQuery(QUERY_ME);

  // setup mutation
  const [ removeBook, { error } ] = useMutation(REMOVE_BOOK)

  // extract userData
  const userData = data?.me;

  useEffect(() => {
    return () => {
      // if no books are saved to localStorage extract them and save to localStorage
      const usersBookDB = [];
      const savedBookIds = getSavedBookIds();
      if (savedBookIds.length === 0 && userData?.savedBooks.length > 0) {
        const userBookData = userData?.savedBooks;

        for (let i = 0; i < userBookData?.length; i++) {
          let userBD = userBookData[i]?.bookId;
          if (userBD) {
            // pull user's savedBooks' bookIds and store them in localStorage
            usersBookDB.push(userBD);
          }
        }

        saveBookIds(usersBookDB);
      }
    };
  });

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId }
      })

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
