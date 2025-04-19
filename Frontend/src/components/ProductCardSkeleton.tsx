import React from "react";

const ProductCardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-lg shadow p-4 flex flex-col">
    <div className="bg-gray-200 h-48 w-full rounded mb-4" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
    <div className="h-6 bg-gray-300 rounded w-1/3" />
  </div>
);

export default ProductCardSkeleton;
