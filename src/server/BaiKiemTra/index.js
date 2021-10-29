import { settings } from '../../app/config';

let api = settings.hostURL;

const getBaiKiemTra = async (MaSV, SoLuong, Page, Status = -1, Type = 'testing') => {


    let res = '';
    var data = new FormData();
    data.append('MaSV', MaSV);
    data.append('Type', Type);
    console.log(`sv: ${MaSV} sl: ${SoLuong} page: ${Page}`);
    if (Status != -1)
        console.log(`tim bai dang làm`);

    if (Page != undefined) {
        data.append('page', Page);
        data.append('quantity', SoLuong);
    } else
        if (SoLuong != undefined) data.append('SoLuong', SoLuong);

    var requestOptions = {
        method: 'POST',
        body: data,
        redirect: 'follow',
    };

    await fetch(api + 'BaiKiemTra/get-bai-kiem-tra.php', requestOptions)
        .then(response => response.json())
        .then(data => {
            res = data;
        })
        .catch(error => console.log('error when getBaiKiemTra', error));
    return res;
};

export { getBaiKiemTra };
