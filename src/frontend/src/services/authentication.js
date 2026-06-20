export const loginUser = async ({ emailOrPhone, password }) => {
  const isEmail = emailOrPhone.includes("@");
  const loginType = isEmail ? "email" : "phone";

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ [loginType]: emailOrPhone, password }),
  });

  let data;
  try {
    data = await res.json(); // luôn cố parse JSON
  } catch {
    data = {};
  }

  if (!res.ok) {
    const message = data.message || res.statusText || "Đăng nhập thất bại";
    throw new Error(message);
  }
  return data; // { token, user }
};

export const registerUser = async (data) => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    const err = new Error(errorData.message || "Đăng ký thất bại");
    err.response = { data: errorData }; // thêm field như axios
    throw err;
  }

  return await res.json();
};

export const verifyOtp = async ({ email, otp }) => {
  const res = await fetch("/api/auth/verify-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    const err = new Error(errorData.message || "Xác minh OTP thất bại");
    err.response = { data: errorData };
    throw err;
  }

  return await res.json();
};

export const requestPasswordReset = async (email) => {
  const res = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Lỗi gửi email");
  }
  return res.json();
};

export const resetPassword = async (email, token, newPassword) => {
  const res = await fetch("/api/auth/recover-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, token, newPassword }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Lỗi đặt lại mật khẩu");
  }
  return res.json();
};
