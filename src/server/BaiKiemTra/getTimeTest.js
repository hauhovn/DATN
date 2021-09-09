import { settings } from '../../app/config';

let api = settings.hostURL;

export const getTimeTest = async (MaBaiKT) => {
    let res = '';

    var data = new FormData();
    data.append('MaBaiKT', MaBaiKT);


    var requestOptions = {
        method: 'POST',
        body: data,
        redirect: 'follow',
    };

    await fetch(api + 'BaiKiemTra/get-time-test.php', requestOptions)
        .then(response => response.json())
        .then(data => {
            res = data;
        })
        .catch(error => console.log('error', error));

    return res;
};
