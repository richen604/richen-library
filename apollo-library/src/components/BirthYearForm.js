import React, { useState } from "react";
import Select from "react-select";
import { useMutation } from "@apollo/client";
import { ALL_AUTHORS, EDIT_AUTHOR_BORN } from "../queries";

export default function BirthYearForm({ authors }) {
  const [born, setBorn] = useState("");
  const [selected, setSelected] = useState(null);

  const [changeBorn] = useMutation(EDIT_AUTHOR_BORN, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.log(error);
    },
  });

  const submit = (event) => {
    event.preventDefault();

    if (!selected) return;
    changeBorn({
      variables: {
        name: selected.value,
        born: Number(born),
      },
    });
    setBorn("");
    setSelected(null);
  };

  const options = authors.map((author) => {
    const option = { value: author.name, label: author.name };
    return option;
  });

  return (
    <div>
      <h2>Change Author Birth Year</h2>

      <form onSubmit={submit}>
        <Select
          defaultValue={selected}
          onChange={setSelected}
          options={options}
        />
        <div>
          born{" "}
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">Change Birth Year</button>
      </form>
    </div>
  );
}
