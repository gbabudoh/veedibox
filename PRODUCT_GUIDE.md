# Veedibox Digital Product Creation & Upload Guide

This guide explains how to prepare, format, size, and upload digital assets (Wall Art, Stock Images, Templates, and Bundles) onto the Veedibox platform so they render perfectly with active watermark previews.

## 1. Preparing the Digital Products (Design & Export)

To deliver a high-quality experience to paying buyers while keeping preview files lightweight, split each product into two components:
*   **The Preview Image**: A watermarked, optimized visual preview representing the product.
*   **The Deliverable Files**: The actual, high-resolution original source files the customer receives after successful checkout.

### Recommended Specifications by Category

#### A. Wall Art
*   **Source Dimensions**: Create designs in high-resolution aspect ratios. The industry standard is 300 DPI to ensure sharp prints:
    *   **2:3 Ratio**: e.g., 24x36in (7200x10800px)
    *   **3:4 Ratio**: e.g., 18x24in (5400x7200px)
    *   **4:5 Ratio**: e.g., 16x20in (4800x6000px)
*   **Preview Image**: Export a portrait or landscape JPG or PNG scaled down to 1600px (longest side) at 72 DPI to keep pages loading quickly.
*   **Deliverables**: Pack your high-res 300 DPI PDF files (designed for print output) into a single .zip archive.

#### B. Stock Images
*   **Source Dimensions**: At least 4000x6000px (or 24 Megapixels) in raw JPG or TIFF.
*   **Preview Image**: Downscale the photo to 1200px on the longest side.
*   **Deliverables**: The raw, uncompressed high-resolution JPG or PNG file.

#### C. Templates (Canva, Figma, Photoshop, etc.)
*   **Preview Image**: Create a mock-up image showing the template structure/layout (e.g., 1200x900px layout card).
*   **Deliverables**: If it's a Photoshop/Illustrator template, upload a .zip containing the .psd or .ai file. If it's a Canva link, create a clean PDF document containing the clickable template link, and upload that PDF as the deliverable.

#### D. Bundles
*   **Preview Image**: A compilation grid showcasing the contents included in the bundle.
*   **Deliverables**: Put all assets together inside a single compressed .zip file.

---

## 2. Dynamic Platform Upload (Step-by-Step)

Once files are exported and organized, log into the Veedibox Admin Panel to list them:

### Step 1: Access the Catalog category
1. Go to the Admin dashboard path: http://localhost:3000/admin
2. Select your category from the admin sidebar (e.g., Wall Art, Stock Images, Templates, or Bundles).

### Step 2: Add Product
1. Click the **+ Add [Category]** button in the top-right corner to open the upload modal.
2. Complete the primary text fields:
    *   **Title**: Give your product a descriptive name (e.g., Rise & Build Quote Print).
    *   **Style**: The aesthetic keyword used in search filtering (e.g., Typography, Minimalist, Modern).
    *   **Description**: Write a description detailing what the asset is.
    *   **Formats**: Mention format options (e.g., JPG, PNG, Print PDF).
    *   **Dimensions**: State printing sizes (e.g., 3 files up to 24x36in).
    *   **Price**: Set the USD selling price.

### Step 3: Enter Category Metadata
Fill in the dynamically rendered inputs based on your category:
*   **Wall Art**: Select Orientation (Portrait, Landscape, Square) and print sizes.
*   **Stock**: Input image count and camera resolution.
*   **Templates**: Specify required software (e.g., Photoshop, Canva) and layer count.
*   **Bundles**: Input item count and bundle discount percentage.

### Step 4: Upload the Visual Preview
1. Click the **Preview image** box.
2. Choose your lightweight, low-resolution preview image.
3. This file will upload to the `veedibox-previews` S3 bucket. Veedibox automatically signs this URL through imgproxy to display it with the brand watermark on public pages.

### Step 5: Upload Deliverable Files
1. Click **+ Add file** under Deliverable files to add a delivery slot.
2. Provide a File Label (e.g., High-Res Print PDF or Complete ZIP Package).
3. Select whether the file is **Digital** or **Print**.
4. Click the upload box in that row and select your final, high-resolution original file (S3-secured ZIP/PDF/JPG).
5. Repeat for any additional files you want to include in the purchase.

### Step 6: Save
Once uploads complete successfully, click **Save Product**. The item is immediately active and searchable in the storefront!
