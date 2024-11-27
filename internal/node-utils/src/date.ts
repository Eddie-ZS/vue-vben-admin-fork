import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone'; // dependent on utc plugin
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
// 设置默认时区
dayjs.tz.setDefault('Asia/Shanghai');

const dateUtil = dayjs;

export { dateUtil };
