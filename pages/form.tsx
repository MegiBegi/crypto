import { GetStaticProps } from "next";
import { Method } from "../types";

const ResolutionsForm = ({ results }) => {
  console.log(results);
  return (
    <div>
      <form>
        <label htmlFor="resolutions">Resolution</label>
        <br />
        <input type="text" id="resolution" />
        <button type="submit">Submit resolution</button>
      </form>
      {results.map((record) => (
        <div>
          <h1>{record.name}</h1>
          <h3>{record.method}</h3>
        </div>
      ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const response = await fetch("http://localhost:3000/api/hello", {
    method: Method.Post,
  });
  const results = await response.json();

  return { props: { results } };
};

export default ResolutionsForm;
