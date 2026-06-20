"use client"

import { useState, useEffect, useRef } from "react"
import "./ProfilePage.css"
// import { useNavigate } from "react-router-dom"
import { Pencil, Eye, EyeOff, Check, X } from "lucide-react"
import { getProfile, updateProfile } from "../../services"
import { usePopup } from "../../components/common/popupContext"

const ProfilePage = () => {
  const inputRefs = useRef({})
  // const navigate = useNavigate()

  // State lưu giá trị form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [originalData, setOriginalData] = useState({})

  // State lưu lỗi
  const [errors, setErrors] = useState({})
  const [editField, setEditField] = useState(null)

  const [showPasswordSection, setShowPasswordSection] = useState(false)

  const { showPopup } = usePopup()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token")
        const data = await getProfile(token)
        const profileData = {
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          gender: data.gender || "",
          date_of_birth: data.date_of_birth ? data.date_of_birth.split("T")[0] : "",
        }
        setFormData((prev) => ({
          ...prev,
          ...profileData,
        }))
        setOriginalData(profileData)
      } catch (err) {
        console.error("Lỗi khi tải thông tin người dùng:", err)
      }
    }
    fetchUserProfile()
  }, [])

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Xóa lỗi khi người dùng bắt đầu nhập
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
  }

  const handleEditClick = (fieldName) => {
    setEditField(fieldName)
    setTimeout(() => {
      inputRefs.current[fieldName]?.focus()
    }, 0)
  }

  const handleSaveField = async (fieldName) => {
    // Validate field is not empty
    if (!formData[fieldName].trim()) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "Trường này không được để trống, thông tin sẽ không được lưu",
      }))
      return
    }

    // Validate email format if it's email field
    if (fieldName === "email" && !/\S+@\S+\.\S+/.test(formData[fieldName])) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "Email không hợp lệ",
      }))
      return
    }

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")
      const payload = {
        [fieldName]: formData[fieldName],
      }

      await updateProfile(token, payload)
      setOriginalData((prev) => ({
        ...prev,
        [fieldName]: formData[fieldName],
      }))
      setEditField(null)
      showPopup("Thông báo", "Cập nhật thông tin thành công", null, null, 4, 2)
    } catch (err) {
      console.error("Update error:", err.response?.data)
      showPopup("Lỗi", err.message || "Lỗi khi cập nhật thông tin", null, null, 4, 2)
    }
  }

  const handleCancelEdit = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: originalData[fieldName] || "",
    }))
    setEditField(null)
    setErrors((prev) => ({
      ...prev,
      [fieldName]: "",
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (showPasswordSection) {
      // Nếu chỉ nhập 1 trong 3 ô mật khẩu thì báo lỗi
      const passwordFields = [formData.currentPassword, formData.newPassword, formData.confirmPassword]
      const filledPasswordCount = passwordFields.filter(Boolean).length

      if (filledPasswordCount > 0 && filledPasswordCount < 3) {
        if (!formData.currentPassword) {
          newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại"
        }
        if (!formData.newPassword) {
          newErrors.newPassword = "Vui lòng nhập mật khẩu mới"
        }
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới"
        }
      }

      // So sánh mật khẩu mới và xác nhận
      if (formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Mật khẩu nhập lại không khớp"
      }
    }

    setErrors(newErrors)

    // Nếu không có lỗi thì lưu và chuyển trang
    if (Object.keys(newErrors).length === 0) {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token")

        const payload = {
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined,
        }

        await updateProfile(token, payload)
        showPopup("Thông báo", "Đổi mật khẩu thành công", null, null, 4, 2)

        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }))
        setShowPasswordSection(false)
      } catch (err) {
        console.error("Update error:", err.response?.data)
        showPopup("Lỗi", err.message || "Lỗi khi cập nhật mật khẩu", null, null, 4, 2)
      }
    }
  }

  const fields = [
    { label: "Tên đăng nhập", name: "name", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Số điện thoại", name: "phone", type: "text" },
    { label: "Giới tính", name: "gender", type: "text" },
    { label: "Ngày sinh", name: "date_of_birth", type: "date" },
  ]

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  return (
    <div className="profile-page">
      <div className="profile-box">
        <h2 className="profile-title">Hồ sơ của tôi</h2>
        <p className="profile-subtitle">Quản lí thông tin hồ sơ để bảo mật tài khoản</p>

        <div className="profile-form">
          {fields.map((f) => (
            <div className="form-row" key={f.name}>
              <label>{f.label}</label>
              <div className="field-container">
                {editField === f.name ? (
                  <div className="edit-mode">
                    <input
                      type={f.type}
                      name={f.name}
                      value={formData[f.name]}
                      onChange={handleChange}
                      ref={(el) => (inputRefs.current[f.name] = el)}
                      placeholder="Nhập thông tin"
                      className={errors[f.name] ? "input-error" : ""}
                    />
                    <div className="edit-buttons">
                      <button type="button" onClick={() => handleSaveField(f.name)} className="btn-confirm" title="Lưu">
                        <Check size={16} />
                      </button>
                      <button type="button" onClick={() => handleCancelEdit(f.name)} className="btn-cancel" title="Hủy">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="display-mode">
                    <span className="field-value">{formData[f.name] || "Chưa có thông tin"}</span>
                    <button
                      type="button"
                      onClick={() => handleEditClick(f.name)}
                      className="btn-edit"
                      title="Chỉnh sửa"
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                )}
                {errors[f.name] && <span className="error-text">{errors[f.name]}</span>}
              </div>
            </div>
          ))}

          <div className="password-section">
            {!showPasswordSection ? (
              <button type="button" onClick={() => setShowPasswordSection(true)} className="btn-change-password">
                Đổi mật khẩu
              </button>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="password-title">Đổi mật khẩu:</h3>

                {/* Mật khẩu hiện tại */}
                <div className="pass-form-row">
                  <label>Mật khẩu hiện tại:</label>
                  <div className="input-wrapper">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Nhập mật khẩu hiện tại"
                      className={errors.currentPassword ? "input-error" : ""}
                    />
                    <span
                      className="eye-icon"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          current: !prev.current,
                        }))
                      }
                    >
                      {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                  </div>
                  {errors.currentPassword && <span className="error-text">{errors.currentPassword}</span>}
                </div>

                {/* Mật khẩu mới */}
                <div className="pass-form-row">
                  <label>Mật khẩu mới:</label>
                  <div className="input-wrapper">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Nhập mật khẩu mới"
                      className={errors.newPassword ? "input-error" : ""}
                    />
                    <span
                      className="eye-icon"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          new: !prev.new,
                        }))
                      }
                    >
                      {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                  </div>
                  {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
                </div>

                {/* Nhập lại mật khẩu */}
                <div className="pass-form-row">
                  <label>Nhập lại mật khẩu mới:</label>
                  <div className="input-wrapper">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Xác nhận mật khẩu mới"
                      className={errors.confirmPassword ? "input-error" : ""}
                    />
                    <span
                      className="eye-icon"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                    >
                      {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                  </div>
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>

                <div className="password-buttons">
                  <button type="submit" className="btn-save">
                    Lưu mật khẩu
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordSection(false)
                      setFormData((prev) => ({
                        ...prev,
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      }))
                      setErrors((prev) => ({
                        ...prev,
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      }))
                    }}
                    className="btn-cancel-password"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
