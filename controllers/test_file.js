// src/components/UserList.jsx
import React, { useState, useEffect } from "react";

export default function UserList() {
  const [users, SetUsers] = useState();
  const [loading, setLoading] = useState(false);
    console.log("users", users);
  useEffect(() => {
    setLoading(true);
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  // ❌ No error handling
  // ❌ Missing key prop
  // ❌ Inline styles and inconsistent naming
  // ❌ Unnecessary re-renders due to missing dependency
  // ❌ No fallback UI or error boundary usage

  return (
    <div style={{ padding: "20px" }}>
      <h2>User List</h2>
      {users.map((user) => (
        <div>
          <p>{user.name}</p>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}
