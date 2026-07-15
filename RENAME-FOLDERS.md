# Required folder renames after unzipping

This download environment can't create folder names containing `[ ]` or `( )`, so those were saved with hyphens instead. Rename these locally before running the app (Next.js needs the exact bracket/paren syntax):

| Rename this | To this |
|---|---|
| `src/app/-marketing-/` | `src/app/(marketing)/` |
| `src/app/-auth-/` | `src/app/(auth)/` |
| `src/app/shop/-category-/` | `src/app/shop/[category]/` |
| `src/app/product/-slug-/` | `src/app/product/[slug]/` |
| `src/app/api/downloads/-id-/` | `src/app/api/downloads/[id]/` |
| `src/app/api/admin/products/-id-/` | `src/app/api/admin/products/[id]/` |

Quick fix (macOS/Linux, from the project root):
```bash
mv src/app/-marketing- "src/app/(marketing)"
mv src/app/-auth- "src/app/(auth)"
mv src/app/shop/-category- "src/app/shop/[category]"
mv src/app/product/-slug- "src/app/product/[slug]"
mv src/app/api/downloads/-id- "src/app/api/downloads/[id]"
mv src/app/api/admin/products/-id- "src/app/api/admin/products/[id]"
```
