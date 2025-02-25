import { settings } from '../../app/config';

let api = settings.hostURL;

export const updateTestStatus = async (MaGV, MaBaiKT, toStatus, toNewTime = -1) => {
    let res = '';

    var data = new FormData();
    data.append('MaBaiKT', MaBaiKT);
    data.append('MaGV', MaGV);
    data.append('toStatus', toStatus);

    if (toNewTime != -1) {
        // Set test time
        data.append('toNewTime', toNewTime);
    }

    console.log(`thong tin: ${MaBaiKT} - ${MaGV} - ${toStatus}`);

    var requestOptions = {
        method: 'POST',
        body: data,
        redirect: 'follow',
    };

    await fetch(api + 'BaiKiemTra/update-status.php', requestOptions)
        .then(response => response.json())
        .then(data => {
            res = data;
        })
        .catch(error => console.log('error', error));

    return res;
};
