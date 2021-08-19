import { settings } from '../../app/config';

let api = settings.hostURL;

const getSubjectDetail = async (MaLopHP, MaBaiKT) => {
    let res = '';

    var data = new FormData();
    data.append('MaLopHP', MaLopHP);
    data.append('MaBaiKT', MaBaiKT);

    console.log(MaBaiKT);

    var requestOptions = {
        method: 'POST',
        body: data,
        redirect: 'follow',
    };

    await fetch(api + 'LopHocPhan/get-subject-detail.php', requestOptions)
        .then(response => response.json())
        .then(data => {
            res = data;
        })
        .catch(error => console.log('error', error));

    return res;
};

export { getSubjectDetail };
