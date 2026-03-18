// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const API_BASE_URL = "https://api-shridha.houseofresha.com";
// const PRODUCT_API_URL = `${API_BASE_URL}/product`;
// const CATEGORY_API_URL = `${API_BASE_URL}/category`;

// const COLOR_OPTIONS = [
//   "Black",
//   "White",
//   "Red",
//   "Blue",
//   "Green",
//   "Yellow",
//   "Pink",
//   "Purple",
//   "Orange",
//   "Brown",
//   "Gray",
//   "Navy",
//   "Teal",
//   "Maroon",
//   "Gold",
//   "Silver",
// ];

// const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

// // ── Shared style helpers ──
// const labelStyle = {
//   display: "block",
//   marginBottom: 6,
//   fontSize: 15,
//   fontWeight: 600,
//   color: "#374151",
// };

// const inputStyle = {
//   width: "100%",
//   boxSizing: "border-box",
//   border: "1.5px solid #e5e7eb",
//   borderRadius: 10,
//   padding: "10px 14px",
//   fontSize: 15,
//   color: "#374151",
//   background: "#fafafa",
//   outline: "none",
//   fontFamily: "inherit",
//   transition: "border-color .15s, background .15s",
// };

// const fieldDesc = {
//   margin: "5px 0 0",
//   fontSize: 14.5,
//   color: "#9ca3af",
// };

// const AddProduct = () => {
//   const navigate = useNavigate();

//   const [categories, setCategories] = useState([]);
//   const [loadingCategories, setLoadingCategories] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [formData, setFormData] = useState({
//     name: "",
//     price: "",
//     discountPercentage: "",
//     category: "",
//     specifications: [],
//     descriptions: [], // arrays for multiple entries
//   });

//   const [selectedColors, setSelectedColors] = useState([]);
//   const [selectedSizes, setSelectedSizes] = useState([]);
//   const [imageFiles, setImageFiles] = useState([]);
//   const [focusedField, setFocusedField] = useState("");

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch(CATEGORY_API_URL);
//         const result = await res.json();
//         if (result.success && Array.isArray(result.data))
//           setCategories(result.data);
//       } catch (err) {
//         console.error("Failed to load categories", err);
//       } finally {
//         setLoadingCategories(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handlers for specifications array
//   const handleSpecChange = (index, value) => {
//     setFormData((prev) => {
//       const newSpecs = [...prev.specifications];
//       newSpecs[index] = value;
//       return { ...prev, specifications: newSpecs };
//     });
//   };

//   const addSpecification = () => {
//     setFormData((prev) => ({
//       ...prev,
//       specifications: [...prev.specifications, ""],
//     }));
//   };

//   const removeSpecification = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       specifications: prev.specifications.filter((_, i) => i !== index),
//     }));
//   };

//   // Handlers for descriptions array
//   const handleDescChange = (index, value) => {
//     setFormData((prev) => {
//       const newDescs = [...prev.descriptions];
//       newDescs[index] = value;
//       return { ...prev, descriptions: newDescs };
//     });
//   };

//   const addDescription = () => {
//     setFormData((prev) => ({
//       ...prev,
//       descriptions: [...prev.descriptions, ""],
//     }));
//   };

//   const removeDescription = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       descriptions: prev.descriptions.filter((_, i) => i !== index),
//     }));
//   };

//   const handleColorToggle = (color) =>
//     setSelectedColors((prev) =>
//       prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
//     );

//   const handleSizeToggle = (size) =>
//     setSelectedSizes((prev) =>
//       prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
//     );

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length + imageFiles.length > 5) {
//       setError("You can upload a maximum of 5 images.");
//       return;
//     }
//     setImageFiles((prev) => [...prev, ...files]);
//   };

//   const removeImage = (index) =>
//     setImageFiles((prev) => prev.filter((_, i) => i !== index));

//   const validateForm = () => {
//     if (!formData.name.trim()) return "Product name is required";
//     if (!formData.price || isNaN(formData.price))
//       return "Valid price is required";
//     if (!formData.category) return "Category is required";
//     if (imageFiles.length === 0) return "At least one image is required";
//     return null;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     const validationError = validateForm();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     const submitData = new FormData();
//     submitData.append("name", formData.name.trim());
//     submitData.append("price", formData.price);
//     if (formData.discountPercentage)
//       submitData.append("discountPercentage", formData.discountPercentage);
//     submitData.append("category", formData.category);
//     submitData.append("colors", selectedColors.join(","));
//     submitData.append(
//       "sizes",
//       selectedSizes.map((s) => s.toLowerCase()).join(","),
//     );

//     // Append each specification individually (server should treat as array)
//     formData.specifications.forEach((spec) => {
//       if (spec.trim()) submitData.append("specification", spec.trim());
//     });

//     // Append each description individually
//     formData.descriptions.forEach((desc) => {
//       if (desc.trim()) submitData.append("description", desc.trim());
//     });

//     imageFiles.forEach((file) => submitData.append("images", file));

//     setLoading(true);
//     try {
//       const response = await fetch(PRODUCT_API_URL, {
//         method: "POST",
//         body: submitData,
//       });
//       const result = await response.json();
//       if (!response.ok)
//         throw new Error(result.message || `HTTP error ${response.status}`);
//       if (result.success) {
//         setSuccess("Product added successfully!");
//         setTimeout(() => navigate("/products"), 2000);
//       } else {
//         throw new Error(result.message || "Failed to add product");
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const focusStyle = (name) =>
//     focusedField === name ? { borderColor: "#1a1a1a", background: "#fff" } : {};

//   const CheckIcon = () => (
//     <svg
//       width="14"
//       height="14"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2.5"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <polyline points="20 6 9 17 4 12" />
//     </svg>
//   );

//   // ── Loading categories ──
//   if (loadingCategories) {
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           background: "#f0f2f5",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           fontFamily: "'DM Sans','Segoe UI',sans-serif",
//         }}
//       >
//         <div style={{ textAlign: "center" }}>
//           <svg
//             width="36"
//             height="36"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="#1a1a1a"
//             strokeWidth="2.5"
//             strokeLinecap="round"
//             style={{ animation: "spin 1s linear infinite" }}
//           >
//             <path d="M21 12a9 9 0 1 1-6.219-8.56" />
//           </svg>
//           <p style={{ marginTop: 10, color: "#6b7280", fontSize: 14 }}>
//             Loading…
//           </p>
//         </div>
//         <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#f0f2f5",
//         fontFamily: "'DM Sans','Segoe UI',sans-serif",
//       }}
//     >
//       <div
//         style={{
//           maxWidth: 1280,
//           margin: "0 auto",
//           background: "#fff",
//           borderRadius: 14,
//           boxShadow: "0 1px 12px rgba(0,0,0,.07)",
//           overflow: "hidden",
//         }}
//       >
//         {/* ── Header ── */}
//         <div
//           style={{
//             padding: "18px 24px",
//             display: "flex",
//             alignItems: "center",
//             gap: 12,
//           }}
//         >
//           <button
//             type="button"
//             onClick={() => navigate("/products")}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               width: 34,
//               height: 34,
//               borderRadius: 8,
//               border: "1.5px solid #e5e7eb",
//               background: "#fff",
//               cursor: "pointer",
//               flexShrink: 0,
//               transition: "all .15s",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "#f3f4f6";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "#fff";
//             }}
//           >
//             <svg
//               width="16"
//               height="16"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="#374151"
//               strokeWidth="2.2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <line x1="19" y1="12" x2="5" y2="12" />
//               <polyline points="12 19 5 12 12 5" />
//             </svg>
//           </button>
//           <h2
//             style={{
//               margin: 0,
//               fontSize: 20,
//               fontWeight: 700,
//               color: "#1a1f2e",
//               letterSpacing: "-0.2px",
//             }}
//           >
//             Add New Product
//           </h2>
//         </div>
//         <hr
//           style={{ margin: 0, border: "none", borderTop: "1px solid #e5e7eb" }}
//         />

//         {/* ── Body ── */}
//         <div style={{ padding: "24px" }}>
//           {/* Alerts */}
//           {error && (
//             <div
//               style={{
//                 marginBottom: 18,
//                 borderRadius: 8,
//                 padding: "10px 14px",
//                 background: "#fff5f5",
//                 border: "1px solid #fecaca",
//                 color: "#c0392b",
//                 fontSize: 14,
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 8,
//               }}
//             >
//               <svg
//                 width="14"
//                 height="14"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <circle cx="12" cy="12" r="10" />
//                 <line x1="12" y1="8" x2="12" y2="12" />
//                 <line x1="12" y1="16" x2="12.01" y2="16" />
//               </svg>
//               {error}
//             </div>
//           )}
//           {success && (
//             <div
//               style={{
//                 marginBottom: 18,
//                 borderRadius: 8,
//                 padding: "10px 14px",
//                 background: "#f0fdf4",
//                 border: "1px solid #bbf7d0",
//                 color: "#15803d",
//                 fontSize: 14,
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 8,
//               }}
//             >
//               <CheckIcon /> {success}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} encType="multipart/form-data">
//             <div style={{ width: "100%", margin: "0 auto" }}>
//               {/* ── Product Name ── */}
//               <div style={{ marginBottom: 20 }}>
//                 <label style={labelStyle}>
//                   Product Name <span style={{ color: "#ef4444" }}>*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   placeholder="Enter product name"
//                   style={{ ...inputStyle, ...focusStyle("name") }}
//                   onFocus={() => setFocusedField("name")}
//                   onBlur={() => setFocusedField("")}
//                 />
//               </div>

//               {/* ── Price & Discount ── */}
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   gap: 16,
//                   marginBottom: 20,
//                 }}
//               >
//                 <div>
//                   <label style={labelStyle}>
//                     Price (₹) <span style={{ color: "#ef4444" }}>*</span>
//                   </label>
//                   <input
//                     type="number"
//                     name="price"
//                     value={formData.price}
//                     onChange={handleInputChange}
//                     placeholder="0.00"
//                     style={{ ...inputStyle, ...focusStyle("price") }}
//                     onFocus={() => setFocusedField("price")}
//                     onBlur={() => setFocusedField("")}
//                   />
//                 </div>
//                 <div>
//                   <label style={labelStyle}>Discount %</label>
//                   <input
//                     type="number"
//                     name="discountPercentage"
//                     value={formData.discountPercentage}
//                     onChange={handleInputChange}
//                     placeholder="0"
//                     min="0"
//                     max="100"
//                     style={{ ...inputStyle, ...focusStyle("discount") }}
//                     onFocus={() => setFocusedField("discount")}
//                     onBlur={() => setFocusedField("")}
//                   />
//                 </div>
//               </div>

//               {/* ── Category ── */}
//               <div style={{ marginBottom: 20 }}>
//                 <label style={labelStyle}>
//                   Category <span style={{ color: "#ef4444" }}>*</span>
//                 </label>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleInputChange}
//                   style={{
//                     ...inputStyle,
//                     ...focusStyle("category"),
//                     cursor: "pointer",
//                     appearance: "none",
//                     backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
//                     backgroundRepeat: "no-repeat",
//                     backgroundPosition: "right 14px center",
//                     paddingRight: 40,
//                   }}
//                   onFocus={() => setFocusedField("category")}
//                   onBlur={() => setFocusedField("")}
//                 >
//                   <option value="">Select a category</option>
//                   {categories.map((cat) => (
//                     <option key={cat._id} value={cat._id}>
//                       {cat.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* ── Colors ── */}
//               <div style={{ marginBottom: 20 }}>
//                 <label style={labelStyle}>Colors</label>
//                 <div
//                   style={{
//                     border: "1.5px solid #e5e7eb",
//                     borderRadius: 10,
//                     padding: "14px 16px",
//                     background: "#fafafa",
//                   }}
//                 >
//                   <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//                     {COLOR_OPTIONS.map((color) => {
//                       const active = selectedColors.includes(color);
//                       return (
//                         <button
//                           key={color}
//                           type="button"
//                           onClick={() => handleColorToggle(color)}
//                           style={{
//                             padding: "5px 14px",
//                             borderRadius: 8,
//                             fontSize: 14,
//                             fontWeight: 500,
//                             cursor: "pointer",
//                             fontFamily: "inherit",
//                             transition: "all .15s",
//                             border: `1.5px solid ${active ? "#1a1a1a" : "#e5e7eb"}`,
//                             background: active ? "#1a1a1a" : "#fff",
//                             color: active ? "#fff" : "#374151",
//                           }}
//                         >
//                           {color}
//                         </button>
//                       );
//                     })}
//                   </div>
//                   {selectedColors.length > 0 && (
//                     <p
//                       style={{
//                         margin: "10px 0 0",
//                         fontSize: 12,
//                         color: "#6b7280",
//                       }}
//                     >
//                       Selected: {selectedColors.join(", ")}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* ── Sizes ── */}
//               <div style={{ marginBottom: 20 }}>
//                 <label style={labelStyle}>Sizes</label>
//                 <div
//                   style={{
//                     border: "1.5px solid #e5e7eb",
//                     borderRadius: 10,
//                     padding: "14px 16px",
//                     background: "#fafafa",
//                   }}
//                 >
//                   <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//                     {SIZE_OPTIONS.map((size) => {
//                       const active = selectedSizes.includes(size);
//                       return (
//                         <button
//                           key={size}
//                           type="button"
//                           onClick={() => handleSizeToggle(size)}
//                           style={{
//                             width: 52,
//                             height: 40,
//                             borderRadius: 8,
//                             fontSize: 14,
//                             fontWeight: 700,
//                             cursor: "pointer",
//                             fontFamily: "inherit",
//                             transition: "all .15s",
//                             border: `1.5px solid ${active ? "#1a1a1a" : "#e5e7eb"}`,
//                             background: active ? "#1a1a1a" : "#fff",
//                             color: active ? "#fff" : "#374151",
//                             textTransform: "uppercase",
//                           }}
//                         >
//                           {size}
//                         </button>
//                       );
//                     })}
//                   </div>
//                   {selectedSizes.length > 0 && (
//                     <p
//                       style={{
//                         margin: "10px 0 0",
//                         fontSize: 12,
//                         color: "#6b7280",
//                       }}
//                     >
//                       Selected: {selectedSizes.join(", ")}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* ── Specifications (multiple) ── */}
//               <div style={{ marginBottom: 20 }}>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: 6,
//                   }}
//                 >
//                   <label style={labelStyle}>Specifications</label>
//                   <button
//                     type="button"
//                     onClick={addSpecification}
//                     style={{
//                       padding: "4px 12px",
//                       fontSize: 12,
//                       fontWeight: 600,
//                       border: "1.5px solid #1a1a1a",
//                       borderRadius: 6,
//                       background: "#fff",
//                       color: "#1a1a1a",
//                       cursor: "pointer",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 4,
//                     }}
//                   >
//                     <svg
//                       width="12"
//                       height="12"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2.5"
//                     >
//                       <line x1="12" y1="5" x2="12" y2="19" />
//                       <line x1="5" y1="12" x2="19" y2="12" />
//                     </svg>
//                     Add
//                   </button>
//                 </div>
//                 {formData.specifications.map((spec, index) => (
//                   <div
//                     key={index}
//                     style={{ display: "flex", gap: 8, marginBottom: 8 }}
//                   >
//                     <input
//                       type="text"
//                       value={spec}
//                       onChange={(e) => handleSpecChange(index, e.target.value)}
//                       placeholder={`Specification #${index + 1}`}
//                       style={{ ...inputStyle, flex: 1 }}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeSpecification(index)}
//                       style={{
//                         width: 36,
//                         height: 36,
//                         borderRadius: 8,
//                         border: "1.5px solid #e5e7eb",
//                         background: "#fff",
//                         color: "#ef4444",
//                         fontSize: 18,
//                         fontWeight: 600,
//                         cursor: "pointer",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ))}
//                 {formData.specifications.length === 0 && (
//                   <p style={fieldDesc}>
//                     No specifications added. Click "Add" to create one.
//                   </p>
//                 )}
//               </div>

//               {/* ── Descriptions (multiple) ── */}
//               <div style={{ marginBottom: 20 }}>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: 6,
//                   }}
//                 >
//                   <label style={labelStyle}>Descriptions</label>
//                   <button
//                     type="button"
//                     onClick={addDescription}
//                     style={{
//                       padding: "4px 12px",
//                       fontSize: 12,
//                       fontWeight: 600,
//                       border: "1.5px solid #1a1a1a",
//                       borderRadius: 6,
//                       background: "#fff",
//                       color: "#1a1a1a",
//                       cursor: "pointer",
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 4,
//                     }}
//                   >
//                     <svg
//                       width="12"
//                       height="12"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2.5"
//                     >
//                       <line x1="12" y1="5" x2="12" y2="19" />
//                       <line x1="5" y1="12" x2="19" y2="12" />
//                     </svg>
//                     Add
//                   </button>
//                 </div>
//                 {formData.descriptions.map((desc, index) => (
//                   <div
//                     key={index}
//                     style={{ display: "flex", gap: 8, marginBottom: 8 }}
//                   >
//                     <textarea
//                       value={desc}
//                       onChange={(e) => handleDescChange(index, e.target.value)}
//                       placeholder={`Description #${index + 1}`}
//                       rows={2}
//                       style={{ ...inputStyle, flex: 1, resize: "vertical" }}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeDescription(index)}
//                       style={{
//                         width: 36,
//                         height: 36,
//                         borderRadius: 8,
//                         border: "1.5px solid #e5e7eb",
//                         background: "#fff",
//                         color: "#ef4444",
//                         fontSize: 18,
//                         fontWeight: 600,
//                         cursor: "pointer",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ))}
//                 {formData.descriptions.length === 0 && (
//                   <p style={fieldDesc}>
//                     No descriptions added. Click "Add" to create one.
//                   </p>
//                 )}
//               </div>

//               {/* ── Images ── */}
//               <div style={{ marginBottom: 4 }}>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: 6,
//                   }}
//                 >
//                   <label style={labelStyle}>
//                     Product Images <span style={{ color: "#ef4444" }}>*</span>
//                   </label>
//                   <span style={{ fontSize: 14.5, color: "#9ca3af" }}>
//                     {imageFiles.length}/5
//                   </span>
//                 </div>

//                 {/* Upload zone */}
//                 <label
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 12,
//                     border: `1.5px ${imageFiles.length > 0 ? "solid #1a1a1a" : "dashed #d1d5db"}`,
//                     borderRadius: 10,
//                     padding: "13px 16px",
//                     cursor: imageFiles.length >= 5 ? "not-allowed" : "pointer",
//                     background: imageFiles.length > 0 ? "#f9f9f9" : "#fafafa",
//                     transition: "all .15s",
//                     opacity: imageFiles.length >= 5 ? 0.5 : 1,
//                   }}
//                 >
//                   <svg
//                     width="20"
//                     height="20"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke={imageFiles.length > 0 ? "#1a1a1a" : "#9ca3af"}
//                     strokeWidth="1.8"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   >
//                     <rect x="3" y="3" width="18" height="18" rx="3" />
//                     <path d="M9 12l3-3 3 3" />
//                     <line x1="12" y1="9" x2="12" y2="16" />
//                   </svg>
//                   <div style={{ flex: 1 }}>
//                     <p
//                       style={{
//                         margin: 0,
//                         fontSize: 15,
//                         color: imageFiles.length >= 5 ? "#9ca3af" : "#6b7280",
//                       }}
//                     >
//                       {imageFiles.length >= 5
//                         ? "Maximum 5 images reached"
//                         : "Click to add images (max 5)"}
//                     </p>
//                     <p
//                       style={{
//                         margin: "2px 0 0",
//                         fontSize: 12,
//                         color: "#9ca3af",
//                       }}
//                     >
//                       PNG, JPG, WEBP
//                     </p>
//                   </div>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     multiple
//                     onChange={handleImageChange}
//                     disabled={imageFiles.length >= 5}
//                     style={{ display: "none" }}
//                   />
//                 </label>

//                 {/* Image previews */}
//                 {imageFiles.length > 0 && (
//                   <div
//                     style={{
//                       display: "flex",
//                       flexWrap: "wrap",
//                       gap: 10,
//                       marginTop: 12,
//                     }}
//                   >
//                     {imageFiles.map((file, idx) => (
//                       <div key={idx} style={{ position: "relative" }}>
//                         <img
//                           src={URL.createObjectURL(file)}
//                           alt={`preview ${idx}`}
//                           style={{
//                             width: 72,
//                             height: 72,
//                             objectFit: "cover",
//                             borderRadius: 8,
//                             border: "1.5px solid #e5e7eb",
//                             display: "block",
//                           }}
//                         />
//                         <button
//                           type="button"
//                           onClick={() => removeImage(idx)}
//                           style={{
//                             position: "absolute",
//                             top: -6,
//                             right: -6,
//                             width: 20,
//                             height: 20,
//                             borderRadius: "50%",
//                             background: "#ef4444",
//                             border: "none",
//                             color: "#fff",
//                             fontSize: 14,
//                             fontWeight: 700,
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             cursor: "pointer",
//                             lineHeight: 1,
//                           }}
//                         >
//                           ×
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </form>
//         </div>

//         {/* ── Footer ── */}
//         <hr
//           style={{ margin: 0, border: "none", borderTop: "1px solid #e5e7eb" }}
//         />
//         <div
//           style={{
//             padding: "14px 24px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             style={{
//               padding: "9px 22px",
//               border: "1.5px solid #e5e7eb",
//               borderRadius: 8,
//               background: "#fff",
//               color: "#6b7280",
//               fontSize: 15,
//               fontWeight: 600,
//               cursor: "pointer",
//               fontFamily: "inherit",
//               transition: "all .15s",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "#f9fafb";
//               e.currentTarget.style.borderColor = "#d1d5db";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "#fff";
//               e.currentTarget.style.borderColor = "#e5e7eb";
//             }}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             onClick={handleSubmit}
//             disabled={loading}
//             style={{
//               padding: "9px 26px",
//               border: "none",
//               borderRadius: 8,
//               background: loading ? "#555" : "#1a1a1a",
//               color: "#fff",
//               fontSize: 15,
//               fontWeight: 600,
//               cursor: loading ? "not-allowed" : "pointer",
//               fontFamily: "inherit",
//               transition: "background .15s",
//               display: "flex",
//               alignItems: "center",
//               gap: 8,
//             }}
//             onMouseEnter={(e) => {
//               if (!loading) e.currentTarget.style.background = "#333";
//             }}
//             onMouseLeave={(e) => {
//               if (!loading) e.currentTarget.style.background = "#1a1a1a";
//             }}
//           >
//             {loading ? (
//               <>
//                 <svg
//                   width="14"
//                   height="14"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2.5"
//                   strokeLinecap="round"
//                   style={{ animation: "spin 1s linear infinite" }}
//                 >
//                   <path d="M21 12a9 9 0 1 1-6.219-8.56" />
//                 </svg>
//                 Adding…
//               </>
//             ) : (
//               "Add Product"
//             )}
//           </button>
//         </div>
//       </div>

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
//         @keyframes spin { to { transform: rotate(360deg); } }
//         input[type=number]::-webkit-inner-spin-button,
//         input[type=number]::-webkit-outer-spin-button { opacity: 1; }
//       `}</style>
//     </div>
//   );
// };

// export default AddProduct;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://api-shridha.houseofresha.com";
const PRODUCT_API_URL = `${API_BASE_URL}/product`;
const CATEGORY_API_URL = `${API_BASE_URL}/category`;

const COLOR_OPTIONS = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Pink",
  "Purple",
  "Orange",
  "Brown",
  "Gray",
  "Navy",
  "Teal",
  "Maroon",
  "Gold",
  "Silver",
];

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

// ── Shared style helpers (no shorthand conflicts) ──
const labelStyle = {
  display: "block",
  marginBottom: 6,
  fontSize: 15,
  fontWeight: 600,
  color: "#374151",
};

// Base input style using longhand border properties
const inputBaseStyle = {
  width: "100%",
  boxSizing: "border-box",
  borderWidth: "1.5px",
  borderStyle: "solid",
  borderColor: "#e5e7eb",
  borderRadius: 10,
  padding: "10px 14px",
  fontSize: 15,
  color: "#374151",
  backgroundColor: "#fafafa", // not shorthand "background"
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color .15s, background-color .15s",
};

// Focus style: only update borderColor and backgroundColor
const focusStyle = (field, focusedField) =>
  focusedField === field
    ? { borderColor: "#1a1a1a", backgroundColor: "#fff" }
    : {};

const fieldDesc = {
  margin: "5px 0 0",
  fontSize: 14.5,
  color: "#9ca3af",
};

const AddProduct = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discountPercentage: "",
    category: "",
    specifications: [],
    descriptions: [], // arrays for multiple entries
  });

  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [focusedField, setFocusedField] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(CATEGORY_API_URL);
        const result = await res.json();
        if (result.success && Array.isArray(result.data))
          setCategories(result.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handlers for specifications array
  const handleSpecChange = (index, value) => {
    setFormData((prev) => {
      const newSpecs = [...prev.specifications];
      newSpecs[index] = value;
      return { ...prev, specifications: newSpecs };
    });
  };

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, ""],
    }));
  };

  const removeSpecification = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  // Handlers for descriptions array
  const handleDescChange = (index, value) => {
    setFormData((prev) => {
      const newDescs = [...prev.descriptions];
      newDescs[index] = value;
      return { ...prev, descriptions: newDescs };
    });
  };

  const addDescription = () => {
    setFormData((prev) => ({
      ...prev,
      descriptions: [...prev.descriptions, ""],
    }));
  };

  const removeDescription = (index) => {
    setFormData((prev) => ({
      ...prev,
      descriptions: prev.descriptions.filter((_, i) => i !== index),
    }));
  };

  const handleColorToggle = (color) =>
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );

  const handleSizeToggle = (size) =>
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      setError("You can upload a maximum of 5 images.");
      return;
    }
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index) =>
    setImageFiles((prev) => prev.filter((_, i) => i !== index));

  const validateForm = () => {
    if (!formData.name.trim()) return "Product name is required";
    if (!formData.price || isNaN(formData.price))
      return "Valid price is required";
    if (!formData.category) return "Category is required";
    if (imageFiles.length === 0) return "At least one image is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const submitData = new FormData();
    submitData.append("name", formData.name.trim());
    submitData.append("price", formData.price);
    if (formData.discountPercentage)
      submitData.append("discountPercentage", formData.discountPercentage);
    submitData.append("category", formData.category);
    // Fix: send colors in lowercase
    submitData.append("colors", selectedColors.map(c => c.toLowerCase()).join(","));
    submitData.append(
      "sizes",
      selectedSizes.map((s) => s.toLowerCase()).join(","),
    );

    // Append each specification individually (server should treat as array)
    formData.specifications.forEach((spec) => {
      if (spec.trim()) submitData.append("specification", spec.trim());
    });

    // Append each description individually
    formData.descriptions.forEach((desc) => {
      if (desc.trim()) submitData.append("description", desc.trim());
    });

    imageFiles.forEach((file) => submitData.append("images", file));

    setLoading(true);
    try {
      const response = await fetch(PRODUCT_API_URL, {
        method: "POST",
        body: submitData,
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || `HTTP error ${response.status}`);
      if (result.success) {
        setSuccess("Product added successfully!");
        setTimeout(() => navigate("/products"), 2000);
      } else {
        throw new Error(result.message || "Failed to add product");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const CheckIcon = () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  // ── Loading categories ──
  if (loadingCategories) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f0f2f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans','Segoe UI',sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ animation: "spin 1s linear infinite" }}
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <p style={{ marginTop: 10, color: "#6b7280", fontSize: 14 }}>
            Loading…
          </p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 14,
          boxShadow: "0 1px 12px rgba(0,0,0,.07)",
          overflow: "hidden",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/products")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              borderRadius: 8,
              border: "1.5px solid #e5e7eb",
              background: "#fff",
              cursor: "pointer",
              flexShrink: 0,
              transition: "all .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#374151"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: "#1a1f2e",
              letterSpacing: "-0.2px",
            }}
          >
            Add New Product
          </h2>
        </div>
        <hr
          style={{ margin: 0, border: "none", borderTop: "1px solid #e5e7eb" }}
        />

        {/* ── Body ── */}
        <div style={{ padding: "24px" }}>
          {/* Alerts */}
          {error && (
            <div
              style={{
                marginBottom: 18,
                borderRadius: 8,
                padding: "10px 14px",
                background: "#fff5f5",
                border: "1px solid #fecaca",
                color: "#c0392b",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div
              style={{
                marginBottom: 18,
                borderRadius: 8,
                padding: "10px 14px",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#15803d",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <CheckIcon /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div style={{ width: "100%", margin: "0 auto" }}>
              {/* ── Product Name ── */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>
                  Product Name <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  style={{
                    ...inputBaseStyle,
                    ...focusStyle("name", focusedField),
                  }}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField("")}
                />
              </div>

              {/* ── Price & Discount ── */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <div>
                  <label style={labelStyle}>
                    Price (₹) <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    style={{
                      ...inputBaseStyle,
                      ...focusStyle("price", focusedField),
                    }}
                    onFocus={() => setFocusedField("price")}
                    onBlur={() => setFocusedField("")}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Discount %</label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    max="100"
                    style={{
                      ...inputBaseStyle,
                      ...focusStyle("discount", focusedField),
                    }}
                    onFocus={() => setFocusedField("discount")}
                    onBlur={() => setFocusedField("")}
                  />
                </div>
              </div>

              {/* ── Category ── */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>
                  Category <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  style={{
                    ...inputBaseStyle,
                    ...focusStyle("category", focusedField),
                    cursor: "pointer",
                    appearance: "none",
                    // Use longhand for background properties to avoid shorthand conflict
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 14px center",
                    paddingRight: 40,
                  }}
                  onFocus={() => setFocusedField("category")}
                  onBlur={() => setFocusedField("")}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ── Colors ── */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Colors</label>
                <div
                  style={{
                    border: "1.5px solid #e5e7eb",
                    borderRadius: 10,
                    padding: "14px 16px",
                    background: "#fafafa",
                  }}
                >
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {COLOR_OPTIONS.map((color) => {
                      const active = selectedColors.includes(color);
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => handleColorToggle(color)}
                          style={{
                            padding: "5px 14px",
                            borderRadius: 8,
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            transition: "all .15s",
                            border: `1.5px solid ${active ? "#1a1a1a" : "#e5e7eb"}`,
                            background: active ? "#1a1a1a" : "#fff",
                            color: active ? "#fff" : "#374151",
                          }}
                        >
                          {color}
                        </button>
                      );
                    })}
                  </div>
                  {selectedColors.length > 0 && (
                    <p
                      style={{
                        margin: "10px 0 0",
                        fontSize: 12,
                        color: "#6b7280",
                      }}
                    >
                      Selected: {selectedColors.join(", ")}
                    </p>
                  )}
                </div>
              </div>

              {/* ── Sizes ── */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Sizes</label>
                <div
                  style={{
                    border: "1.5px solid #e5e7eb",
                    borderRadius: 10,
                    padding: "14px 16px",
                    background: "#fafafa",
                  }}
                >
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {SIZE_OPTIONS.map((size) => {
                      const active = selectedSizes.includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeToggle(size)}
                          style={{
                            width: 52,
                            height: 40,
                            borderRadius: 8,
                            fontSize: 14,
                            fontWeight: 700,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            transition: "all .15s",
                            border: `1.5px solid ${active ? "#1a1a1a" : "#e5e7eb"}`,
                            background: active ? "#1a1a1a" : "#fff",
                            color: active ? "#fff" : "#374151",
                            textTransform: "uppercase",
                          }}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                  {selectedSizes.length > 0 && (
                    <p
                      style={{
                        margin: "10px 0 0",
                        fontSize: 12,
                        color: "#6b7280",
                      }}
                    >
                      Selected: {selectedSizes.join(", ")}
                    </p>
                  )}
                </div>
              </div>

              {/* ── Specifications (multiple) ── */}
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <label style={labelStyle}>Specifications</label>
                  <button
                    type="button"
                    onClick={addSpecification}
                    style={{
                      padding: "4px 12px",
                      fontSize: 12,
                      fontWeight: 600,
                      border: "1.5px solid #1a1a1a",
                      borderRadius: 6,
                      background: "#fff",
                      color: "#1a1a1a",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add
                  </button>
                </div>
                {formData.specifications.map((spec, index) => (
                  <div
                    key={index}
                    style={{ display: "flex", gap: 8, marginBottom: 8 }}
                  >
                    <input
                      type="text"
                      value={spec}
                      onChange={(e) => handleSpecChange(index, e.target.value)}
                      placeholder={`Specification #${index + 1}`}
                      style={{ ...inputBaseStyle, flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        border: "1.5px solid #e5e7eb",
                        background: "#fff",
                        color: "#ef4444",
                        fontSize: 18,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {formData.specifications.length === 0 && (
                  <p style={fieldDesc}>
                    No specifications added. Click "Add" to create one.
                  </p>
                )}
              </div>

              {/* ── Descriptions (multiple) ── */}
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <label style={labelStyle}>Descriptions</label>
                  <button
                    type="button"
                    onClick={addDescription}
                    style={{
                      padding: "4px 12px",
                      fontSize: 12,
                      fontWeight: 600,
                      border: "1.5px solid #1a1a1a",
                      borderRadius: 6,
                      background: "#fff",
                      color: "#1a1a1a",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add
                  </button>
                </div>
                {formData.descriptions.map((desc, index) => (
                  <div
                    key={index}
                    style={{ display: "flex", gap: 8, marginBottom: 8 }}
                  >
                    <textarea
                      value={desc}
                      onChange={(e) => handleDescChange(index, e.target.value)}
                      placeholder={`Description #${index + 1}`}
                      rows={2}
                      style={{ ...inputBaseStyle, flex: 1, resize: "vertical" }}
                    />
                    <button
                      type="button"
                      onClick={() => removeDescription(index)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        border: "1.5px solid #e5e7eb",
                        background: "#fff",
                        color: "#ef4444",
                        fontSize: 18,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {formData.descriptions.length === 0 && (
                  <p style={fieldDesc}>
                    No descriptions added. Click "Add" to create one.
                  </p>
                )}
              </div>

              {/* ── Images ── */}
              <div style={{ marginBottom: 4 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <label style={labelStyle}>
                    Product Images <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <span style={{ fontSize: 14.5, color: "#9ca3af" }}>
                    {imageFiles.length}/5
                  </span>
                </div>

                {/* Upload zone */}
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    border: `1.5px ${imageFiles.length > 0 ? "solid #1a1a1a" : "dashed #d1d5db"}`,
                    borderRadius: 10,
                    padding: "13px 16px",
                    cursor: imageFiles.length >= 5 ? "not-allowed" : "pointer",
                    background: imageFiles.length > 0 ? "#f9f9f9" : "#fafafa",
                    transition: "all .15s",
                    opacity: imageFiles.length >= 5 ? 0.5 : 1,
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={imageFiles.length > 0 ? "#1a1a1a" : "#9ca3af"}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <path d="M9 12l3-3 3 3" />
                    <line x1="12" y1="9" x2="12" y2="16" />
                  </svg>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 15,
                        color: imageFiles.length >= 5 ? "#9ca3af" : "#6b7280",
                      }}
                    >
                      {imageFiles.length >= 5
                        ? "Maximum 5 images reached"
                        : "Click to add images (max 5)"}
                    </p>
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: 12,
                        color: "#9ca3af",
                      }}
                    >
                      PNG, JPG, WEBP
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={imageFiles.length >= 5}
                    style={{ display: "none" }}
                  />
                </label>

                {/* Image previews */}
                {imageFiles.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                      marginTop: 12,
                    }}
                  >
                    {imageFiles.map((file, idx) => (
                      <div key={idx} style={{ position: "relative" }}>
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`preview ${idx}`}
                          style={{
                            width: 72,
                            height: 72,
                            objectFit: "cover",
                            borderRadius: 8,
                            border: "1.5px solid #e5e7eb",
                            display: "block",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          style={{
                            position: "absolute",
                            top: -6,
                            right: -6,
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: "#ef4444",
                            border: "none",
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            lineHeight: 1,
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* ── Footer ── */}
        <hr
          style={{ margin: 0, border: "none", borderTop: "1px solid #e5e7eb" }}
        />
        <div
          style={{
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              padding: "9px 22px",
              border: "1.5px solid #e5e7eb",
              borderRadius: 8,
              background: "#fff",
              color: "#6b7280",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f9fafb";
              e.currentTarget.style.borderColor = "#d1d5db";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: "9px 26px",
              border: "none",
              borderRadius: 8,
              background: loading ? "#555" : "#1a1a1a",
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              transition: "background .15s",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = "#333";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.background = "#1a1a1a";
            }}
          >
            {loading ? (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  style={{ animation: "spin 1s linear infinite" }}
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Adding…
              </>
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { opacity: 1; }
      `}</style>
    </div>
  );
};

export default AddProduct;