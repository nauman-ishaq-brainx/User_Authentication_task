// controllers/test_file.js

import React, { useState, useEffect } from "react";

function User_list_component() { // ❌ Not camelCase (should be userListComponent)
  const [User_Data, set_User_Data] = useState([]); // ❌ Not camelCase
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data_response) => { // ❌ Not camelCase
        set_User_Data(data_response); // ❌ Not camelCase
        setIsLoading(false);
      })
      .catch((error_message) => { // ❌ Not camelCase
        console.error("Error fetching users:", error_message);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;

  return (
    <ul>
      {User_Data.map((User_Item) => ( // ❌ Not camelCase
        <li key={User_Item.id}>{User_Item.name}</li>
      ))}
    </ul>
  );
}

export default User_list_component;
