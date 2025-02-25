import { settings } from '../../app/config';

let api = settings.hostURL;

const getBaiKiemTraTheoLopHocPhan = async (MaSV, MaLopHP, SoLuong, Page, Type = 'testing') => {


    let res = '';
    var data = new FormData();
    data.append('MaSV', MaSV);
    data.append('MaLopHP', MaLopHP);
    data.append('Type', Type)

    //console.log(`123 xem no: SV-${MaSV} Lop-${MaLopHP} SL-${SoLuong} Page-${Page} Type-${Type}`);

    if (Page != undefined) {
        data.append('page', Page);
        data.append('quantity', SoLuong);
    }

    var requestOptions = {
        method: 'POST',
        body: data,
        redirect: 'follow',
    };

    await fetch(api + 'BaiKiemTra/get-bai-kiem-tra-theo-LPH.php', requestOptions)
        .then(response => response.json())
        .then(data => {
            res = data;
        })
        .catch(error => console.log('error', error));
    return res;
};

export { getBaiKiemTraTheoLopHocPhan };
