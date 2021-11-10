import { getBaiKiemTra } from './BaiKiemTra'
import { JointTest } from './JointTest'
import { UpdateQuestion } from './JointTest/update-answer'
import { getTestStatus } from './BaiKiemTra/get-status'
import { getSoCauDung } from './BaiKiemTra/get-so-cau-dung'
import { getTestTimeCountdown } from './BaiKiemTra/get-time-countdown'
import { getCTBaiKiemTra } from './BaiKiemTra/getTestDetail'
import { getLopHocPhan } from './SinhVien/get-lop-hoc-phan'

export {
    getBaiKiemTra,
    UpdateQuestion,
    JointTest,
    getTestStatus,
    getTestTimeCountdown,
    getSoCauDung,
    getCTBaiKiemTra,
    getLopHocPhan
}