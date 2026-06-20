export const getProfile = async (token) => {
  const res = await fetch("/api/users/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Không thể tải thông tin người dùng");
  return await res.json();
};

export const updateProfile = async (token, payload) => {
  const res = await fetch("/api/users/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Cập nhật thất bại");
  }

  return await res.json();
};

export const getAllUsers = async (token) => {
  const res = await fetch("/api/users/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Không thể tải danh sách người dùng");
  return await res.json();
};

export const deleteUser = async (id, token) => {
  const res = await fetch(`/api/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Không thể xóa người dùng");
  }
  return await res.json();
};

export const toggleUserStatus = async (id, token) => {
  const res = await fetch(`/api/users/status/${id}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Không thể cập nhật trạng thái");
  }
  return await res.json();
};
