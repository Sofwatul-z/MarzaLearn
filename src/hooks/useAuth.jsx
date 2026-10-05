// Single public hook for authentication.
// The provider itself lives in context/AuthContext.jsx so the app never creates
// two different authentication contexts.
export { useAuth } from "../context/AuthContext";
