import { settings } from '../../app/config';

let api = settings.hostURL;

const addTestTime = async (MaSV, MaBaiKT) => {
    let res = '';


    var data = new FormData();
    data.append('MaSV', MaSV);
    data.append('MaBaiKT', MaBaiKT);

    var requestOptions = {
        method: 'POST',
        body: data,
        redirect: 'follow',
    };

    await fetch(api + 'TestTime/add-test-time.php', requestOptions)
        .then(response => response.json())
        .then(data => {
            res = data;
        })
        .catch(error => console.log('error', error));

    console.log('res: ', res);
    return res;
};

export { addTestTime };
