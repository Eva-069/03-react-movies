import { useFormStatus } from 'react-dom';
import toast from 'react-hot-toast';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

const SubmitButton = () => {
  const { pending } = useFormStatus();
  
  return (
    <button 
      className={styles.button} 
      type="submit"
      disabled={pending}
    >
      {pending ? 'Searching...' : 'Search'}
    </button>
  );
};

const SearchBar: React.FC<SearchBarProps> = ({ onSubmit }) => {
  const handleFormAction = async (formData: FormData) => {
    const query = formData.get('query') as string;
    
    if (!query.trim()) {
      toast.error('Please enter your search query.');
      return;
    }
    
    try {
      await onSubmit(query.trim());
      
      const form = document.querySelector('form') as HTMLFormElement;
      form?.reset();
    } catch (error) {
      toast.error('Search failed. Please try again.');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a
          className={styles.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>
        <form className={styles.form} action={handleFormAction}>
          <input
            className={styles.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />
          <SubmitButton />
        </form>
      </div>
    </header>
  );
};

export default SearchBar;