import { forwardRef } from 'react';
import {
    Icon as IconifyIcon,
    enableCache,
} from '@iconify/react';

enableCache('local');

const icons = {
    At: 'fa:at',
    Calendar: 'mdi:calendar-blank',
    ChartLine: 'fa-solid:chart-line',
    Check: 'mdi:check',
    CheckCircle: 'fa-regular:check-circle',
    CheckCircleSolid: 'fa:check-circle',
    ChevronDown: 'mdi:chevron-down',
    ChevronLeft: 'mdi:chevron-left',
    ChevronRight: 'mdi:chevron-right',
    ChevronUp: 'mdi:chevron-up',
    Close: 'mdi:close',
    CloseCircle: 'mdi:close-circle-outline',
    Coins: 'fa-solid:coins',
    CommentAlert: 'mdi:comment-alert-outline',
    Copy: 'fa-solid:copy',
    DocumentTable: 'fluent:document-table-24-filled',
    Dollar: 'healthicons:dollar-negative',
    Download: 'mdi:download',
    Eye: 'fa-solid:eye',
    EyeSlash: 'fa-solid:eye-slash',
    ExchangeAlt: 'fa-solid:exchange-alt',
    Facebook: 'ic:baseline-facebook',
    FileInvoiceDollar: 'fa-solid:file-invoice-dollar',
    Home: 'fa-solid:home',
    Image: 'bi:image',
    InfoCircle: 'fa-solid:info-circle',
    Infomation: 'mdi:information-outline',
    List: 'fa-solid:list',
    Loading: 'mdi:loading',
    Logout: 'ls:logout',
    Mail: 'ic:baseline-email',
    Menu: 'ic:round-menu',
    QuestionCircle: 'fa-solid:question-circle',
    Share: 'fa-solid:share-alt',
    ThumbUp: 'mdi:thumb-up-outline',
    TimesCircle: 'fa:times-circle',
    Upload: 'ic:outline-file-upload',
    User: 'fa-solid:user',
    Warning: 'ant-design:warning-outlined',
    WarningCircle: 'mi:circle-warning',
    Web: 'mdi:web',
};

export const IconType = Object.keys(icons);

const Icon = (props, ref) => {
    const { icon } = props;
    const iconifyId = icons[icon];

    return <IconifyIcon {...props} icon={iconifyId} ref={ref} />;
};

export default forwardRef(Icon);
