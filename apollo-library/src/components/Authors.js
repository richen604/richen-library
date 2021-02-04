import React from "react";
import { ALL_AUTHORS } from "../queries";
import { useQuery } from "@apollo/client";
import BirthYearForm from "./BirthYearForm";

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS, {
    pollInterval: 2000,
  });

  if (!props.show) {
    return null;
  }

  if (result.loading) return <div>loading...</div>;

  const authors = result.data.allAuthors;

  console.log(result.data)

  return (
    <>
      <div>
        <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>born</th>
              <th>books</th>
            </tr>
            {authors.map((a) => (
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <BirthYearForm {...{ authors }} />
    </>
  );
};

export default Authors;
