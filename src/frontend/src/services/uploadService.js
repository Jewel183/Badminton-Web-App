export const uploadImage = async (file) => {
    if (!file) throw new Error("Không có file nào được chọn.");

    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch("/api/upload/image", { 
        method: 'POST', 
        body: formData 
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload ảnh thất bại.');
    }

    return response.json();
};

export const deleteImage = async (public_id) => {
    if (!public_id) throw new Error("Cần có public_id để xóa ảnh.");

    const response = await fetch("/api/upload/image", {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể xóa ảnh.');
    }

    return response.json();
};