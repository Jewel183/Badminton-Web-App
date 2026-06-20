// DropdownMenu.jsx
import React, { useState, useEffect } from "react";
import "./DropdownMenu.css"; 
import { Link } from "react-router-dom";
import {ChevronDown} from 'lucide-react'
// Import tất cả các service cần thiết
import { getProductsOnQuery, getAllCategories, getAllBrands } from "../../services"; 

const DropdownMenu = () => {
    const [menuData, setMenuData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAndBuildMenu = async () => {
            try {
                // 1. Tải đồng thời tất cả 3 nguồn dữ liệu
                const [productsResponse, allCategories, allBrands] = await Promise.all([
                    getProductsOnQuery({ limit: 2000, view: 'public' }),
                    getAllCategories(),
                    getAllBrands()
                ]);

                // 2. Gọi hàm "ghép nối" dữ liệu
                const structuredMenu = buildMenuFromSources(
                    productsResponse.data,
                    allCategories,
                    allBrands
                );
                
                setMenuData(structuredMenu);
            } catch (err) {
                console.error("Lỗi khi xây dựng menu:", err);
                setError("Không thể tải danh mục sản phẩm.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndBuildMenu();
    }, []);

    /**
     * Hàm này là trái tim của giải pháp, nó ghép dữ liệu từ 3 nguồn khác nhau.
     * @param {Array} products - Danh sách sản phẩm chỉ có tên brand/category.
     * @param {Array} allCategories - Danh sách đầy đủ các category {name, slug}.
     * @param {Array} allBrands - Danh sách đầy đủ các brand {name, slug}.
     * @returns {Array} - Mảng menu hoàn chỉnh.
     */
    const buildMenuFromSources = (products, allCategories, allBrands) => {
        if (!products || products.length === 0) return [];

        // 2a. Tạo "Từ điển tra cứu" để tìm slug từ name (rất nhanh)
        const categoryLookup = new Map(allCategories.map(cat => [cat.name, cat]));
        const brandLookup = new Map(allBrands.map(brand => [brand.name, brand]));

        const menuMap = new Map();

        // 3. Lặp qua sản phẩm để xây dựng cấu trúc
        for (const product of products) {
            const categoryName = product.prod;
            const brandName = product.brand;

            // Dùng từ điển để tìm object category và brand hoàn chỉnh
            const category = categoryLookup.get(categoryName);
            const brand = brandLookup.get(brandName);

            // Nếu tìm thấy cả hai (tức là dữ liệu hợp lệ), thì mới xử lý
            if (category && brand) {
                if (!menuMap.has(category.slug)) {
                    menuMap.set(category.slug, {
                        category: category,
                        brands: new Map()
                    });
                }
                const categoryEntry = menuMap.get(category.slug);
                if (!categoryEntry.brands.has(brand.slug)) {
                    categoryEntry.brands.set(brand.slug, brand);
                }
            }
        }

        // Chuyển đổi từ Map về mảng để render
        const finalMenu = Array.from(menuMap.values()).map(entry => ({
            category: entry.category,
            brands: Array.from(entry.brands.values()).sort((a, b) => a.name.localeCompare(b.name))
        }));

        return finalMenu.sort((a, b) => a.category.name.localeCompare(b.category.name));
    };

    // Hàm render một cột trong menu (không thay đổi)
    const renderDropdownColumn = (item) => {
        const { category, brands } = item;
        const displayedBrands = brands.slice(0, 6);
        const hasMoreBrands = brands.length > 6;
        const categoryUrl = `/products?categories=${category.slug}`;

        return (
            <div className="dropdown-column" key={category.slug}>
                <Link to={categoryUrl} className="dropdown-title">
                    {category.name.toUpperCase()}
                </Link>
                <ul className="dropdown-list">
                    {displayedBrands.map(brand => {
                        const brandUrl = `/products?categories=${category.slug}&brands=${brand.slug}`;
                        return (
                            <li key={brand.slug}>
                                <Link to={brandUrl}>{`${category.name} ${brand.name}`} </Link>
                            </li>
                        );
                    })}
                    {hasMoreBrands && (
                        <li><Link to={categoryUrl} className="more-link">Xem thêm</Link></li>
                    )}
                </ul>
            </div>
        );
    };

    return (
        <div className="nav-item-dropdown">
            <Link to="/products" className="nav-link">
                SẢN PHẨM
                <ChevronDown size={15}/>
            </Link>
            
            <div className="dropdown-menu">
                <div className="dropdown-content">
                    {isLoading ? (
                        <p style={{ padding: '20px', color: '#333' }}>Đang tải...</p>
                    ) : error ? (
                        <p style={{ padding: '20px', color: '#d9534f' }}>{error}</p>
                    ) : menuData.length > 0 ? (
                        menuData.map(renderDropdownColumn)
                    ) : (
                        <p style={{ padding: '20px', color: '#333' }}>Không có sản phẩm nào để hiển thị.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DropdownMenu;