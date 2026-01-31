"use client";

const products = [
  {
    id: 1,
    name: "Lumi – AI Dino",
    price: 2999,
    originalPrice: 3999,
    image: "/images/before-after-toy.png",
  },
  {
    id: 2,
    name: "Dog – AI Buddy",
    price: 2499,
    originalPrice: 3499,
    image: "/images/product-lumi-main.png",
  },
];

// Need to do this part. integrate wix for products. Will do this later

const ProductCards = () => {
  return (
    <section className="section-padding bg-background">
      <p className="bg-sky-blue h-20 rounded-2xl text-white flex items-center justify-center max-w-350 mx-auto mb-6 px-4 text-center">
        {" "}
        Need to do this part. integrate wix for products. Will do this later
      </p>
      {/* <div className="container">
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.id} className="card-product">
              <div className="rounded-2xl bg-secondary mb-3 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-40 h-40 bg-gray-400 object-cover"
                />
              </div>
              <h3 className="font-bold text-sm text-foreground mb-1 leading-tight">
                {product.name}
              </h3>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-extrabold text-primary text-lg">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              </div>
              <button className="w-full btn-primary text-sm py-2">Buy Now</button>
            </div>
          ))}
        </div>
      </div> */}
    </section>
  );
};

export default ProductCards;
