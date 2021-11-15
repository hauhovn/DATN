import { getSubjectDetail } from "./LopHP/get-subject-detail";
import { getTestingDetailt } from "./JointTest/get-test-detail";
import { createTestDetailt } from "./BaiKiemTra/create-test-detail";
import { getCTBKT } from "./BaiKiemTra/getCTBKT";
import { getCTBaiKiemTra } from "./BaiKiemTra/getTestDetail";
import { setTimeTest } from "./BaiKiemTra/setTimeTest";
import { getTimeTest } from "./BaiKiemTra/getTimeTest";
import { getTestTimeCountdown } from "./BaiKiemTra/get-time-countdown";
import { getJonedList } from './LopHP/get-joned-list'
import { tinhKetQua } from './KetQua/tinh-ket-qua';
import { addTestTime } from "./SinhVien/add-test-time";
import { getTeacherTime } from "./BaiKiemTra/teacher-time";


export {
    getSubjectDetail,
    getTestingDetailt,
    createTestDetailt,
    getCTBKT,
    getCTBaiKiemTra,
    setTimeTest,
    getTimeTest,
    getTestTimeCountdown,
    getJonedList,
    tinhKetQua,
    addTestTime,
    getTeacherTime
}