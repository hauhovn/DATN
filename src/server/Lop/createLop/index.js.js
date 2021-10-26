import { settings } from '../../../app/config';

let api = settings.hostURL;

const createLop = async (TenLop, SoLuongSV) => {
    let res = '';

    var data = new FormData();
    data.append('TenLop', TenLop);
    data.append('SoLuongSV', SoLuongSV);

    var requestOptions = {
        method: 'POST',
        body: data,
        redirect: 'follow',
    };

    await fetch(api + 'Lop/createLop.php', requestOptions)
        .then(response => response.json())
        .then(data => {
            res = data;
        })
        .catch(error => console.log('error', error));

    return res;
};

export { createLop };
