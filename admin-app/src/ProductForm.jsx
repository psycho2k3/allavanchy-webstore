import { useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "./adminApi.js";
import {
  compressImages,
  formatFileSize,
  MAX_UPLOAD_FILE_SIZE,
} from "./imageCompression.js";
import { getCurrencySymbol, useCurrency } from "./money.js";

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
const MAX_FILE_SIZE = MAX_UPLOAD_FILE_SIZE;
const MAX_TOTAL_UPLOAD_SIZE = MAX_UPLOAD_FILE_SIZE;
const MAX_PRICE = 9999999999.99;
const MAX_NAME_LENGTH = 255;

/* =====================================================
   HELPERS
===================================================== */

const getSizeOptions = (category) => {
  return CATEGORY_SIZE_OPTIONS[category] || [];
};

const getExistingImages = (product) => {
  if (
    Array.isArray(product?.image_urls) &&
    product.image_urls.length > 0
  ) {
    return product.image_urls.filter(
      (url) =>
        typeof url === "string" &&
        url.trim().length > 0,
    );
  }

  if (
    typeof product?.image_url === "string" &&
    product.image_url.trim().length > 0
  ) {
    return [product.image_url.trim()];
  }

  return [];
};

/* =====================================================
   PRODUCT FORM
===================================================== */

function ProductForm({
  initialProduct = null,
  isEditing = false,
  isSubmitting = false,
  onSubmit,
  submitLabel = "Save Product",
}) {
  const [form, setForm] = useState(EMPTY_FORM);

  const [selectedSizes, setSelectedSizes] =
    useState([]);

  const [newImages, setNewImages] = useState([]);

  const [newImagePreviews, setNewImagePreviews] =
    useState([]);

  const [imageError, setImageError] = useState("");

  const [formError, setFormError] = useState("");

  const [isDragOver, setIsDragOver] =
    useState(false);

  const [isProcessingImages, setIsProcessingImages] =
    useState(false);

  const currency = useCurrency();

  /* ===================================================
     EXISTING IMAGES

     Kept in state so individual images can be removed
     before saving. The kept list is sent as image_urls.
  =================================================== */

  const [existingImages, setExistingImages] =
    useState([]);

  /* ===================================================
     LOAD PRODUCT WHEN EDITING
  =================================================== */

  useEffect(() => {
    if (!initialProduct) {
      setForm(EMPTY_FORM);
      setSelectedSizes([]);
      setExistingImages([]);
      setNewImages([]);
      setImageError("");
      setFormError("");

      return;
    }

    setForm({
      name: initialProduct.name || "",

      description:
        initialProduct.description || "",

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

    setExistingImages(
      getExistingImages(initialProduct),
    );

    setNewImages([]);

    setImageError("");
    setFormError("");
  }, [initialProduct]);

  /* ===================================================
     CREATE PREVIEWS
  =================================================== */

  useEffect(() => {
    const urls = newImages.map((file) =>
      URL.createObjectURL(file),
    );

    setNewImagePreviews(urls);

    return () => {
      urls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [newImages]);

  /* ===================================================
     IMAGE COUNTS
  =================================================== */

  const totalImageCount =
    existingImages.length +
    newImages.length;

  const remainingImageSlots = Math.max(
    0,
    MAX_IMAGES - totalImageCount,
  );

  /* ===================================================
     CATEGORIES
  =================================================== */

  const categoryOptions = useMemo(() => {
    const currentCategory = form.category;

    if (
      currentCategory &&
      !BASE_CATEGORIES.includes(
        currentCategory,
      )
    ) {
      return [
        currentCategory,
        ...BASE_CATEGORIES,
      ];
    }

    return BASE_CATEGORIES;
  }, [form.category]);

  /* ===================================================
     SIZES
  =================================================== */

  const availableSizes = useMemo(
    () => getSizeOptions(form.category),
    [form.category],
  );

  /* ===================================================
     FORM FIELD UPDATE
  =================================================== */

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setFormError("");
  };

  /* ===================================================
     CATEGORY CHANGE
  =================================================== */

  const handleCategoryChange = (event) => {
    const category = event.target.value;

    const allowedSizes =
      getSizeOptions(category);

    setForm((current) => ({
      ...current,
      category,
    }));

    setSelectedSizes((current) =>
      current.filter((size) =>
        allowedSizes.includes(String(size)),
      ),
    );

    setFormError("");
  };

  /* ===================================================
     SIZE TOGGLE
  =================================================== */

  const toggleSize = (size) => {
    setSelectedSizes((current) => {
      if (current.includes(size)) {
        return current.filter(
          (item) => item !== size,
        );
      }

      return [...current, size];
    });
  };

  /* ===================================================
     IMAGE VALIDATION
  =================================================== */

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
      return `${file.name} is ${formatFileSize(file.size)} after compression. Each image must be 4 MB or smaller.`;
    }

    return "";
  };

  /* ===================================================
     ADD IMAGES

     Large images are compressed in the browser first;
     the size limits apply to the compressed files.
  =================================================== */

  const addImages = async (files) => {
    setImageError("");

    const incomingFiles = Array.from(
      files || [],
    );

    if (incomingFiles.length === 0) {
      return;
    }

    const remainingSlots =
      MAX_IMAGES -
      existingImages.length -
      newImages.length;

    if (remainingSlots <= 0) {
      setImageError(
        `Maximum of ${MAX_IMAGES} images reached.`,
      );

      return;
    }

    const nonImage = incomingFiles
      .slice(0, remainingSlots)
      .find(
        (file) =>
          !file.type ||
          !file.type.startsWith("image/"),
      );

    if (nonImage) {
      setImageError(
        `${nonImage.name} is not a valid image file.`,
      );
      return;
    }

    setIsProcessingImages(true);

    let filesToAdd;

    try {
      filesToAdd = await compressImages(
        incomingFiles.slice(
          0,
          remainingSlots,
        ),
      );
    } finally {
      setIsProcessingImages(false);
    }

    for (const file of filesToAdd) {
      const error = validateImage(file);

      if (error) {
        setImageError(error);
        return;
      }
    }

    const totalUploadSize = [...newImages, ...filesToAdd]
      .reduce((total, file) => total + file.size, 0);

    if (totalUploadSize > MAX_TOTAL_UPLOAD_SIZE) {
      setImageError(
        `The combined size of new images would be ${formatFileSize(totalUploadSize)} after compression. It must be 4 MB or smaller per save, so add fewer images now and the rest in a later edit.`,
      );
      return;
    }

    setNewImages((current) => [
      ...current,
      ...filesToAdd,
    ]);

    if (
      incomingFiles.length >
      remainingSlots
    ) {
      setImageError(
        `Only ${remainingSlots} image(s) were added. Maximum is ${MAX_IMAGES}.`,
      );
    }
  };

  /* ===================================================
     FILE INPUT
  =================================================== */

  const handleImageChange = (event) => {
    // addImages copies the FileList before its first await,
    // so the input can be reset right away.
    addImages(event.target.files);

    event.target.value = "";
  };

  /* ===================================================
     DRAG & DROP
  =================================================== */

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

    addImages(
      event.dataTransfer.files,
    );
  };

  /* ===================================================
     REMOVE NEW IMAGE
  =================================================== */

  const removeNewImage = (index) => {
    setNewImages((current) =>
      current.filter(
        (_, currentIndex) =>
          currentIndex !== index,
      ),
    );

    setImageError("");
  };

  /* ===================================================
     REMOVE EXISTING IMAGE
  =================================================== */

  const removeExistingImage = (index) => {
    setExistingImages((current) =>
      current.filter(
        (_, currentIndex) =>
          currentIndex !== index,
      ),
    );

    setImageError("");
  };

  /* ===================================================
     VALIDATE FORM
  =================================================== */

  const validateForm = () => {
    if (!form.name.trim()) {
      return {
        type: "form",
        message:
          "Product name is required.",
      };
    }

    if (form.name.trim().length > MAX_NAME_LENGTH) {
      return {
        type: "form",
        message:
          `Product name must be ${MAX_NAME_LENGTH} characters or fewer.`,
      };
    }

    if (
      form.price === "" ||
      Number.isNaN(Number(form.price)) ||
      Number(form.price) < 0 ||
      Number(form.price) > MAX_PRICE
    ) {
      return {
        type: "form",
        message:
          "Price must be a valid non-negative number no greater than 9,999,999,999.99.",
      };
    }

    if (
      !/^\d+$/.test(
        String(form.stock).trim(),
      )
    ) {
      return {
        type: "form",
        message:
          "Stock must be a whole number (0 or more).",
      };
    }

    if (!form.category.trim()) {
      return {
        type: "form",
        message:
          "Category is required.",
      };
    }

    if (totalImageCount > MAX_IMAGES) {
      return {
        type: "image",
        message:
          `Maximum of ${MAX_IMAGES} images allowed.`,
      };
    }

    /*
     * CREATE:
     *
     * At least one new image is required.
     */
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

    /*
     * EDIT:
     *
     * Existing images count as valid.
     */
    if (
      isEditing &&
      totalImageCount === 0
    ) {
      return {
        type: "image",
        message:
          "Product must have at least one image.",
      };
    }

    return null;
  };

  /* ===================================================
     SUBMIT
  =================================================== */

  const submitForm = async (event) => {
    event.preventDefault();

    setFormError("");
    setImageError("");

    const validationError =
      validateForm();

    if (validationError) {
      if (
        validationError.type ===
        "image"
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

    /* ================================================
       BASIC PRODUCT DATA
    ================================================ */

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
      String(form.stock).trim(),
    );

    formData.append(
      "category",
      form.category.trim(),
    );

    /* ================================================
       SIZES

       Always sent as one JSON field so that "[]"
       clears every size when editing.
    ================================================ */

    formData.append(
      "sizes",
      JSON.stringify(
        selectedSizes.map(String),
      ),
    );

    /* ================================================
       EXISTING IMAGE URLS

       ONLY SEND THESE WHEN EDITING.

       Sent as one JSON field listing the existing
       images to keep; the backend combines them with
       newly uploaded images. Removed images are simply
       left out of the list.
    ================================================ */

    if (isEditing) {
      formData.append(
        "image_urls",
        JSON.stringify(existingImages),
      );
    }

    /* ================================================
       NEW IMAGE FILES
       
       Backend expects:
       
       upload.array("images", 10)
       
       Therefore the field MUST be:
       
       images
    ================================================ */

    newImages.forEach((file) => {
      formData.append(
        "images",
        file,
      );
    });

    /* ================================================
       SEND TO PARENT

       This form owns submit errors; the parent pages
       only report load errors.
    ================================================ */

    try {
      await onSubmit(formData);
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        isEditing
          ? "Unable to update product."
          : "Unable to create product.",
      );

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

  /* ===================================================
     RENDER
  =================================================== */

  return (
    <form
      className="admin-product-form-new"
      onSubmit={submitForm}
    >
      {/* =================================================
          FORM ERROR
      ================================================= */}

      {formError && (
        <div className="product-form-alert product-form-alert-error">
          <span className="product-form-alert-icon">
            !
          </span>

          <span>{formError}</span>
        </div>
      )}

      {/* =================================================
          PRODUCT INFORMATION
      ================================================= */}

      <section className="product-form-section">
        <div className="product-form-section-header">
          <div>
            <span className="product-form-eyebrow">
              01
            </span>

            <h3>
              Product information
            </h3>

            <p>
              Add the basic details customers
              will see in your store.
            </p>
          </div>
        </div>

        <div className="product-form-fields">
          {/* NAME */}

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
              maxLength={MAX_NAME_LENGTH}
              required
              disabled={isSubmitting}
              autoComplete="off"
            />
          </div>

          {/* CATEGORY */}

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

          {/* PRICE */}

          <div className="product-form-field">
            <label htmlFor="product-price">
              Price
            </label>

            <div className="product-input-prefix">
              <span>{getCurrencySymbol(currency)}</span>

              <input
                id="product-price"
                name="price"
                type="number"
                min="0"
                max={MAX_PRICE}
                step="0.01"
                value={form.price}
                onChange={updateField}
                placeholder="0.00"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* STOCK */}

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
              inputMode="numeric"
              value={form.stock}
              onChange={updateField}
              placeholder="0"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* DESCRIPTION */}

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

      {/* =================================================
          SIZES
      ================================================= */}

      {availableSizes.length > 0 && (
        <section className="product-form-section">
          <div className="product-form-section-header">
            <div>
              <span className="product-form-eyebrow">
                02
              </span>

              <h3>
                Available sizes
              </h3>

              <p>
                Select the sizes available for
                this product.
              </p>
            </div>

            {selectedSizes.length > 0 && (
              <span className="product-form-count">
                {selectedSizes.length}{" "}
                selected
              </span>
            )}
          </div>

          <div className="product-size-grid">
            {availableSizes.map(
              (size) => {
                const selected =
                  selectedSizes.includes(
                    size,
                  );

                return (
                  <button
                    key={size}
                    type="button"
                    className={`product-size-button ${
                      selected
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      toggleSize(size)
                    }
                    disabled={
                      isSubmitting
                    }
                    aria-pressed={
                      selected
                    }
                  >
                    {size}

                    {selected && (
                      <span>
                        ✓
                      </span>
                    )}
                  </button>
                );
              },
            )}
          </div>
        </section>
      )}

      {/* =================================================
          PRODUCT IMAGES
      ================================================= */}

      <section className="product-form-section">
        <div className="product-form-section-header">
          <div>
            <span className="product-form-eyebrow">
              {availableSizes.length > 0
                ? "03"
                : "02"}
            </span>

            <h3>
              Product images
            </h3>

            <p>
              Upload high-quality images of
              your product.
            </p>
          </div>

          <div className="product-image-counter">
            <strong>
              {totalImageCount}
            </strong>

            <span>
              / {MAX_IMAGES}
            </span>
          </div>
        </div>

        {/* =================================================
            UPLOAD AREA
        ================================================= */}

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
              onChange={
                handleImageChange
              }
              disabled={
                isSubmitting ||
                isProcessingImages ||
                totalImageCount >=
                  MAX_IMAGES
              }
            />
          </label>

          <span className="product-upload-help">
            {isProcessingImages
              ? "Optimising images..."
              : "JPG, PNG, WEBP · Up to 10 images · Large photos are resized automatically · 4 MB of new images per save"}
          </span>
        </div>

        {/* =================================================
            IMAGE ERROR
        ================================================= */}

        {imageError && (
          <div className="product-form-image-error">
            {imageError}
          </div>
        )}

        {/* =================================================
            NEW IMAGES
        ================================================= */}

        {newImagePreviews.length > 0 && (
          <div className="product-image-group">
            <div className="product-image-group-header">
              <div>
                <h4>
                  New images
                </h4>

                <p>
                  These images will be
                  uploaded to Cloudinary.
                </p>
              </div>
            </div>

            <div className="product-image-grid">
              {newImagePreviews.map(
                (
                  preview,
                  index,
                ) => (
                  <div
                    className="product-image-card"
                    key={`${preview}-${index}`}
                  >
                    <img
                      src={preview}
                      alt={`New product image ${
                        index + 1
                      }`}
                    />

                    {/* PRIMARY */}
                    {existingImages.length ===
                      0 &&
                      index === 0 && (
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

        {/* =================================================
            EXISTING IMAGES
        ================================================= */}

        {existingImages.length > 0 && (
          <div className="product-image-group">
            <div className="product-image-group-header">
              <div>
                <h4>
                  Current images
                </h4>

                <p>
                  Existing images stored on
                  the product.
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

                    <button
                      type="button"
                      className="product-image-remove"
                      onClick={() =>
                        removeExistingImage(
                          index,
                        )
                      }
                      disabled={
                        isSubmitting
                      }
                      aria-label={`Remove current image ${
                        index + 1
                      }`}
                    >
                      ×
                    </button>
                  </div>
                ),
              )}
            </div>

            {isEditing && (
              <p className="product-existing-note">
                Current images are kept when
                you add new images. Use × to
                remove an image; changes apply
                when you save.
              </p>
            )}
          </div>
        )}
      </section>

      {/* =================================================
          SUBMIT
      ================================================= */}

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
          disabled={isSubmitting || isProcessingImages}
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
