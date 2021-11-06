import { settings } from '../../app/config';

let api = settings.hostURL;

const tinhKetQua = async (MaGV, MaBaiKT) => {
    let resData = '';

    var data = new FormData();
    data.append('MaGV', MaGV);
    data.append('MaBaiKT', MaBaiKT);

    var requestOptions = {
        method: 'POST',
        body: data,
        redirect: 'follow',
    };

    await fetch(api + 'KetQua/tinh-ket-qua.php', requestOptions)
        .then(response => response.json())
        .then(data => {
            resData = data;
        })
        .catch(error => console.log('error', error));

    return resData;
};

export { tinhKetQua };
