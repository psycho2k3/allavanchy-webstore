import { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
};

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

function ProductForm({
  initialProduct,
  isEditing = false,
  isSubmitting,
  onSubmit,
  submitLabel,
}) {
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);

  useEffect(() => {
    if (!initialProduct) return;

    setForm({
      name: initialProduct.name || "",
      description: initialProduct.description || "",
      price: initialProduct.price || "",
      stock: initialProduct.stock ?? "",
      category: initialProduct.category || "",
    });
    setSelectedSizes(initialProduct.sizes || []);
  }, [initialProduct]);

  const updateField = (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  };

  const toggleSize = (size) => {
    setSelectedSizes((currentSizes) =>
      currentSizes.includes(size)
        ? currentSizes.filter((item) => item !== size)
        : [...currentSizes, size],
    );
  };

  const submitForm = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("category", form.category);
    selectedSizes.forEach((size) => formData.append("sizes", size));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    onSubmit(formData);
  };

  return (
    <form className="admin-form admin-product-form" onSubmit={submitForm}>
      <div className="admin-form-grid">
        <label>
          Name
          <input name="name" onChange={updateField} required type="text" value={form.name} />
        </label>

        <label>
          Category
          <input name="category" onChange={updateField} type="text" value={form.category} />
        </label>

        <label>
          Price
          <input min="0" name="price" onChange={updateField} required step="0.01" type="number" value={form.price} />
        </label>

        <label>
          Stock
          <input min="0" name="stock" onChange={updateField} required step="1" type="number" value={form.stock} />
        </label>
      </div>

      <label>
        Description
        <textarea name="description" onChange={updateField} rows="5" value={form.description} />
      </label>

      <div>
        <p className="admin-label">Available sizes</p>
        <div className="admin-size-options">
          {availableSizes.map((size) => (
            <label className="admin-size-option" key={size}>
              <input
                checked={selectedSizes.includes(size)}
                onChange={() => toggleSize(size)}
                type="checkbox"
              />
              {size}
            </label>
          ))}
        </div>
      </div>

      <label>
        Product image
        <input
          accept="image/*"
          name="image"
          onChange={(event) => setImageFile(event.target.files?.[0] || null)}
          required={!isEditing}
          type="file"
        />
      </label>

      {initialProduct?.image_url && (
        <div className="admin-current-image">
          <img alt={initialProduct.name} src={initialProduct.image_url} />
          <span>Current image</span>
        </div>
      )}

      <button className="admin-primary-button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

export default ProductForm;