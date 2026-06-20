/**
 * Hàm trợ giúp để xử lý các phản hồi từ fetch.
 * Nó kiểm tra lỗi HTTP và phân tích cú pháp JSON.
 * @param {Response} response - Đối tượng Response từ fetch
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Không thể phân tích lỗi từ server.' }));
    const errorMessage = errorData.message || `Lỗi HTTP! Trạng thái: ${response.status}`;
    throw new Error(errorMessage);
  }
  return response.json();
};

/**
 * Gửi một đánh giá mới cho một sản phẩm trong một đơn hàng cụ thể.
 * @param {object} ratingData - Dữ liệu đánh giá.
 */
export const createRating = async (ratingData) => {
  try {
    const response = await fetch("/api/ratings/createRating", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ratingData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Lỗi khi tạo đánh giá:', error.message);
    throw error;
  }
};

/**
 * Lấy tất cả đánh giá của một sản phẩm, có thể giới hạn số lượng.
 * @param {string} productId - ID của sản phẩm cần lấy đánh giá.
 * @param {number} [limit] - (Tùy chọn) Số lượng đánh giá tối đa muốn lấy.
 */
export const getRatingsByProduct = async (productId, limit) => {
  const params = new URLSearchParams();
  if (limit) {
    params.append('limit', limit);
  }
  
  const queryString = params.toString();
  const url = `/api/ratings/product/${productId}${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Lỗi khi lấy đánh giá cho sản phẩm ${productId}:`, error.message);
    throw error;
  }
};