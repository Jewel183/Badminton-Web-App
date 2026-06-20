import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        try {
            window.scrollTo({
                top: 0,
                left: 0,
                // behavior: 'instant' // Tuỳ chọn: đảm bảo cuộn ngay lập tức không có hiệu ứng trượt
            });
        } catch (e) {
            window.scrollTo(0, 0);
        }
    }, [pathname]); // Chỉ trigger khi đường dẫn chính (pathname) thay đổi

    return null;
};

export default ScrollToTop;