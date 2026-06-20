const BASE_URL = "/api/dashboard";

const commonHeaders = {
  'Content-Type': 'application/json',
};

const handleResponse = async (response) => {
  // fetch không reject promise cho các mã lỗi HTTP, vì vậy chúng ta phải kiểm tra thủ công.
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Không thể phân tích lỗi từ server.' }));
    const errorMessage = errorData.message || `Lỗi HTTP! Trạng thái: ${response.status}`;
    throw new Error(errorMessage);
  }
  // Nếu phản hồi OK, phân tích cú pháp JSON
  return response.json();
};

const dashboardService = {
  getOrderStatistics: async () => {
    try {
      const response = await fetch(`${BASE_URL}/stats/orders`, {
        method: 'GET',
        headers: commonHeaders,
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Lỗi khi lấy thống kê đơn hàng:', error.message);
      throw error;
    }
  },

  getRevenueStatistics: async (period = 'monthly') => {
    // Sử dụng URLSearchParams để xây dựng query string một cách an toàn
    const params = new URLSearchParams({ period });
    const url = `${BASE_URL}/stats/revenue?${params.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: commonHeaders,
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Lỗi khi lấy thống kê doanh thu:', error.message);
      throw error;
    }
  },

  getTopSellingProducts: async (limit = 5) => {
    const params = new URLSearchParams({ limit });
    const url = `${BASE_URL}/stats/top-selling?${params.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: commonHeaders,
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm bán chạy:', error.message);
      throw error;
    }
  },

  getLowStockAlerts: async (threshold = 30) => {
    const params = new URLSearchParams({ threshold });
    const url = `${BASE_URL}/stats/low-stock?${params.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: commonHeaders,
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Lỗi khi lấy cảnh báo tồn kho:', error.message);
      throw error;
    }
  },
};

export default dashboardService;