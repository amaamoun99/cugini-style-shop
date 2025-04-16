
import { Link } from 'react-router-dom';

const CheckoutHeader = () => {
  return (
    <div className="mb-8 text-center">
      <Link to="/" className="inline-block">
        <h1 className="text-3xl font-serif text-primary">CUGINI</h1>
      </Link>
    </div>
  );
};

export default CheckoutHeader;
