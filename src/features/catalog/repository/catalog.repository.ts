import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

class CatalogRepository {
  // ---------- Category ----------

  findAllCategories() {
    return prisma.category.findMany({
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      include: {
        _count: { select: { products: true, subCategories: true } },
      },
    });
  }

  findCategoryById(id: string) {
    return prisma.category.findUnique({ where: { id } });
  }

  categorySlugExists(slug: string, excludeId?: string) {
    return prisma.category
      .findFirst({
        where: { slug, ...(excludeId && { NOT: { id: excludeId } }) },
        select: { id: true },
      })
      .then(Boolean);
  }

  createCategory(data: Prisma.CategoryCreateInput) {
    return prisma.category.create({ data });
  }

  updateCategory(id: string, data: Prisma.CategoryUpdateInput) {
    return prisma.category.update({ where: { id }, data });
  }

  async deleteCategory(id: string) {
    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      throw new Error(
        `Can't delete: ${productCount} product(s) still use this category. Move or delete them first.`
      );
    }

    return prisma.category.delete({ where: { id } });
  }

  // ---------- SubCategory ----------

  findAllSubCategories() {
    return prisma.subCategory.findMany({
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      include: {
        category: { select: { id: true, name: true } },
        _count: { select: { products: true } },
      },
    });
  }

  findSubCategoryById(id: string) {
    return prisma.subCategory.findUnique({ where: { id } });
  }

  subCategorySlugExists(slug: string, excludeId?: string) {
    return prisma.subCategory
      .findFirst({
        where: { slug, ...(excludeId && { NOT: { id: excludeId } }) },
        select: { id: true },
      })
      .then(Boolean);
  }

  createSubCategory(data: Prisma.SubCategoryCreateInput) {
    return prisma.subCategory.create({ data });
  }

  updateSubCategory(id: string, data: Prisma.SubCategoryUpdateInput) {
    return prisma.subCategory.update({ where: { id }, data });
  }

  async deleteSubCategory(id: string) {
    const productCount = await prisma.product.count({
      where: { subCategoryId: id },
    });

    if (productCount > 0) {
      throw new Error(
        `Can't delete: ${productCount} product(s) still use this subcategory. Move or delete them first.`
      );
    }

    return prisma.subCategory.delete({ where: { id } });
  }

  // ---------- Brand ----------

  findAllBrands() {
    return prisma.brand.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });
  }

  findBrandById(id: string) {
    return prisma.brand.findUnique({ where: { id } });
  }

  brandSlugExists(slug: string, excludeId?: string) {
    return prisma.brand
      .findFirst({
        where: { slug, ...(excludeId && { NOT: { id: excludeId } }) },
        select: { id: true },
      })
      .then(Boolean);
  }

  createBrand(data: Prisma.BrandCreateInput) {
    return prisma.brand.create({ data });
  }

  updateBrand(id: string, data: Prisma.BrandUpdateInput) {
    return prisma.brand.update({ where: { id }, data });
  }

  async deleteBrand(id: string) {
    const productCount = await prisma.product.count({ where: { brandId: id } });

    if (productCount > 0) {
      throw new Error(
        `Can't delete: ${productCount} product(s) still use this brand. Move or delete them first.`
      );
    }

    return prisma.brand.delete({ where: { id } });
  }
}

export const catalogRepository = new CatalogRepository();
export default catalogRepository;
