const Api = {
    companyDetails: () => request('company/details'),
    socialContributions: () => request('social/contributions'),
    technologyDetails: () => request('technology/details'),
    rdDetail: () => request('rd/detail'),
    customerDistribut: () => request('customer/distribut'),
    marketingDetails: () => request('marketing/details'),
    customerService: () => request('customer/service'),
    employeeDetails: () => request('employee/details'),
    qualityDetail: () => request('quality/detail'),
    operationDetail: () => request('operation/detail'),
}

//统一request方法
function request(api, dataModel = '02') {
    const baseApi = 'http://172.20.0.46:8080/api/dashboard/'
    const dataSize = '5'
    const sourceCompany = '百年通'
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${baseApi}${api}?dataModel=${dataModel}&dataSize=${dataSize}&sourceCompany=${sourceCompany}`,
            type: 'POST',
            success: function (res) {
                if(res.success == 1) {
                    resolve(res.data);
                } else {
                    reject(res);
                }
            },
            error: function (err) {
                reject(err);
            }
        })
    })
}
