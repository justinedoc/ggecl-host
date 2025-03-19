import { useAuthentication } from "@/hooks/useAuthentication";

const Example = () => {
  const {
    isLoading,
    isAuthenticated,
    studentLogout,
    refreshAccessToken,
    getAccessToken,
  } = useAuthentication();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{isAuthenticated ? "Authenticated" : "Not Authenticated"}</h1>
      <p>Current Token: {getAccessToken() || "None"}</p>
      <button onClick={studentLogout}>Logout</button>
      <button
        onClick={async () => {
          const newToken = await refreshAccessToken();
          alert(`New token: ${newToken}`);
        }}
      >
        Refresh Token
      </button>
    </div>
  );
};

export default Example;
