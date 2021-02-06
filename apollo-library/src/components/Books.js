import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import Select from "react-select";
import { ALL_GENRES, FILTER_GENRES } from "../queries";

const Books = (props) => {
  const [selected, setSelected] = useState({ value: "all", label: "all" });

  let books = useQuery(FILTER_GENRES, {
    variables: {
      filter: selected.value,
    },
    onError: (error) => {
      console.log(error);
    },
  });

  let genres = useQuery(ALL_GENRES, {
    pollInterval: 2000,
  });

  if (!props.show) {
    return null;
  }

  if (books.loading || genres.loading) return <div>loading...</div>;

  books = books.data.filterGenre;
  genres = genres.data.allGenres.concat(["all"]).reverse();

  const options = genres.map((genre) => {
    const option = { value: genre, label: genre };
    return option;
  });

  return (
    <div>
      <h2>books</h2>
      Filter:{" "}
      <button onClick={() => setSelected({ value: "all", label: "all" })}>
        {" "}
        Show All{" "}
      </button>
      <br />
      <Select
        defaultValue={selected}
        onChange={setSelected}
        options={options}
      />
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
