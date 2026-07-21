// Catches broken page renders and shows a retry path.
import { Component } from "react";
import StatusPage from "../../../pages/StatusPage.jsx";
import { reportFrontendError } from "../../../utils/errorReporting.js";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    reportFrontendError(error, { componentStack: info?.componentStack });
  }

  render() {
    if (this.state.hasError) {
      return <StatusPage code="500" title="Something went wrong" message="The page could not render. Please retry." retry />;
    }
    return this.props.children;
  }
}




