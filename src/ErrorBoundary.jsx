import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("🔴 React Rendering Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ padding: 20, color: "red" }}>
        Something went wrong in UI.
      </div>;
    }
    return this.props.children;
  }
}
