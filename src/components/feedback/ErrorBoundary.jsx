// Catches broken page renders and shows a retry path.
import { Component } from "react";
import StatusPage from "../../pages/StatusPage.jsx";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Frontend error logging placeholder: connect Sentry, LogRocket, or your monitoring service here.
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return <StatusPage code="500" title="Something went wrong" message="The page could not render. Please retry." retry />;
    }
    return this.props.children;
  }
}
