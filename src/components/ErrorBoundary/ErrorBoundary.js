import { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <h1>Sorry! Something went wrong</h1>
          <Link to="/search">Go back to the home page</Link>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
