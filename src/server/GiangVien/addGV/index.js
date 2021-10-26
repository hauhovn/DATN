import { settings } from '../../../app/config';

let api = settings.hostURL;

const createGV = async (
    TenGV,
    GioiTinh,
    DiaChi,
    SDT,
    Mail,
    Password,
    isAdmin,
) => {
    let res = '';

    console.log(
        'TenGV: ',
        TenGV,
        ' GioiTinh: ',
        GioiTinh,
        ' DiaChi: ',
        DiaChi,
        ' SDT: ',
        SDT,
    );

    var data = new FormData();
    data.append('TenGV', TenGV);
    data.append('GioiTinh', GioiTinh);
    data.append('DiaChi', DiaChi);
    data.append('Password', Password);
    data.append('Mail', Mail);
    data.append('isAdmin', isAdmin);

    var requestOptions = {
        method: 'POST',
        body: data,
        redirect: 'follow',
    };

    await fetch(api + 'GiangVien/createGV.php', requestOptions)
        .then(response => response.json())
        .then(data => {
            res = data;
        })
        .catch(error => console.log('error', error));

    console.log('res: ', res);
    return res;
};

export { createGV };
