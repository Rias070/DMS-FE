import { API_BASE_URL } from '../config/api';
import { Category } from '../types/category';

class CategoryService {
  private baseUrl = `${API_BASE_URL}/Categories`;

  async getAll(): Promise<Category[]> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
}

export const categoryService = new CategoryService();
export default categoryService;
