// src/app/components/MovieCategories.tsx

"use client";

import { getCategories } from '@/services/api';
import { useEffect, useState } from 'react';


interface Category {
  id: number;
  name: string;
  userId: number | null;
}

interface MovieCategoriesProps {
  setSelectedCategory: (categoryId: number | null) => void;
}

const MovieCategories: React.FC<MovieCategoriesProps> = ({ setSelectedCategory }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  return (
    <div className="categories">
      <ul className="categories-list">
        
        {categories.map((category) => (
          <li
            key={category.id}
            className="category"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieCategories;
