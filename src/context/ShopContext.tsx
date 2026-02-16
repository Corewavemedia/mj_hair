
import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

// Define the types for our data (flexible "any" for now based on existing code, or infer from usage)
// In the existing code, products and categories are arrays of objects.
// defining loose types to match the current usage in components

interface ShopContextType {
    products: any[];
    categories: any[];
    isLoading: boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider = ({ children }: { children: ReactNode }) => {
    const products = useQuery(api.products.getProducts);
    const categories = useQuery(api.products.getCategories);

    // If products or categories are undefined, it means they are loading
    const isLoading = products === undefined || categories === undefined;

    const value = {
        products: products || [],
        categories: categories || [],
        isLoading,
    };

    return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => {
    const context = useContext(ShopContext);
    if (context === undefined) {
        throw new Error("useShop must be used within a ShopProvider");
    }
    return context;
};
