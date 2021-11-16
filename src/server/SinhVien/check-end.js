import { settings } from '../../app/config';

let api = settings.hostURL;

const checkEnd = async (MaBaiKT) => {
    let res = '';


    var data = new FormData();
    data.append('MaBaiKT', MaBaiKT);

    var requestOptions = {
        method: 'POST',
        body: data,
        redirect: 'follow',
    };

    await fetch(api + 'BaiKiemTra/check-end.php', requestOptions)
        .then(response => response.json())
        .then(data => {
            res = data;
        })
        .catch(error => console.log('error', error));

    console.log('res: ', res);
    return res;
};

export { checkEnd };
