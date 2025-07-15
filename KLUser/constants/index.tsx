// export const baseURL = "http://172.168.10.167:3300"
// export const baseURL = "http://10.10.104.84:3300"
export const baseURL = "http://192.168.236.126:3300"

import moment from 'moment';
import 'moment/locale/vi'; // Import Vietnamese locale

moment.updateLocale('vi', {
    relativeTime: {
        future: '%s tới',
        past: '%s trước',
        s: 'vài giây',
        m: '1 phút',
        mm: '%d phút',
        h: '1 giờ',
        hh: '%d giờ',
        d: '1 ngày',
        dd: '%d ngày',
        M: '1 tháng',
        MM: '%d tháng',
        y: '1 năm',
        yy: '%d năm',
    },
});
export const formatTimeAgo = (date: string) => {
    return moment(date).fromNow(); // Example: "2 ngày trước", "1 giờ trước"
};
