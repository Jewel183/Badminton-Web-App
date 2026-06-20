export const getAllBrands = async () => {
    const res = await fetch("/api/brands");
    if (!res.ok) throw new Error("Không thể tải danh sách thương hiệu");
    return res.json();
};

export const createBrandByName = async (name) => {
    const response = await fetch("/api/brands", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tạo thương hiệu mới.');
    }
    return await response.json();
};
