import { useEffect, useMemo, useState } from "react";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
};

const BASE_CATEGORIES = [
  "Clothing",
  "Footwear",
  "Accessories",
  "Bags",
  "Jewellery",
  "Other",
];

const CATEGORY_SIZE_OPTIONS = {
  Clothing: [
    "XXS",
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "XXXL",
  ],

  Footwear: [
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
  ],
};

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function getSizeOptions(category) {
  return CATEGORY_SIZE_OPTIONS[category] || [];
}

function getExistingImages(product) {
  if (
    Array.isArray(product?.image_urls) &&
    product.image_urls.length > 0
  ) {
    return product.image_urls.filter(Boolean);
  }

  if (product?.image_url) {
    return [product.image_url];
  }

  return [];
}

function ProductForm({
  initialProduct = null,
  isEditing = false,
  isSubmitting = false,
  onSubmit,
  submitLabel = "Save Product",
}) {
  const [form, setForm] = useState(EMPTY_FORM);

  const [selectedSizes, setSelectedSizes] = useState([]);

  const [newImages, setNewImages] = useState([]);

  const [newImagePreviews, setNewImagePreviews] = useState([]);

  const [imageError, setImageError] = useState("");

  const [formError, setFormError] = useState("");

  const [isDragOver, setIsDragOver] = useState(false);

  /*
   * Load product data when editing.
   */
  useEffect(() => {
    if (!initialProduct) {
      setForm(EMPTY_FORM);
      setSelectedSizes([]);
      setNewImages([]);
      setImageError("");
      setFormError("");
      return;
    }

    setForm({
      name: initialProduct.name || "",
      description: initialProduct.description || "",
      price:
        initialProduct.price !== undefined &&
        initialProduct.price !== null
          ? String(initialProduct.price)
          : "",
      stock:
        initialProduct.stock !== undefined &&
        initialProduct.stock !== null
          ? String(initialProduct.stock)
          : "",
      category: initialProduct.category || "",
    });

    setSelectedSizes(
      Array.isArray(initialProduct.sizes)
        ? initialProduct.sizes.map(String)
        : [],
    );

    setNewImages([]);
    setImageError("");
    setFormError("");
  }, [initialProduct]);

  /*
   * Create previews for selected images.
   */
  useEffect(() => {
    const previewUrls = newImages.map((file) =>
      URL.createObjectURL(file),
    );

    setNewImagePreviews(previewUrls);

    return () => {
      previewUrls.forEach((url) =>
        URL.revokeObjectURL(url),
      );
    };
  }, [newImages]);

  const existingImages = useMemo(
    () => getExistingImages(initialProduct),
    [initialProduct],
  );

  const categoryOptions = useMemo(() => {
    const currentCategory = form.category;

    if (
      currentCategory &&
      !BASE_CATEGORIES.includes(currentCategory)
    ) {
      return [
        currentCategory,
        ...BASE_CATEGORIES,
      ];
    }

    return BASE_CATEGORIES;
  }, [form.category]);

  const availableSizes = useMemo(
    () => getSizeOptions(form.category),
    [form.category],
  );

  /*
   * Update standard fields.
   */
  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setFormError("");
  };

  /*
   * Category change.
   */
  const handleCategoryChange = (event) => {
    const category = event.target.value;

    const allowedSizes =
      getSizeOptions(category);

    setForm((current) => ({
      ...current,
      category,
    }));

    setSelectedSizes((currentSizes) =>
      currentSizes.filter((size) =>
        allowedSizes.includes(String(size)),
      ),
    );

    setFormError("");
  };

  /*
   * Toggle size.
   */
  const toggleSize = (size) => {
    setSelectedSizes((currentSizes) =>
      currentSizes.includes(size)
        ? currentSizes.filter(
            (item) => item !== size,
          )
        : [...currentSizes, size],
    );
  };

  /*
   * Validate an image.
   */
  const validateImage = (file) => {
    if (!file) {
      return "Invalid image file.";
    }

    if (
      !file.type ||
      !file.type.startsWith("image/")
    ) {
      return `${file.name} is not a valid image file.`;
    }

    if (file.size > MAX_FILE_SIZE) {
      return `${file.name} is larger than 5 MB.`;
    }

    return "";
  };

  /*
   * Add selected image files.
   */
  const addImages = (files) => {
    setImageError("");

    const incomingFiles = Array.from(files || []);

    if (incomingFiles.length === 0) {
      return;
    }

    const remainingSlots =
      MAX_IMAGES - newImages.length;

    if (remainingSlots <= 0) {
      setImageError(
        `You have reached the maximum of ${MAX_IMAGES} images.`,
      );
      return;
    }

    const filesToAdd = incomingFiles.slice(
      0,
      remainingSlots,
    );

    const invalidFile = filesToAdd.find(
      (file) => validateImage(file),
    );

    if (invalidFile) {
      setImageError(
        validateImage(invalidFile),
      );
      return;
    }

    setNewImages((currentImages) => [
      ...currentImages,
      ...filesToAdd,
    ]);

    if (
      incomingFiles.length > remainingSlots
    ) {
      setImageError(
        `Only ${remainingSlots} image(s) were added. Maximum is ${MAX_IMAGES}.`,
      );
    }
  };

  /*
   * File input change.
   */
  const handleImageChange = (event) => {
    addImages(event.target.files);

    event.target.value = "";
  };

  /*
   * Drag events.
   */
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);

    addImages(event.dataTransfer.files);
  };

  /*
   * Remove newly selected image.
   */
  const removeNewImage = (index) => {
    setNewImages((currentImages) =>
      currentImages.filter(
        (_, currentIndex) =>
          currentIndex !== index,
      ),
    );

    setImageError("");
  };

  /*
   * Validate form.
   */
  const validateForm = () => {
    if (!form.name.trim()) {
      return {
        type: "form",
        message: "Product name is required.",
      };
    }

    if (
      form.price === "" ||
      Number.isNaN(Number(form.price)) ||
      Number(form.price) < 0
    ) {
      return {
        type: "form",
        message:
          "Price must be a valid non-negative number.",
      };
    }

    if (
      form.stock === "" ||
      !Number.isInteger(Number(form.stock)) ||
      Number(form.stock) < 0
    ) {
      return {
        type: "form",
        message:
          "Stock must be a valid non-negative integer.",
      };
    }

    if (!form.category.trim()) {
      return {
        type: "form",
        message: "Category is required.",
      };
    }

    if (newImages.length > MAX_IMAGES) {
      return {
        type: "image",
        message: `You can upload a maximum of ${MAX_IMAGES} images.`,
      };
    }

    if (
      !isEditing &&
      newImages.length === 0
    ) {
      return {
        type: "image",
        message:
          "At least one product image is required.",
      };
    }

    return null;
  };

  /*
   * Submit form.
   */
  const submitForm = async (event) => {
    event.preventDefault();

    setFormError("");
    setImageError("");

    const validationError =
      validateForm();

    if (validationError) {
      if (
        validationError.type === "image"
      ) {
        setImageError(
          validationError.message,
        );
      } else {
        setFormError(
          validationError.message,
        );
      }

      return;
    }

    const formData = new FormData();

    /*
     * Product fields.
     */
    formData.append(
      "name",
      form.name.trim(),
    );

    formData.append(
      "description",
      form.description.trim(),
    );

    formData.append(
      "price",
      form.price,
    );

    formData.append(
      "stock",
      form.stock,
    );

    formData.append(
      "category",
      form.category.trim(),
    );

    /*
     * Sizes.
     */
    selectedSizes.forEach((size) => {
      formData.append(
        "sizes",
        String(size),
      );
    });

    /*
     * IMPORTANT:
     *
     * Backend uses:
     *
     * upload.array("images", 10)
     *
     * Therefore this MUST remain
     * "images".
     */
    newImages.forEach((file) => {
      formData.append(
        "images",
        file,
      );
    });

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error(
        "Product submission error:",
        error,
      );

      const responseData =
        error?.response?.data;

      const message =
        responseData?.errors
          ?.join?.(", ") ||
        responseData?.message ||
        error?.message ||
        "Failed to save product.";

      if (
        message
          .toLowerCase()
          .includes("image")
      ) {
        setImageError(message);
      } else {
        setFormError(message);
      }
    }
  };

  return (
    <form
      className="admin-product-form-new"
      onSubmit={submitForm}
    >
      {/* =========================================
          ERROR
      ========================================= */}

      {formError && (
        <div className="product-form-alert product-form-alert-error">
          <span className="product-form-alert-icon">
            !
          </span>

          <span>{formError}</span>
        </div>
      )}

      {/* =========================================
          PRODUCT INFORMATION
      ========================================= */}

      <section className="product-form-section">
        <div className="product-form-section-header">
          <div>
            <span className="product-form-eyebrow">
              01
            </span>

            <h3>Product information</h3>

            <p>
              Add the basic details customers
              will see in your store.
            </p>
          </div>
        </div>

        <div className="product-form-fields">
          <div className="product-form-field product-form-field-full">
            <label htmlFor="product-name">
              Product name
            </label>

            <input
              id="product-name"
              name="name"
              type="text"
              value={form.name}
              onChange={updateField}
              placeholder="e.g. Fluffy Bag"
              required
              disabled={isSubmitting}
              autoComplete="off"
            />
          </div>

          <div className="product-form-field">
            <label htmlFor="product-category">
              Category
            </label>

            <select
              id="product-category"
              name="category"
              value={form.category}
              onChange={
                handleCategoryChange
              }
              required
              disabled={isSubmitting}
            >
              <option value="">
                Select category
              </option>

              {categoryOptions.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="product-form-field">
            <label htmlFor="product-price">
              Price
            </label>

            <div className="product-input-prefix">
              <span>$</span>

              <input
                id="product-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={updateField}
                placeholder="0.00"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="product-form-field">
            <label htmlFor="product-stock">
              Stock quantity
            </label>

            <input
              id="product-stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={updateField}
              placeholder="0"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="product-form-field product-form-field-full">
            <label htmlFor="product-description">
              Description
            </label>

            <textarea
              id="product-description"
              name="description"
              rows="6"
              value={form.description}
              onChange={updateField}
              placeholder="Describe the product, its features, material, style, or anything customers should know..."
              disabled={isSubmitting}
            />

            <span className="product-form-field-hint">
              Keep the description clear and
              useful for customers.
            </span>
          </div>
        </div>
      </section>

      {/* =========================================
          SIZES
      ========================================= */}

      {availableSizes.length > 0 && (
        <section className="product-form-section">
          <div className="product-form-section-header">
            <div>
              <span className="product-form-eyebrow">
                02
              </span>

              <h3>Available sizes</h3>

              <p>
                Select the sizes available for
                this product.
              </p>
            </div>

            {selectedSizes.length > 0 && (
              <span className="product-form-count">
                {selectedSizes.length} selected
              </span>
            )}
          </div>

          <div className="product-size-grid">
            {availableSizes.map((size) => {
              const isSelected =
                selectedSizes.includes(size);

              return (
                <button
                  key={size}
                  type="button"
                  className={`product-size-button ${
                    isSelected
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    toggleSize(size)
                  }
                  disabled={isSubmitting}
                  aria-pressed={isSelected}
                >
                  {size}

                  {isSelected && (
                    <span>✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================
          IMAGES
      ========================================= */}

      <section className="product-form-section">
        <div className="product-form-section-header">
          <div>
            <span className="product-form-eyebrow">
              {availableSizes.length > 0
                ? "03"
                : "02"}
            </span>

            <h3>Product images</h3>

            <p>
              Upload high-quality images of
              your product.
            </p>
          </div>

          <div className="product-image-counter">
            <strong>
              {newImages.length}
            </strong>

            <span>
              / {MAX_IMAGES}
            </span>
          </div>
        </div>

        {/* Upload area */}

        <div
          className={`product-upload-zone ${
            isDragOver
              ? "drag-over"
              : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="product-upload-icon">
            ↑
          </div>

          <h4>
            Drag and drop your images here
          </h4>

          <p>
            or choose images from your
            computer
          </p>

          <label className="product-upload-button">
            Choose images

            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              disabled={
                isSubmitting ||
                newImages.length >=
                  MAX_IMAGES
              }
            />
          </label>

          <span className="product-upload-help">
            JPG, PNG, WEBP · Maximum 5 MB
            each · Up to 10 images
          </span>
        </div>

        {imageError && (
          <div className="product-form-image-error">
            {imageError}
          </div>
        )}

        {/* New image previews */}

        {newImagePreviews.length > 0 && (
          <div className="product-image-group">
            <div className="product-image-group-header">
              <div>
                <h4>
                  New images
                </h4>

                <p>
                  These images will be
                  uploaded with the product.
                </p>
              </div>
            </div>

            <div className="product-image-grid">
              {newImagePreviews.map(
                (
                  previewUrl,
                  index,
                ) => (
                  <div
                    className="product-image-card"
                    key={previewUrl}
                  >
                    <img
                      src={previewUrl}
                      alt={`Selected product image ${
                        index + 1
                      }`}
                    />

                    {index === 0 && (
                      <span className="product-primary-badge">
                        Primary
                      </span>
                    )}

                    <button
                      type="button"
                      className="product-image-remove"
                      onClick={() =>
                        removeNewImage(
                          index,
                        )
                      }
                      disabled={
                        isSubmitting
                      }
                      aria-label={`Remove image ${
                        index + 1
                      }`}
                    >
                      ×
                    </button>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {/* Existing images */}

        {existingImages.length > 0 && (
          <div className="product-image-group">
            <div className="product-image-group-header">
              <div>
                <h4>
                  Current images
                </h4>

                <p>
                  Existing product images
                  currently stored.
                </p>
              </div>

              <span className="product-existing-count">
                {existingImages.length}{" "}
                image
                {existingImages.length !==
                1
                  ? "s"
                  : ""}
              </span>
            </div>

            <div className="product-image-grid">
              {existingImages.map(
                (url, index) => (
                  <div
                    className="product-image-card"
                    key={`${url}-${index}`}
                  >
                    <img
                      src={url}
                      alt={`${initialProduct?.name || "Product"} image ${
                        index + 1
                      }`}
                    />

                    {index === 0 && (
                      <span className="product-primary-badge">
                        Primary
                      </span>
                    )}
                  </div>
                ),
              )}
            </div>

            {isEditing && (
              <p className="product-existing-note">
                Existing images will remain
                unless you upload additional
                images.
              </p>
            )}
          </div>
        )}
      </section>

      {/* =========================================
          SUBMIT
      ========================================= */}

      <div className="product-form-actions">
        <div>
          <span className="product-form-action-title">
            {isEditing
              ? "Ready to update?"
              : "Ready to publish?"}
          </span>

          <span className="product-form-action-text">
            {isEditing
              ? "Save your changes to this product."
              : "Add this product to your store."}
          </span>
        </div>

        <button
          className="product-form-submit"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="product-form-spinner" />
              Saving...
            </>
          ) : (
            <>
              {submitLabel}
              <span>→</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;