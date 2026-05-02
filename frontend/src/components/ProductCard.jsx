import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product._id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        <div className="relative pb-[125%] overflow-hidden bg-gray-100">
          <img
            src={product.images[0] || 'https://via.placeholder.com/500'}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold">Agotado</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-sm text-gray-500 uppercase">{product.brand}</h3>
          <h2 className="font-semibold text-gray-800 mt-1 truncate">
            {product.name}
          </h2>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="text-sm text-gray-600 ml-1">
                {product.rating || 0}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {product.sizes?.slice(0, 3).map((size) => (
              <span
                key={size}
                className="text-xs bg-gray-100 px-2 py-1 rounded"
              >
                {size}
              </span>
            ))}
            {product.sizes?.length > 3 && (
              <span className="text-xs text-gray-500">
                +{product.sizes.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
