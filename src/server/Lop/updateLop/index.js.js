import { settings } from '../../../app/config';

let api = settings.hostURL;

const updateLop = async (MaLop, TenLop, SoLuongSV) => {
    let res = '';

    var data = new FormData();
    data.append('MaLop', MaLop);
    data.append('TenLop', TenLop);
    data.append('SoLuongSV', SoLuongSV);

    var requestOptions = {
        method: 'POST',
        body: data,
        redirect: 'follow',
    };

    await fetch(api + 'Lop/updateLop.php', requestOptions)
        .then(response => response.json())
        .then(data => {
            res = data;
        })
        .catch(error => console.log('error', error));

    return res;
};

export { updateLop };
