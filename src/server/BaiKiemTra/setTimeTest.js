import { settings } from '../../app/config';

let api = settings.hostURL;

export const setTimeTest = async (MaBaiKT, time) => {
    let res = '';

    var data = new FormData();
    data.append('MaBaiKT', MaBaiKT);
    data.append('time', time);


    var requestOptions = {
        method: 'POST',
        body: data,
        redirect: 'follow',
    };

    await fetch(api + 'BaiKiemTra/set-time-test.php', requestOptions)
        .then(response => response.json())
        .then(data => {
            res = data;
        })
        .catch(error => console.log('error', error));

    return res;
};
