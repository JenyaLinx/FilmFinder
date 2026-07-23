import toast from "react-hot-toast";

import styles from "./SearchBar.module.css";

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  const handleSubmit = (formData: FormData) => {
    const query = String(formData.get("query") ?? "").trim();

    if (!query) {
      toast.error("Please enter your search query.");
      return;
    }

    onSubmit(query);
  };

  return (
    <form className={styles.form} action={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        name="query"
        placeholder="Search movies..."
        autoComplete="off"
        aria-label="Search movies"
      />

      <button className={styles.button} type="submit">
        Search
      </button>
    </form>
  );
}