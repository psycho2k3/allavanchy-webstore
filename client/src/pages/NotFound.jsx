import { Link } from 'react-router-dom';
import Container from '../components/ui/Container.jsx';

function NotFound() {
  return (
    <Container className="py-20">
      <title>Page Not Found | ALLAVANCHY</title>
      <h1 className="font-display text-5xl">Page Not Found</h1>
      <p className="av-body mt-4 max-w-md">
        The page you are looking for has moved or no longer exists.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link className="av-button-primary" to="/">
          Return home
        </Link>
        <Link className="av-button-secondary" to="/shop">
          Shop
        </Link>
      </div>
    </Container>
  );
}

export default NotFound;
