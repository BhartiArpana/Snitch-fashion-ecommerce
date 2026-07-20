import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct";
import "../style/searchResult.scss";

function SearchResult() {
  const [searchParams] = useSearchParams();
  const searchItem = searchParams.get("q") || "";

  const { handleSearchProducts } = useProduct();
  const products = useSelector((state)=>state.products.products)
  const loading = useSelector((state)=>state.products.loading)
  const error = useSelector((state)=>state.products.error)
  console.log("products",products);
  const navigate = useNavigate()
  

  useEffect(() => {
    if (searchItem.trim()) {
      handleSearchProducts(searchItem);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchItem]);
  async function handleDetails(id){
     navigate(`/products/${id}`)
  }

  return (
    <div className="search-result">
      <div className="search-result__header">
        <p className="search-result__query">
          Showing results for <span>"{searchItem}"</span>
        </p>
        {!loading && (
          <p className="search-result__count">
            {products?.length || 0} items found
          </p>
        )}
      </div>

      {loading && <p className="search-result__status">Loading...</p>}
      {error && (
        <p className="search-result__status search-result__status--error">
          {error}
        </p>
      )}

      {!loading && !error && products?.length === 0 && (
        <p className="search-result__status">
          No products found for "{searchItem}"
        </p>
      )}

      <div className="search-result__grid">
        {products?.map((product) => (
          <div className="product-card" key={product._id} onClick={()=>handleDetails(product._id)}>
            <div className="product-card__image-wrapper">
              <img
                src={product.images?.[0]?.url}
                alt={product.title}
                className="product-card__image product-card__image--primary"
              />
              {product.images?.[1] && (
                <img
                  src={product.images[1].url}
                  alt={product.title}
                  className="product-card__image product-card__image--hover"
                />
              )}
            </div>
            <div className="product-card__info">
              <h3 className="product-card__title">{product.title}</h3>
              <p className="product-card__price">₹{product.price?.amount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResult;