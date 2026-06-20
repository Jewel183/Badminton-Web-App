export const createPromotion = async (promotionData) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;

  const res = await fetch("/api/promotions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(promotionData)
  });

  const data = await res.json();

  if (!res.ok) 
    throw new Error(data.message || 'Tạo chiến dịch thất bại.');

  return data;
};

// xem toàn bộ chiến dịch khuyến mãi
export const getAllPromotions = async () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;
    
  const res = await fetch("/api/promotions", {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) 
    throw new Error(`Không thể tải danh sách chiến dịch khuyến mãi`);

  return await res.json(); 
};

// xem chi tiết 1 chiên dịch khuyến mãi
export const getPromotionById = async(promotionId) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) return;

  const res = await fetch(`/api/promotions/${promotionId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) 
    throw new Error("Lỗi! Không thể xem chi tiết chiến dịch");

  const data = await res.json();
  return data.promotion;
}

// xóa một chiến dịch khuyến mãi
export const deletePromotion = async (promotionId) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) return;

  const res = await fetch(`/api/promotions/${promotionId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok)
    throw new Error('Xoá chiến dịch thất bại');

  return await res.json();
};

// thêm mã giảm giá vào chiến dịch
export const addCodeToPromotion = async (promotionId, codes) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;

  const res = await fetch(`/api/promotions/${promotionId}/codes/add`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ codes })
  });

  if (!res.ok) 
    throw new Error('Failed to add discount codes');

  return await res.json();
};

// thêm sản phẩm vào chiến dịch + áp mã giảm giá
export const addProductToPromotion = async ({ promotionId, productId, code }) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) return; 

  const res = await fetch(`/api/promotions/${promotionId}/products/add-and-apply-code`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      productDiscounts: [{ productId, code }],
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Lỗi khi áp dụng mã");

  return data;
};

// xóa mã giảm giá
export const removeCodeFromPromotion = async (promotionId, codes) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) return;

  const res = await fetch(`/api/promotions/${promotionId}/codes/remove`,  {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ codes }),
  });

  if (!res.ok)
    throw new Error('Không thể xóa mã giảm giá');

  return await res.json();
}

// xóa sản phẩm khỏi chiến dịch
export const removeProductFromPromotion = async (promotionId, productId) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) return;

  const res = await fetch(`/api/promotions/${promotionId}/products/remove-product`,  {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ productId }),
  });

  if (!res.ok)
    throw new Error('Không thể xóa sản phẩm khỏi chiến dịch');

  return await res.json();
}

// chỉnh sửa promotion 
export const updatePromotion = async (promotionId, updatedData) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) return;

  const res = await fetch(`/api/promotions/${promotionId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedData)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(res.message || 'Cập nhật chiến dịch thất bại.');
  }

  return data; 
};

// thay đổi trạng thái promotion
export const togglePromotionStatus = async (promotionId) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) return;

  const res = await fetch(`/api/promotions/${promotionId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || 'Thay đổi trạng thái thất bại');

  return data.promotion;
};
