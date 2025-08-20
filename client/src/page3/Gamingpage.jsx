import React from "react";
import { useQuery, gql } from "@apollo/client";

const GET_CHALLENGE = gql`
  query Get_challenge {
    Get_challenge {
      function_name
      problem_statement
    }
  }
`;

const Gamingpage = () => {
  const { data, loading, error, refetch } = useQuery(GET_CHALLENGE);

  if (loading) return <p>Loading challenge...</p>;
  if (error) return <p>Error: {error.message}</p>;
  // if (!data || !data.Get_challenge)
  //   return <p>No challenge available right now</p>;
  if(data){
    console.log(data)
  }
  return (
    <div style={{ padding: "1rem" }}>
      {/* <h2>{data.Get_challenge.function_name}</h2>
      <p>{data.Get_challenge.problem_statement}</p> */}

      {/* <button
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          borderRadius: "6px",
          backgroundColor: "#f4b24a",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
        }}
        onClick={() => refetch()}
      >
        Next Challenge
      </button> */}
    </div>
  );
};

export default Gamingpage;
