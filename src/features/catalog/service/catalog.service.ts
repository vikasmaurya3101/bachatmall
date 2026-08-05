import catalogRepository from "../repository/catalog.repository";
import {
  CreateCategoryDtoType,
  UpdateCategoryDtoType,
  CreateSubCategoryDtoType,
  UpdateSubCategoryDtoType,
  CreateBrandDtoType,
  UpdateBrandDtoType,
} from "../dto/catalog.dto";

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

class CatalogService {
  // ---------- Category ----------

  getCategories() {
    return catalogRepository.findAllCategories();
  }

  async createCategory(dto: CreateCategoryDtoType) {
    const slug = slugify(dto.slug || dto.name);

    if (await catalogRepository.categorySlugExists(slug)) {
      throw new Error("A category with this name/slug already exists.");
    }

    return catalogRepository.createCategory({
      name: dto.name,
      slug,
      image: dto.image || undefined,
      description: dto.description || undefined,
      isActive: dto.isActive,
      displayOrder: dto.displayOrder,
    });
  }

  async updateCategory(id: string, dto: UpdateCategoryDtoType) {
    const existing = await catalogRepository.findCategoryById(id);
    if (!existing) throw new Error("Category not found.");

    const slug = dto.slug || dto.name ? slugify(dto.slug || dto.name!) : undefined;

    if (slug && (await catalogRepository.categorySlugExists(slug, id))) {
      throw new Error("A category with this name/slug already exists.");
    }

    return catalogRepository.updateCategory(id, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(slug && { slug }),
      ...(dto.image !== undefined && { image: dto.image || null }),
      ...(dto.description !== undefined && { description: dto.description || null }),
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      ...(dto.displayOrder !== undefined && { displayOrder: dto.displayOrder }),
    });
  }

  deleteCategory(id: string) {
    return catalogRepository.deleteCategory(id);
  }

  // ---------- SubCategory ----------

  getSubCategories() {
    return catalogRepository.findAllSubCategories();
  }

  async createSubCategory(dto: CreateSubCategoryDtoType) {
    const category = await catalogRepository.findCategoryById(dto.categoryId);
    if (!category) throw new Error("Selected category doesn't exist.");

    const slug = slugify(dto.slug || dto.name);

    if (await catalogRepository.subCategorySlugExists(slug)) {
      throw new Error("A subcategory with this name/slug already exists.");
    }

    return catalogRepository.createSubCategory({
      name: dto.name,
      slug,
      image: dto.image || undefined,
      isActive: dto.isActive,
      displayOrder: dto.displayOrder,
      category: { connect: { id: dto.categoryId } },
    });
  }

  async updateSubCategory(id: string, dto: UpdateSubCategoryDtoType) {
    const existing = await catalogRepository.findSubCategoryById(id);
    if (!existing) throw new Error("Subcategory not found.");

    if (dto.categoryId) {
      const category = await catalogRepository.findCategoryById(dto.categoryId);
      if (!category) throw new Error("Selected category doesn't exist.");
    }

    const slug = dto.slug || dto.name ? slugify(dto.slug || dto.name!) : undefined;

    if (slug && (await catalogRepository.subCategorySlugExists(slug, id))) {
      throw new Error("A subcategory with this name/slug already exists.");
    }

    return catalogRepository.updateSubCategory(id, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(slug && { slug }),
      ...(dto.image !== undefined && { image: dto.image || null }),
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      ...(dto.displayOrder !== undefined && { displayOrder: dto.displayOrder }),
      ...(dto.categoryId && { category: { connect: { id: dto.categoryId } } }),
    });
  }

  deleteSubCategory(id: string) {
    return catalogRepository.deleteSubCategory(id);
  }

  // ---------- Brand ----------

  getBrands() {
    return catalogRepository.findAllBrands();
  }

  async createBrand(dto: CreateBrandDtoType) {
    const slug = slugify(dto.slug || dto.name);

    if (await catalogRepository.brandSlugExists(slug)) {
      throw new Error("A brand with this name/slug already exists.");
    }

    return catalogRepository.createBrand({
      name: dto.name,
      slug,
      logo: dto.logo || undefined,
      description: dto.description || undefined,
      isActive: dto.isActive,
    });
  }

  async updateBrand(id: string, dto: UpdateBrandDtoType) {
    const existing = await catalogRepository.findBrandById(id);
    if (!existing) throw new Error("Brand not found.");

    const slug = dto.slug || dto.name ? slugify(dto.slug || dto.name!) : undefined;

    if (slug && (await catalogRepository.brandSlugExists(slug, id))) {
      throw new Error("A brand with this name/slug already exists.");
    }

    return catalogRepository.updateBrand(id, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(slug && { slug }),
      ...(dto.logo !== undefined && { logo: dto.logo || null }),
      ...(dto.description !== undefined && { description: dto.description || null }),
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
    });
  }

  deleteBrand(id: string) {
    return catalogRepository.deleteBrand(id);
  }
}

export const catalogService = new CatalogService();
export default catalogService;
