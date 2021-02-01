import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { EDIT_AUTHOR_BORN } from "../queries";

export default function BirthYearForm() {
  const [born, setBorn] = useState("");
  const [name, setName] = useState("");

  const [changeBorn, result] = useMutation(EDIT_AUTHOR_BORN, {
    onError: (error) => {
      console.log(error);
    },
  });

  const submit = (event) => {
    event.preventDefault();

    changeBorn({ variables: { name, born } });
    setBorn("");
    setName("");
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
        <div>
          author name:{" "}
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born{" "}
          <input
            value={born}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        <button type="submit">Change Birth Year</button>
      </form>
    </div>
  );
}
