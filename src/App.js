import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import './App.css';

class App extends Component {
  render() {
    const { showTypeQuery, allBooksQuery } = this.props;
    if (showTypeQuery.loading || allBooksQuery.loading) {
      return <h1>Loading....</h1>;
    }
    const books = allBooksQuery.allBooks.filter(item => {
      if (showTypeQuery.show_type === 'BELOW_17') {
        return item.price < 17;
      }
      return item.price >= 17;
    });
    return (
      <div>
        <h1>Bookstore</h1>
        {books.map(item => (
          <h3 key={item.id}>
            {item.title} - ${item.price}
          </h3>
        ))}
        <button onClick={() => this.changeShow('BELOW_17')}>Below $17</button>
        <button onClick={() => this.changeShow('ABOVE_17')}>Above $17</button>
      </div>
    );
  }
  changeShow = type => {
    this.props.mutate({
      variables: { show_type: type }
    });
  };
}

const allBooksQuery = gql`
  query allBooks {
    allBooks {
      id
      author
      title
      price
    }
  }
`;

const showTypeQuery = gql`
  query showTypeQuery {
    show_type @client
  }
`;

const showTypeMutation = gql`
  mutation showTypeMutation($show_type: String!) {
    changeShowType(show_type: $show_type) @client {
      show_type
    }
  }
`;


export default compose(
  graphql(showTypeQuery, { name: 'showTypeQuery' }),
  graphql(allBooksQuery, { name: 'allBooksQuery' }),
  graphql(showTypeMutation)
)(App);