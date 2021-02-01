import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useMutation } from "@apollo/client";
import { EDIT_AUTHOR_BORN } from "../queries";

export default function BirthYearForm({ authors }) {
  const [born, setBorn] = useState("");
  const [selected, setSelected] = useState(null);

  const options = authors.map((author) => {
    const option = { value: author.name, label: author.name };
    return option;
  });

  const [changeBorn, result] = useMutation(EDIT_AUTHOR_BORN, {
    onError: (error) => {
      console.log(error);
    },
  });

  const submit = (event) => {
    event.preventDefault();

    if (!selected) return;
    if (typeof born !== "number") return;
    changeBorn({ variables: { name: selected.value, born: Number(born) } });
    setBorn("");
    setSelected(null);
  };

  useEffect(() => {
    if (result.data && result.data.editAuthorBorn === null) {
      console.log("Author Not Found");
    }
  }, [result.data]); //eslint-disable-line

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
