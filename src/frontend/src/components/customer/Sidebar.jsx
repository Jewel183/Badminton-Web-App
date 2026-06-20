import React, { useState } from "react";
import "./Sidebar.css";

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({}); // Lưu trạng thái mở/đóng của từng mục

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Danh sách danh mục sản phẩm
  const menuItems = [
    { key: "vot", label: "Vợt cầu lông" },
    { key: "giay", label: "Giày cầu lông" },
    { key: "balo", label: "Balo cầu lông" },
    { key: "tui", label: "Túi vợt cầu lông" },
    { key: "ao", label: "Áo cầu lông" },
    { key: "quanvay", label: "Quần/váy cầu lông" },
    { key: "phukien", label: "Phụ kiện cầu lông" },
  ];

  return (
    <div className="sidebar-wrapper">
      <h3 className="sidebar-title">Danh mục sản phẩm</h3>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.key} className="sidebar-item">
            <div className="sidebar-toggle" onClick={() => toggleMenu(item.key)}>
              <span>{item.label}</span>
              <span className="sidebar-arrow">
                {openMenus[item.key] ? "⌄" : "›"}
              </span>
            </div>

            {openMenus[item.key] && (
              <ul className="sidebar-submenu">
                <li>sp1</li>
                <li>sp2</li>
                <li>sp3</li>
                <li>sp4</li>
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export { Sidebar };